import { RankingError, normalizeRankingError } from './adapter.js';

export const REQUEST_TIMEOUT_MS = 8_000;
export const MAX_PARALLEL_REQUESTS = 2;

function aborted(signal) {
  return signal.reason instanceof RankingError ? signal.reason : new RankingError('aborted');
}

function untilAborted(promise, signal) {
  if (signal.aborted) return Promise.reject(aborted(signal));
  return new Promise((resolve, reject) => {
    const onAbort = () => reject(aborted(signal));
    signal.addEventListener('abort', onAbort, { once: true });
    Promise.resolve(promise).then(resolve, reject).finally(() => signal.removeEventListener('abort', onAbort));
  });
}

export function retryDelay(retryAfter, now) {
  if (typeof retryAfter === 'number' && retryAfter >= 0 && Number.isFinite(retryAfter * 1_000)) return retryAfter * 1_000;
  if (typeof retryAfter === 'string' && /^\d+(\.\d+)?$/.test(retryAfter.trim())) {
    const duration = Number(retryAfter) * 1_000;
    return Number.isFinite(duration) ? duration : 250;
  }
  if (typeof retryAfter === 'string') {
    const timestamp = Date.parse(retryAfter);
    if (Number.isFinite(timestamp) && Number.isFinite(now)) return Math.max(0, timestamp - now);
  }
  return 250;
}

/** One queue bounds active attempts, including retries, across all cards. */
export function createRequestRunner({ setTimer = setTimeout, clearTimer = clearTimeout, now = Date.now } = {}) {
  let active = 0;
  const queue = [];

  function drain() {
    while (active < MAX_PARALLEL_REQUESTS && queue.length) {
      const job = queue.shift();
      job.signal.removeEventListener('abort', job.cancel);
      if (job.signal.aborted) {
        job.reject(aborted(job.signal));
        continue;
      }
      active += 1;
      Promise.resolve().then(job.task).then(job.resolve, job.reject).finally(() => {
        active -= 1;
        drain();
      });
    }
  }

  function enqueue(task, signal) {
    return new Promise((resolve, reject) => {
      const job = { task, signal, resolve, reject, cancel: null };
      job.cancel = () => {
        const index = queue.indexOf(job);
        if (index >= 0) queue.splice(index, 1);
        reject(aborted(signal));
      };
      if (signal.aborted) return reject(aborted(signal));
      signal.addEventListener('abort', job.cancel, { once: true });
      queue.push(job);
      drain();
    });
  }

  async function attempt(task, parentSignal) {
    if (parentSignal.aborted) throw aborted(parentSignal);
    const controller = new AbortController();
    const cancel = () => controller.abort(aborted(parentSignal));
    parentSignal.addEventListener('abort', cancel, { once: true });
    const timer = setTimer(() => controller.abort(new RankingError('timeout')), REQUEST_TIMEOUT_MS);
    try {
      return await untilAborted(Promise.resolve().then(() => task(controller.signal)), controller.signal);
    } finally {
      clearTimer(timer);
      parentSignal.removeEventListener('abort', cancel);
    }
  }

  async function delay(duration, signal) {
    // Chunk very long Retry-After values instead of overflowing setTimeout.
    let remaining = duration;
    while (remaining > 0) {
      const chunk = Math.min(remaining, 2_147_483_647);
      let timer;
      try {
        await untilAborted(new Promise(resolve => { timer = setTimer(resolve, chunk); }), signal);
      } finally {
        clearTimer(timer);
      }
      remaining -= chunk;
    }
    if (signal.aborted) throw aborted(signal);
  }

  async function run(task, signal) {
    for (let number = 0; number < 2; number += 1) {
      try {
        return await enqueue(() => attempt(task, signal), signal);
      } catch (error) {
        const failure = normalizeRankingError(error);
        if (signal.aborted || !failure.transient || number === 1) throw failure;
        await delay(retryDelay(failure.retryAfter, now()), signal);
      }
    }
  }

  return { run };
}
