#!/usr/bin/env node

/**
 * Capture the published product home/title screen from a hash-verified local
 * replay bundle. No interaction is sent to the product. Every browser request
 * is either fulfilled from the local bundle or aborted before network access.
 *
 * Usage:
 *   node scripts/capture-games.mjs --id kaisen \
 *     --asset-dir /workspace/game-sources/public-assets/kaisen \
 *     --out-dir assets/screenshots
 */
import { chromium } from '@playwright/test';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { mkdir, readFile, realpath, stat, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';

const games = {
  kaisen: { title: 'カイセン' },
  faitofuraito: { title: 'ファイトフライト' },
  machimamore: { title: 'マチマモレ' },
  gekichin: { title: 'ゲキチン' },
  uchiotose: { title: 'ウチオトセ' },
};
const targetSizes = [960, 640];
const maxWebpBytes = 120_000;
const mimeTypes = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.txt': 'text/plain; charset=utf-8',
  '.wasm': 'application/wasm',
  '.webp': 'image/webp',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
};

function fail(message) {
  throw new Error(message);
}

function parseArgs(argv) {
  const values = {};
  for (let index = 0; index < argv.length; index += 1) {
    const key = argv[index];
    if (key === '--help' || key === '-h') {
      console.log('Usage: node scripts/capture-games.mjs --id <game> --asset-dir <verified replay bundle> --out-dir <screenshots>');
      process.exit(0);
    }
    if (!['--id', '--asset-dir', '--out-dir'].includes(key)) fail(`Unknown option: ${key}`);
    const value = argv[index + 1];
    if (!value || value.startsWith('--')) fail(`Missing value for ${key}`);
    values[key.slice(2)] = value;
    index += 1;
  }
  if (!games[values.id]) fail('--id must be one of: kaisen, faitofuraito, machimamore, gekichin, uchiotose');
  if (!values['asset-dir'] || !values['out-dir']) fail('--asset-dir and --out-dir are required');
  return {
    id: values.id,
    assetDir: path.resolve(values['asset-dir']),
    outDir: path.resolve(values['out-dir']),
  };
}

function sha256(bytes) {
  return createHash('sha256').update(bytes).digest('hex');
}

function safeDisplayUrl(value) {
  try {
    const url = new URL(value);
    return `${url.origin}${url.pathname}${url.search ? '?[query redacted]' : ''}`;
  } catch {
    return '[invalid URL]';
  }
}

