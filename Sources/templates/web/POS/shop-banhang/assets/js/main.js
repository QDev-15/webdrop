// POS Main Application Logic

// Authentication Functions
function login(username, password) {
  const users = JSON.parse(localStorage.getItem('bp_users') || '[]');
  const user = users.find(u => u.username === username && u.password === password);

  if (user) {
    const session = {
      username: user.username,
      role: user.role,
      name: user.name,
      loginTime: new Date().toISOString()
    };
    localStorage.setItem('bp_auth_session', JSON.stringify(session));
    return true;
  }
  return false;
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

function checkAuth() {
  const session = getSession();
  if (!session) {
    window.location.href = 'index.html';
    return false;
  }
  return true;
}

function checkAdminAuth() {
  const session = getSession();
  if (!session || session.role !== 'admin') {
    window.location.href = '../index.html';
    return false;
  }
  return true;
}

function updateUserDisplay() {
  const session = getSession();
  const userDisplay = document.getElementById('userDisplay');
  const logoutBtn = document.getElementById('logoutBtn');

  if (session && userDisplay) {
    userDisplay.textContent = '👤 ' + session.name;
    if (logoutBtn) {
      logoutBtn.style.display = 'block';
    }
  }
}

// Order Management
function createOrder(tableNumber, customerName, items, discount) {
  let subtotal = 0;
  items.forEach(item => {
    subtotal += item.price * item.quantity;
  });

  let discountAmount = 0;
  if (discount.type === 'percent') {
    discountAmount = (subtotal * discount.value) / 100;
  } else {
    discountAmount = discount.value;
  }

  const total = Math.max(0, subtotal - discountAmount);

  return {
    table: tableNumber,
    customer: customerName,
    items: items,
    subtotal: subtotal,
    discount: discountAmount,
    total: total,
    timestamp: new Date().toLocaleString('vi-VN')
  };
}

function formatCurrency(value) {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(value);
}

function formatNumber(value) {
  return value.toLocaleString('vi-VN');
}

// Category Filter
function filterProductsByCategory(categoryId) {
  const products = getProducts();
  if (categoryId === 0) {
    return products;
  }
  return products.filter(p => p.categoryId === categoryId);
}

// Search Products
function searchProducts(query) {
  const products = getProducts();
  const lowerQuery = query.toLowerCase().trim();
  if (!lowerQuery) return products;

  return products.filter(p =>
    p.name.toLowerCase().includes(lowerQuery)
  );
}

// Report Functions
function getReportData(fromDate, toDate, categoryId) {
  const orders = getOrdersByDateRange(new Date(fromDate), new Date(toDate));

  if (categoryId) {
    // Filter by category (would need to expand order items to include category)
  }

  return orders;
}

function generateReportStats(orders) {
  const stats = {
    totalOrders: orders.length,
    totalRevenue: 0,
    byDate: {},
    byCategory: {}
  };

  orders.forEach(order => {
    stats.totalRevenue += order.total || 0;

    const date = new Date(order.timestamp).toLocaleDateString('vi-VN');
    if (!stats.byDate[date]) {
      stats.byDate[date] = { count: 0, revenue: 0 };
    }
    stats.byDate[date].count++;
    stats.byDate[date].revenue += order.total || 0;
  });

  return stats;
}

// Utility: Sanitize HTML Input
function sanitizeInput(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

// Print Functions
function printInvoice(orderId) {
  window.print();
}

function printReport() {
  window.print();
}

// Validation
function validateTableNumber(value) {
  return value && value.trim().length > 0;
}

function validateQuantity(value) {
  const num = parseInt(value);
  return num > 0;
}

function validatePrice(value) {
  const num = parseFloat(value);
  return num > 0;
}

// Store session data temporarily for print page
function setOrderForPrint(order) {
  sessionStorage.setItem('bp_current_order', JSON.stringify(order));
}

function getOrderForPrint() {
  const data = sessionStorage.getItem('bp_current_order');
  return data ? JSON.parse(data) : null;
}

function clearOrderForPrint() {
  sessionStorage.removeItem('bp_current_order');
}

// Export for use in HTML pages
window.POS = {
  login,
  logout,
  getSession,
  isLoggedIn,
  checkAuth,
  checkAdminAuth,
  updateUserDisplay,
  createOrder,
  formatCurrency,
  formatNumber,
  getProducts,
  getCategories,
  getOrders,
  saveProduct,
  deleteProduct,
  saveOrder,
  filterProductsByCategory,
  searchProducts,
  getReportData,
  generateReportStats,
  sanitizeInput,
  printInvoice,
  printReport,
  validateTableNumber,
  validateQuantity,
  validatePrice,
  setOrderForPrint,
  getOrderForPrint,
  clearOrderForPrint
};
