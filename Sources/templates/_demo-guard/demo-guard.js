/**
 * demo-guard.js — webdrop.store
 * Ngăn casual users copy source code từ trang demo.
 * Thêm vào trước </body> của mọi trang demo.
 */
(function () {
  'use strict';

  // ── 1. Chặn chuột phải ──
  document.addEventListener('contextmenu', function (e) {
    e.preventDefault();
    return false;
  });

  // ── 2. Chặn phím tắt DevTools & Save ──
  document.addEventListener('keydown', function (e) {
    const ctrl = e.ctrlKey || e.metaKey;

    // F12
    if (e.key === 'F12') { e.preventDefault(); return false; }

    // Ctrl+U (View Source), Ctrl+S (Save), Ctrl+A (Select All)
    if (ctrl && ['u', 'U', 's', 'S', 'a', 'A'].includes(e.key)) {
      e.preventDefault(); return false;
    }

    // Ctrl+Shift+I / Ctrl+Shift+J / Ctrl+Shift+C (DevTools)
    if (ctrl && e.shiftKey && ['i', 'I', 'j', 'J', 'c', 'C'].includes(e.key)) {
      e.preventDefault(); return false;
    }

    // Ctrl+Shift+K (Firefox DevTools)
    if (ctrl && e.shiftKey && (e.key === 'k' || e.key === 'K')) {
      e.preventDefault(); return false;
    }
  }, true);

  // ── 3. Chặn kéo thả elements ──
  document.addEventListener('dragstart', function (e) {
    e.preventDefault();
  });

  // ── 4. Chặn select text (trừ input/textarea) ──
  document.addEventListener('selectstart', function (e) {
    const tag = e.target.tagName.toLowerCase();
    if (!['input', 'textarea'].includes(tag)) {
      e.preventDefault();
    }
  });

  // ── 5. Detect DevTools mở (width trick) ──
  var devtoolsOpen = false;
  var threshold = 160;

  function checkDevTools() {
    var widthDiff = window.outerWidth - window.innerWidth > threshold;
    var heightDiff = window.outerHeight - window.innerHeight > threshold;
    if ((widthDiff || heightDiff) && !devtoolsOpen) {
      devtoolsOpen = true;
      // Blur nội dung khi DevTools mở
      document.body.style.filter = 'blur(8px)';
      // Hiện overlay cảnh báo
      showOverlay();
    } else if (!widthDiff && !heightDiff && devtoolsOpen) {
      devtoolsOpen = false;
      document.body.style.filter = '';
      removeOverlay();
    }
  }

  function showOverlay() {
    if (document.getElementById('_wdGuardOverlay')) return;
    var el = document.createElement('div');
    el.id = '_wdGuardOverlay';
    el.style.cssText = [
      'position:fixed', 'inset:0', 'z-index:999999',
      'background:rgba(0,0,0,.92)',
      'display:flex', 'align-items:center', 'justify-content:center',
      'flex-direction:column', 'gap:16px',
      'font-family:system-ui,sans-serif',
      'color:#fff', 'text-align:center', 'padding:32px'
    ].join(';');
    el.innerHTML = [
      '<div style="font-size:48px">🔒</div>',
      '<div style="font-size:20px;font-weight:600">Nội dung được bảo vệ</div>',
      '<div style="font-size:14px;color:rgba(255,255,255,.6);max-width:360px;line-height:1.6">',
      'Đây là bản demo của webdrop.store.<br>',
      'Để sở hữu source code, vui lòng mua template tại<br>',
      '<a href="https://webdrop.store" style="color:#4ade80;text-decoration:none">webdrop.store</a>',
      '</div>'
    ].join('');
    document.body.appendChild(el);
  }

  function removeOverlay() {
    var el = document.getElementById('_wdGuardOverlay');
    if (el) el.remove();
  }

  // Check mỗi 1 giây
  setInterval(checkDevTools, 1000);
  checkDevTools();

  // ── 6. Chèn watermark ẩn vào DOM ──
  // Giúp nhận diện nếu code bị copy
  var wm = document.createElement('meta');
  wm.setAttribute('name', 'generator');
  wm.setAttribute('content', 'webdrop.store — demo protected');
  document.head.appendChild(wm);

})();
