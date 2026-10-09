/** Enhance real screenshots without coupling failures to the play links. */
export function enhanceImages(root = document) {
  for (const img of root.querySelectorAll('[data-thumbnail]')) {
    const figure = img.closest('.thumbnail');
    const picture = img.closest('picture');
    const fallback = figure?.querySelector('[data-image-fallback]');
    if (!figure || !picture || !fallback) continue;
    let failed = false;
    const fail = () => {
      if (failed) return;
      failed = true;
      picture.hidden = true;
      fallback.hidden = false;
      fallback.textContent = '画像を読み込めません';
      figure.dataset.imageState = 'error';
    };
    const loaded = async () => {
      try {
        if (!img.naturalWidth) return fail();
        if (typeof img.decode === 'function') await img.decode();
        if (failed) return;
        figure.dataset.imageState = 'ready';
      } catch { fail(); }
    };
    img.addEventListener('error', fail, { once: true });
    img.addEventListener('load', loaded, { once: true });
    // A cached image can finish before the module attaches its listeners.
    if (img.complete) void loaded();
  }
}
