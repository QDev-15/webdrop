// ============================================================================
// auth.js — Đăng nhập / phiên làm việc / bảo vệ trang / kiểm tra ca làm việc
// ============================================================================

(function () {
  'use strict';

  function login(username, password) {
    const users = POS.getUsers();
    const user = users.find(u => u.username === username && u.password === password);
    if (!user) return false;

    const session = {
      username: user.username,
      role: user.role,
      name: user.name,
      loginTime: new Date().toISOString()
    };
    localStorage.setItem('bp_auth_session', JSON.stringify(session));
    return true;
  }

  function logout() {
    localStorage.removeItem('bp_auth_session');
  }

  function getSession() {
    const data = localStorage.getItem('bp_auth_session');
    return data ? JSON.parse(data) : null;
  }

  function isLoggedIn() {
    return getSession() !== null;
  }

  // Xác định đường dẫn tương đối tới trang gốc (index.html) dựa trên vị trí file hiện tại
  function rootPath() {
    return location.pathname.indexOf('/admin/') !== -1 ? '../index.html' : 'index.html';
  }

  function checkAuth() {
    const session = getSession();
    if (!session) {
      window.location.href = rootPath();
      return false;
    }
    return true;
  }

  function checkAdminAuth() {
    const session = getSession();
    if (!session || session.role !== 'admin') {
      window.location.href = rootPath();
      return false;
    }
    return true;
  }

  // Bắt buộc phải có ca làm việc đang mở (dùng cho lap-don.html)
  function requireOpenShift() {
    const session = getSession();
    if (!session) return false;
    const shift = POS.getOpenShiftForUser(session.username);
    if (!shift) {
      const target = location.pathname.indexOf('/admin/') !== -1 ? '../ca-lam-viec.html' : 'ca-lam-viec.html';
      window.location.href = target;
      return false;
    }
    return true;
  }

  function getCurrentShift() {
    const session = getSession();
    if (!session) return null;
    return POS.getOpenShiftForUser(session.username);
  }

  function updateUserDisplay() {
    const session = getSession();
    const userDisplay = document.getElementById('userDisplay');
    const logoutBtn = document.getElementById('logoutBtn');
    const loginLink = document.getElementById('loginLink');

    if (session && userDisplay) {
      userDisplay.textContent = '👤 ' + session.name + (session.role === 'admin' ? ' (Quản lý)' : ' (Thu ngân)');
      if (logoutBtn) logoutBtn.style.display = 'inline-flex';
      if (loginLink) loginLink.style.display = 'none';
    } else {
      if (userDisplay) userDisplay.textContent = '';
      if (logoutBtn) logoutBtn.style.display = 'none';
      if (loginLink) loginLink.style.display = 'inline-flex';
    }
  }

  function handleLogoutClick() {
    if (confirm('Bạn chắc chắn muốn đăng xuất?')) {
      logout();
      window.location.href = rootPath();
    }
  }

  window.Auth = {
    login, logout, getSession, isLoggedIn,
    checkAuth, checkAdminAuth, requireOpenShift, getCurrentShift,
    updateUserDisplay, handleLogoutClick
  };
})();
