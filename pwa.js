(() => {
  'use strict';

  let deferredInstallPrompt = null;
  const isStandalone = () =>
    window.matchMedia('(display-mode: standalone)').matches ||
    window.navigator.standalone === true;

  function addInstallButton() {
    const header = document.querySelector('.auth-header, .topbar');
    if (!header || document.getElementById('pwaInstallButton') || isStandalone()) return;

    const button = document.createElement('button');
    button.id = 'pwaInstallButton';
    button.className = 'pwa-install-btn';
    button.type = 'button';
    button.textContent = 'Install app';
    button.setAttribute('aria-label', 'Install FreeCash Pay app');

    const style = document.createElement('style');
    style.textContent = `
      .pwa-install-btn {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 7px;
        margin-left: auto;
        padding: 10px 15px;
        border: 1px solid rgba(21, 91, 72, .2);
        border-radius: 999px;
        background: #083d2e;
        color: #fff;
        font: 700 13px 'DM Sans', sans-serif;
        white-space: nowrap;
        cursor: pointer;
        box-shadow: 0 4px 12px rgba(8, 61, 46, .14);
      }
      .pwa-install-btn:active { transform: scale(.97); }
      .auth-header .pwa-install-btn { flex-shrink: 0; }
      @media (max-width: 520px) {
        .pwa-install-btn { padding: 9px 11px; font-size: 12px; }
        .auth-header .header-copy { display: none; }
      }
    `;
    document.head.appendChild(style);
    header.appendChild(button);

    button.addEventListener('click', async () => {
      if (deferredInstallPrompt) {
        deferredInstallPrompt.prompt();
        await deferredInstallPrompt.userChoice;
        deferredInstallPrompt = null;
        button.remove();
        return;
      }

      const isAppleMobile = /iphone|ipad|ipod/i.test(navigator.userAgent);
      const message = isAppleMobile
        ? 'To install FreeCash Pay, tap the Share button in Safari, then choose “Add to Home Screen”.'
        : 'To install FreeCash Pay, open your browser menu (⋮) and choose “Install app” or “Add to Home screen”.';
      window.alert(message);
    });
  }

  window.addEventListener('beforeinstallprompt', event => {
    event.preventDefault();
    deferredInstallPrompt = event;
    addInstallButton();
  });

  window.addEventListener('appinstalled', () => {
    deferredInstallPrompt = null;
    const button = document.getElementById('pwaInstallButton');
    if (button) button.remove();
  });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', addInstallButton, { once: true });
  } else {
    addInstallButton();
  }

  if ('serviceWorker' in navigator && location.protocol === 'https:') {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js', { scope: '/' }).catch(error => {
        console.error('FreeCash Pay app setup could not complete:', error);
      });
    });
  }
})();