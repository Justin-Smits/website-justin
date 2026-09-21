'use strict';
// No Microsoft or YouTube media request is made until the visitor presses play.
document.querySelectorAll('.tool-video-shell').forEach(shell => {
  const button = shell.querySelector('button');
  if (!button) return;
  button.addEventListener('click', () => {
    const source = new URL(shell.dataset.videoSrc);
    const kind = shell.dataset.videoKind;
    const allowed = (kind === 'mp4' && source.origin === 'https://cdn-dynmedia-1.microsoft.com') ||
      (kind === 'youtube' && source.origin === 'https://www.youtube-nocookie.com');
    if (!allowed) return;
    const player = document.createElement(kind === 'youtube' ? 'iframe' : 'video');
    player.title = shell.dataset.videoTitle;
    player.tabIndex = 0;
    if (kind === 'youtube') {
      player.allow = 'encrypted-media; picture-in-picture; fullscreen';
      player.allowFullscreen = true;
      player.referrerPolicy = 'strict-origin-when-cross-origin';
    } else {
      player.controls = true;
      player.playsInline = true;
      player.preload = 'metadata';
      player.setAttribute('aria-label', shell.dataset.videoTitle);
      player.addEventListener('error', () => {
        const message = shell.parentElement.querySelector('.tool-video-error');
        if (message) message.hidden = false;
      });
    }
    player.src = source.href;
    shell.replaceChildren(player);
    player.focus({ preventScroll: true });
    // Native controls and the direct video link remain available if playback is blocked.
    if (kind === 'mp4') {
      const playback = player.play();
      if (playback && typeof playback.catch === 'function') playback.catch(() => {});
    }
  }, { once: true });
});