async function loadReplayBundle(assetDir) {
  const root = await realpath(assetDir);
  const observation = JSON.parse(await readFile(path.join(root, 'observation.json'), 'utf8'));
  if (observation.tlsVerificationEnabled !== true || observation.allProductHashesMatch !== true) {
    fail('Replay bundle is not marked TLS-verified with all product hashes matching.');
  }
  if (!/^https:\/\//.test(observation.officialUrl)) fail('Replay bundle has no official HTTPS URL.');

  const fileRecords = new Map(observation.files.map((record) => [record.path, record]));
  const runtimePaths = observation.productPaths.filter((entry) => {
    if (entry === 'index.html') return true;
    if (entry === 'deployment.json' || entry === 'release.json' || entry === 'artifact-manifest.json') return true;
    if (entry === 'ranking-manifest.json') return true;
    return entry.startsWith('assets/');
  });
  if (!runtimePaths.includes('index.html')) fail('Replay bundle does not include index.html.');

  const byUrl = new Map();
  for (const relativePath of runtimePaths) {
    const record = fileRecords.get(relativePath);
    if (!record || record.status !== 200 || !record.hashMatches || !record.expectedSha256) {
      fail(`No verified product hash for ${relativePath}.`);
    }
    const filePath = path.resolve(root, relativePath);
    if (filePath !== root && !filePath.startsWith(`${root}${path.sep}`)) fail(`Unsafe bundle path: ${relativePath}`);
    const bytes = await readFile(filePath);
    if (sha256(bytes) !== record.sha256 || sha256(bytes) !== record.expectedSha256) {
      fail(`Local replay asset hash mismatch: ${relativePath}`);
    }
    byUrl.set(record.url, { bytes, relativePath, sha256: record.sha256 });
    if (relativePath === 'index.html') {
      byUrl.set(observation.officialUrl, { bytes, relativePath, sha256: record.sha256 });
      byUrl.set(new URL('index.html', observation.officialUrl).href, { bytes, relativePath, sha256: record.sha256 });
    }
  }
  return { observation, byUrl, runtimePaths };
}

function contentType(relativePath) {
  return mimeTypes[path.extname(relativePath).toLowerCase()] ?? 'application/octet-stream';
}

async function waitForPublishedHomeReadiness(page, id) {
  if (id !== 'machimamore' && id !== 'uchiotose') return null;
  const startedAt = Date.now();
  let timedOut = false;
  try {
    await page.waitForFunction((gameId) => {
      const start = document.querySelector('#start');
      const startupError = document.querySelector('#startup-error');
      const status = document.querySelector('#p1-status');
      const isVisible = (element) => Boolean(element && !element.hidden && getComputedStyle(element).display !== 'none' && getComputedStyle(element).visibility !== 'hidden');
      if (gameId === 'machimamore') {
        const ready = start instanceof HTMLButtonElement && !start.disabled
          && start.textContent?.includes('街を守りに出撃') && !isVisible(startupError);
        return ready || isVisible(startupError);
      }
      const ready = start instanceof HTMLButtonElement && !start.disabled
        && status instanceof HTMLElement && status.hidden
        && status.textContent?.includes('準備完了');
      const failed = status instanceof HTMLElement && isVisible(status)
        && status.textContent?.includes('3D描画を起動できません');
      return ready || failed;
    }, id, { timeout: 20_000, polling: 100 });
  } catch (error) {
    if (!(error instanceof Error) || !error.message.includes('Timeout')) throw error;
    timedOut = true;
  }
  const state = await page.evaluate((gameId) => {
    const start = document.querySelector('#start');
    const startupError = document.querySelector('#startup-error');
    const status = document.querySelector('#p1-status');
    const isVisible = (element) => Boolean(element && !element.hidden && getComputedStyle(element).display !== 'none' && getComputedStyle(element).visibility !== 'hidden');
    const startEnabled = start instanceof HTMLButtonElement ? !start.disabled : null;
    const startLabel = start?.textContent?.trim().replace(/\s+/g, ' ') ?? null;
    if (gameId === 'machimamore') {
      const errorVisible = isVisible(startupError);
      const errorText = errorVisible ? startupError?.textContent?.trim().replace(/\s+/g, ' ') ?? null : null;
      return {
        ready: startEnabled === true && startLabel?.includes('街を守りに出撃') === true && !errorVisible,
        signal: 'Start enabled with the published ready label after prepareGraphics; startup-error hidden',
        startEnabled,
        startLabel,
        statusVisible: errorVisible,
        statusText: errorText,
        graphicsError: errorText,
      };
    }
    const statusVisible = isVisible(status);
    const statusText = status?.textContent?.trim().replace(/\s+/g, ' ') ?? null;
    const ready = startEnabled === true && status instanceof HTMLElement && status.hidden && statusText?.includes('準備完了') === true;
    const graphicsError = statusVisible && statusText?.includes('3D描画を起動できません') ? statusText : null;
    return {
      ready,
      signal: 'Start enabled and #p1-status hidden after renderer.prepare and pollRender ready',
      startEnabled,
      startLabel,
      statusVisible,
      statusText,
      graphicsError,
    };
  }, id);
  return { ...state, timedOut, timeoutMs: 20_000, waitedMs: Date.now() - startedAt };
}

async function replayAndCapture({ id, assetDir, outDir }) {
  const game = games[id];
  const { observation, byUrl, runtimePaths } = await loadReplayBundle(assetDir);
  const officialUrl = observation.officialUrl;
  const origin = new URL(officialUrl).origin;
  const served = [];
  const blocked = [];
  const consoleErrors = [];
  const pageErrors = [];

  const browser = await chromium.launch({
    headless: true,
    args: [
      '--disable-background-networking',
      '--disable-component-update',
      '--disable-default-apps',
      '--disable-sync',
      '--no-first-run',
      '--enable-webgl',
      '--enable-unsafe-swiftshader',
      '--use-gl=angle',
      '--use-angle=swiftshader',
    ],
  });

  let pngPath;
  let result;
  try {
    const context = await browser.newContext({
      viewport: { width: 1280, height: 720 },
      deviceScaleFactor: 1,
      locale: 'ja-JP',
      timezoneId: 'UTC',
      serviceWorkers: 'block',
      reducedMotion: 'reduce',
      acceptDownloads: false,
    });
    await context.route('**/*', async (route) => {
      const request = route.request();
      const method = request.method();
      const url = request.url();
      const asset = byUrl.get(url);
      if ((method === 'GET' || method === 'HEAD') && asset) {
        served.push({ url: safeDisplayUrl(url), method, path: asset.relativePath, sha256: asset.sha256 });
        await route.fulfill({
          status: 200,
          body: method === 'HEAD' ? Buffer.alloc(0) : asset.bytes,
          headers: {
            'cache-control': 'no-store',
            'content-length': String(method === 'HEAD' ? 0 : asset.bytes.byteLength),
            'content-type': contentType(asset.relativePath),
            'x-content-type-options': 'nosniff',
          },
        });
        return;
      }
      blocked.push({ url: safeDisplayUrl(url), method, reason: asset ? 'method-not-allowed' : 'not-in-hash-verified-local-bundle' });
      await route.abort('blockedbyclient');
    });
    context.routeWebSocket('**/*', (socket) => {
      blocked.push({ url: safeDisplayUrl(socket.url()), method: 'WEBSOCKET', reason: 'websocket-disabled' });
      socket.close({ code: 1000, reason: 'offline product replay' });
    });
    await context.setOffline(true);

    const page = await context.newPage();
    page.on('console', (message) => {
      if (message.type() === 'error') consoleErrors.push(message.text().slice(0, 240));
    });
    page.on('pageerror', (error) => pageErrors.push(String(error.message).slice(0, 240)));
    await page.goto(officialUrl, { waitUntil: 'load', timeout: 45000 });
    await page.locator('#home').waitFor({ state: 'visible', timeout: 30000 });
    const homeReadiness = await waitForPublishedHomeReadiness(page, id);
    if (homeReadiness && !homeReadiness.ready) {
      fail(`Published Home renderer readiness was not reached without Start: ${JSON.stringify(homeReadiness)}`);
    }
    await page.evaluate(() => document.fonts?.ready ?? Promise.resolve());
    await page.waitForTimeout(homeReadiness ? 250 : 1000);

    const pageState = await page.evaluate(() => {
      const visible = (element) => Boolean(element && !element.hidden && getComputedStyle(element).display !== 'none' && getComputedStyle(element).visibility !== 'hidden');
      const home = document.querySelector('#home');
      const heading = home?.querySelector('h1') ?? document.querySelector('h1');
      const start = document.querySelector('#start');
      const knownPlayScreens = ['#hud', '#playing', '#flight-screen', '#pause-screen', '#result', '#result-screen'];
      const playingVisible = knownPlayScreens.some((selector) => visible(document.querySelector(selector)));
      const pilotName = document.querySelector('#pilot-name');
      return {
        homeVisible: visible(home),
        heading: heading?.textContent?.trim().replace(/\s+/g, ' ') ?? null,
        playingVisible,
        startEnabled: start instanceof HTMLButtonElement ? !start.disabled : null,
        startLabel: start?.textContent?.trim().replace(/\s+/g, ' ') ?? null,
        pilotNameEmpty: pilotName instanceof HTMLInputElement ? pilotName.value.length === 0 : null,
      };
    });
    if (!pageState.homeVisible || pageState.playingVisible) fail(`Product is not in an idle Home screen: ${JSON.stringify(pageState)}`);
    if (pageState.heading !== game.title) fail(`Unexpected product heading: ${JSON.stringify(pageState)}`);
    if (pageState.pilotNameEmpty === false) fail('Pilot name field was not empty in the fresh browser context.');
    if (pageErrors.length) fail(`Product page raised a runtime error: ${pageErrors[0]}`);

    const capturedAt = new Date().toISOString();
    const rawBytes = await page.screenshot({ type: 'png', animations: 'disabled', caret: 'hide', fullPage: false });
    const rawHash = sha256(rawBytes);
    const tempDir = path.join(os.tmpdir(), 'zero-series-offline-captures');
    await mkdir(tempDir, { recursive: true });
    pngPath = path.join(tempDir, `${id}-${rawHash.slice(0, 12)}-source.png`);
    await writeFile(pngPath, rawBytes, { flag: 'wx' }).catch(async (error) => {
      if (error.code !== 'EEXIST') throw error;
      const existing = await readFile(pngPath);
      if (sha256(existing) !== rawHash) throw error;
    });

    await mkdir(outDir, { recursive: true });
    const outputs = [];
    for (const width of targetSizes) {
      const height = Math.round(width * 9 / 16);
      const fileName = `${id}-${rawHash.slice(0, 12)}-${width}.webp`;
      const outputPath = path.join(outDir, fileName);
      let qualityUsed = null;
      for (const quality of [82, 76, 70, 64]) {
        execFileSync('magick', [
          pngPath,
          '-auto-orient',
          '-resize', `${width}x${height}`,
          '-background', '#071e2b',
          '-gravity', 'center',
          '-extent', `${width}x${height}`,
          '-strip',
          '-define', 'webp:method=6',
          '-quality', String(quality),
          outputPath,
        ], { stdio: 'pipe' });
        qualityUsed = quality;
        if ((await stat(outputPath)).size <= maxWebpBytes) break;
      }
      const outputBytes = await readFile(outputPath);
      const outputInfo = execFileSync('magick', ['identify', '-format', '%w %h %m', outputPath], { encoding: 'utf8' }).trim().split(/\s+/);
      const output = {
        src: path.relative(process.cwd(), outputPath).split(path.sep).join('/'),
        width: Number(outputInfo[0]),
        height: Number(outputInfo[1]),
        format: outputInfo[2].toLowerCase(),
        sha256: sha256(outputBytes),
        bytes: outputBytes.byteLength,
        quality: qualityUsed,
      };
      if (output.width !== width || output.height !== height || output.format !== 'webp') fail(`Unexpected derived image dimensions/format: ${JSON.stringify(output)}`);
      outputs.push(output);
    }

    result = {
      id,
      state: 'published-title-screen',
      sourceUrl: officialUrl,
      offlineReplay: {
        bundle: path.resolve(assetDir),
        observationFile: path.join(path.resolve(assetDir), 'observation.json'),
        allProductHashesMatch: observation.allProductHashesMatch,
        runtimePaths,
        served,
        blocked,
      },
      capture: {
        capturedAt,
        environment: {
          os: `${os.type()} ${os.release()} (${os.arch()})`,
          browser: 'Chromium',
          browserVersion: browser.version(),
          playwrightVersion: '1.63.0',
          viewport: { width: 1280, height: 720 },
          deviceScaleFactor: 1,
          locale: 'ja-JP',
          reducedMotion: 'reduce',
          networkMode: 'offline; exact hash-verified GET/HEAD replay only',
        },
        homeState: pageState,
        homeReadiness,
        interaction: { click: false, keyboard: false, pointer: false, touch: false, gameStart: false },
        runtimeErrors: { console: consoleErrors, page: pageErrors },
      },
      original: {
        path: pngPath,
        format: 'png',
        width: 1280,
        height: 720,
        sha256: rawHash,
        bytes: rawBytes.byteLength,
      },
      outputs,
    };
    await context.close();
  } finally {
    await browser.close();
  }
  return result;
}

try {
  const args = parseArgs(process.argv.slice(2));
  const result = await replayAndCapture(args);
  console.log(JSON.stringify(result, null, 2));
} catch (error) {
  console.error(error instanceof Error ? error.stack : String(error));
  process.exitCode = 1;
}
