// ============================================================================
// POS Bán Hàng — Seed Data & Core Data Layer (localStorage)
// Toàn bộ hàm CRUD dữ liệu (products/customers/orders/shifts/...) định nghĩa
// tại đây và export qua window.POS — các module khác (auth.js, pos.js,
// inventory.js, crm.js, reports.js, shift.js, returns.js) build trên nền này.
// ============================================================================

(function () {
  'use strict';

  // ---------------------------------------------------------------------
  // Seed data gốc
  // ---------------------------------------------------------------------
  const SEED_CATEGORIES = [
    { id: 1, name: 'Cơm' },
    { id: 2, name: 'Mì/Phở' },
    { id: 3, name: 'Nước' },
    { id: 4, name: 'Tráng miệng' },
    { id: 5, name: 'Khác' }
  ];

  const SEED_USERS = [
    { username: 'nv01', password: '123456', role: 'cashier', name: 'Nhân viên 01' },
    { username: 'admin', password: 'admin123', role: 'admin', name: 'Quản lý' }
  ];

  const SEED_SUPPLIERS = [
    'Chành Thực Phẩm Miền Tây',
    'Vựa Rau Củ Sạch An Bình',
    'Công ty TNHH Đồ Uống Sài Gòn'
  ];

  const SEED_PRODUCTS = [
    { id: 1, name: 'Cơm Tấm Sườn Bì Chả', categoryId: 1, price: 45000, costPrice: 27000, unit: 'suất', stock: 40, minStock: 10, barcode: '8938501234501', hasVariants: false, image: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=400&h=400&fit=crop' },
    { id: 2, name: 'Cơm Gà Xối Mỡ', categoryId: 1, price: 55000, costPrice: 33000, unit: 'suất', stock: 30, minStock: 10, barcode: '8938501234502', hasVariants: false, image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&h=400&fit=crop' },
    { id: 3, name: 'Cơm Thịt Kho Trứng', categoryId: 1, price: 48000, costPrice: 29000, unit: 'suất', stock: 25, minStock: 8, barcode: '8938501234503', hasVariants: false, image: 'https://images.unsplash.com/photo-1516684732162-798a0062be99?w=400&h=400&fit=crop' },
    { id: 4, name: 'Cơm Gà Quay', categoryId: 1, price: 60000, costPrice: 37000, unit: 'suất', stock: 20, minStock: 8, barcode: '8938501234504', hasVariants: false, image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&h=400&fit=crop' },
    { id: 5, name: 'Cơm Chay Thập Cẩm', categoryId: 1, price: 42000, costPrice: 24000, unit: 'suất', stock: 15, minStock: 5, barcode: '8938501234505', hasVariants: false, image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=400&fit=crop' },
    { id: 6, name: 'Phở Bò Tái Nạm', categoryId: 2, price: 55000, costPrice: 32000, unit: 'tô', stock: 35, minStock: 10, barcode: '8938501234506', hasVariants: false, image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&h=400&fit=crop' },
    { id: 7, name: 'Phở Gà', categoryId: 2, price: 50000, costPrice: 29000, unit: 'tô', stock: 28, minStock: 10, barcode: '8938501234507', hasVariants: false, image: 'https://images.unsplash.com/photo-1552611052-33e04de081de?w=400&h=400&fit=crop' },
    { id: 8, name: 'Mì Vàng Sườn Non', categoryId: 2, price: 48000, costPrice: 28000, unit: 'tô', stock: 6, minStock: 8, barcode: '8938501234508', hasVariants: false, image: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=400&h=400&fit=crop' },
    { id: 9, name: 'Bánh Canh Cua', categoryId: 2, price: 52000, costPrice: 31000, unit: 'tô', stock: 18, minStock: 6, barcode: '8938501234509', hasVariants: false, image: 'https://images.unsplash.com/photo-1555126634-323283e090fa?w=400&h=400&fit=crop' },
    { id: 10, name: 'Hủ Tiếu Nam Vang', categoryId: 2, price: 50000, costPrice: 29000, unit: 'tô', stock: 22, minStock: 8, barcode: '8938501234510', hasVariants: false, image: 'https://images.unsplash.com/photo-1555126634-323283e090fa?w=400&h=400&fit=crop' },
    {
      id: 11, name: 'Cà Phê Sữa Đá', categoryId: 3, price: 25000, costPrice: 9000, unit: 'ly', stock: 0, minStock: 15,
      barcode: '8938501234511', hasVariants: true, image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400&h=400&fit=crop',
      variants: [
        { sku: 'CF-S-D', size: 'S', color: 'Đá', stock: 25, price: 20000 },
        { sku: 'CF-M-D', size: 'M', color: 'Đá', stock: 30, price: 25000 },
        { sku: 'CF-L-D', size: 'L', color: 'Đá', stock: 20, price: 30000 },
        { sku: 'CF-M-N', size: 'M', color: 'Nóng', stock: 15, price: 25000 }
      ]
    },
    {
      id: 12, name: 'Trà Đào Cam Sả', categoryId: 3, price: 30000, costPrice: 12000, unit: 'ly', stock: 0, minStock: 12,
      barcode: '8938501234512', hasVariants: true, image: 'https://images.unsplash.com/photo-1497534446932-c925b458314e?w=400&h=400&fit=crop',
      variants: [
        { sku: 'TD-S-D', size: 'S', color: 'Đá', stock: 18, price: 25000 },
        { sku: 'TD-M-D', size: 'M', color: 'Đá', stock: 22, price: 30000 },
        { sku: 'TD-L-D', size: 'L', color: 'Đá', stock: 15, price: 35000 }
      ]
    },
    { id: 13, name: 'Sinh Tố Bơ', categoryId: 3, price: 30000, costPrice: 14000, unit: 'ly', stock: 20, minStock: 8, barcode: '8938501234513', hasVariants: false, image: 'https://images.unsplash.com/photo-1610970881699-44a5587cabec?w=400&h=400&fit=crop' },
    { id: 14, name: 'Nước Cam Ép', categoryId: 3, price: 20000, costPrice: 8000, unit: 'ly', stock: 3, minStock: 10, barcode: '8938501234514', hasVariants: false, image: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=400&h=400&fit=crop' },
    { id: 15, name: 'Bia Tiger', categoryId: 3, price: 25000, costPrice: 15000, unit: 'lon', stock: 60, minStock: 20, barcode: '8938501234515', hasVariants: false, image: 'https://images.unsplash.com/photo-1571613316887-6f8d5cbf7ef7?w=400&h=400&fit=crop' },
    {
      id: 16, name: 'Trà Sữa Trân Châu', categoryId: 3, price: 35000, costPrice: 14000, unit: 'ly', stock: 0, minStock: 15,
      barcode: '8938501234516', hasVariants: true, image: 'https://images.unsplash.com/photo-1558857563-b371033873b8?w=400&h=400&fit=crop',
      variants: [
        { sku: 'TS-S', size: 'S', color: 'Ít đá', stock: 20, price: 30000 },
        { sku: 'TS-M', size: 'M', color: 'Ít đá', stock: 25, price: 35000 },
        { sku: 'TS-L', size: 'L', color: 'Bình thường', stock: 15, price: 40000 }
      ]
    },
    { id: 17, name: 'Chè Ba Màu', categoryId: 4, price: 20000, costPrice: 9000, unit: 'ly', stock: 25, minStock: 8, barcode: '8938501234517', hasVariants: false, image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400&h=400&fit=crop' },
    { id: 18, name: 'Kem Xoài', categoryId: 4, price: 25000, costPrice: 11000, unit: 'ly', stock: 5, minStock: 10, barcode: '8938501234518', hasVariants: false, image: 'https://images.unsplash.com/photo-1570197788417-0e82375c9371?w=400&h=400&fit=crop' },
    { id: 19, name: 'Bánh Mì Thịt', categoryId: 5, price: 20000, costPrice: 9000, unit: 'cái', stock: 40, minStock: 15, barcode: '8938501234519', hasVariants: false, image: 'https://images.unsplash.com/photo-1567234669003-dce7a7a88821?w=400&h=400&fit=crop' },
    { id: 20, name: 'Bánh Cuốn Chả', categoryId: 5, price: 25000, costPrice: 12000, unit: 'suất', stock: 20, minStock: 8, barcode: '8938501234520', hasVariants: false, image: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=400&h=400&fit=crop' }
  ];

  const SEED_CUSTOMERS = [
    { id: 'c1', name: 'Nguyễn Văn An', phone: '0901111111', email: '', birthday: '1992-03-14', totalSpent: 500000, points: 50, createdAt: '2026-06-15' },
    { id: 'c2', name: 'Trần Thị Bích', phone: '0902222222', email: 'bich.tran@example.com', birthday: '1995-07-22', totalSpent: 1500000, points: 150, createdAt: '2026-05-20' },
    { id: 'c3', name: 'Lê Hoàng Cường', phone: '0903333333', email: '', birthday: '1988-11-02', totalSpent: 3200000, points: 320, createdAt: '2026-04-10' },
    { id: 'c4', name: 'Phạm Thị Dung', phone: '0904444444', email: 'dung.pham@example.com', birthday: '1990-01-30', totalSpent: 7800000, points: 780, createdAt: '2026-03-05' },
    { id: 'c5', name: 'Hoàng Văn Em', phone: '0905555555', email: '', birthday: '1985-09-18', totalSpent: 9500000, points: 950, createdAt: '2026-02-14' },
    { id: 'c6', name: 'Vũ Thị Phương', phone: '0906666666', email: 'phuong.vu@example.com', birthday: '1993-05-06', totalSpent: 15000000, points: 1500, createdAt: '2026-01-20' },
    { id: 'c7', name: 'Đặng Văn Giang', phone: '0907777777', email: '', birthday: '1980-12-25', totalSpent: 25000000, points: 2500, createdAt: '2025-12-01' },
    { id: 'c8', name: 'Bùi Thị Hoa', phone: '0908888888', email: 'hoa.bui@example.com', birthday: '1991-04-09', totalSpent: 35000000, points: 3500, createdAt: '2025-10-15' },
    { id: 'c9', name: 'Ngô Văn Inh', phone: '0909999999', email: '', birthday: '1978-06-11', totalSpent: 52000000, points: 5200, createdAt: '2025-08-01' },
    { id: 'c10', name: 'Đỗ Thị Kim', phone: '0900000000', email: '', birthday: '', totalSpent: 0, points: 0, createdAt: todayISODate() }
  ];

  // ---------------------------------------------------------------------
  // Helpers ngày giờ / tiền tệ / chuỗi
  // ---------------------------------------------------------------------
  function todayISODate() {
    return new Date().toISOString().slice(0, 10);
  }

  function pad2(n) { return String(n).padStart(2, '0'); }

  function dateOnly(isoOrDate) {
    const d = (isoOrDate instanceof Date) ? isoOrDate : new Date(isoOrDate);
    return d.getFullYear() + '-' + pad2(d.getMonth() + 1) + '-' + pad2(d.getDate());
  }

  function formatCurrency(value) {
    const n = Number(value) || 0;
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(n);
  }

  function formatNumber(value) {
    return (Number(value) || 0).toLocaleString('vi-VN');
  }

  function formatDateTimeVN(isoString) {
    if (!isoString) return '';
    const d = new Date(isoString);
    if (isNaN(d.getTime())) return isoString;
    return d.toLocaleString('vi-VN');
  }

  function formatDateVN(isoString) {
    if (!isoString) return '';
    const d = new Date(isoString);
    if (isNaN(d.getTime())) return isoString;
    return d.toLocaleDateString('vi-VN');
  }

  // Escape HTML — dùng cho MỌI nội suy dữ liệu vào innerHTML để chống XSS
  function escapeHtml(str) {
    if (str === null || str === undefined) return '';
    const div = document.createElement('div');
    div.textContent = String(str);
    return div.innerHTML;
  }

  function generateId(prefix) {
    return prefix + Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
  }

  function safeImage(url) {
    if (!url || typeof url !== 'string') {
      return 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22100%22 height=%22100%22%3E%3Crect fill=%22%23f0f0f0%22 width=%22100%22 height=%22100%22/%3E%3C/svg%3E';
    }
    return url;
  }

  // ---------------------------------------------------------------------
  // localStorage low-level helpers
  // ---------------------------------------------------------------------
  function readLS(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (e) {
      return fallback;
    }
  }

  function writeLS(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  // ---------------------------------------------------------------------
  // Data access — Products
  // ---------------------------------------------------------------------
  function getProducts() { return readLS('bp_products', []); }
  function getProductById(id) { return getProducts().find(p => p.id === id) || null; }

  function getTotalStock(product) {
    if (!product) return 0;
    if (product.hasVariants && Array.isArray(product.variants)) {
      return product.variants.reduce((sum, v) => sum + (Number(v.stock) || 0), 0);
    }
    return Number(product.stock) || 0;
  }

  function isLowStock(product) {
    const minStock = Number(product.minStock) || 0;
    return getTotalStock(product) <= minStock;
  }

  function getMinPrice(product) {
    if (product.hasVariants && Array.isArray(product.variants) && product.variants.length) {
      return Math.min.apply(null, product.variants.map(v => Number(v.price) || 0));
    }
    return Number(product.price) || 0;
  }

  function saveProduct(product) {
    const products = getProducts();
    const idx = products.findIndex(p => p.id === product.id);
    if (idx >= 0) {
      products[idx] = product;
    } else {
      product.id = Math.max(0, ...products.map(p => p.id)) + 1;
      products.push(product);
    }
    writeLS('bp_products', products);
    return product;
  }

  function deleteProduct(id) {
    writeLS('bp_products', getProducts().filter(p => p.id !== id));
  }

  function findProductByBarcode(code) {
    const c = (code || '').trim();
    if (!c) return null;
    return getProducts().find(p => p.barcode === c) || null;
  }

  function getVariant(product, sku) {
    if (!product || !product.hasVariants) return null;
    return (product.variants || []).find(v => v.sku === sku) || null;
  }

  // ---------------------------------------------------------------------
  // Data access — Categories
  // ---------------------------------------------------------------------
  function getCategories() { return readLS('bp_categories', []); }

  // ---------------------------------------------------------------------
  // Data access — Customers
  // ---------------------------------------------------------------------
  function getCustomers() { return readLS('bp_customers', []); }
  function getCustomerById(id) { return getCustomers().find(c => c.id === id) || null; }

  function findCustomersByPhonePrefix(prefix) {
    const p = (prefix || '').trim();
    if (!p) return [];
    return getCustomers().filter(c => c.phone && c.phone.indexOf(p) === 0).slice(0, 8);
  }

  function searchCustomers(query) {
    const q = (query || '').toLowerCase().trim();
    const customers = getCustomers();
    if (!q) return customers;
    return customers.filter(c =>
      (c.name && c.name.toLowerCase().includes(q)) ||
      (c.phone && c.phone.includes(q))
    );
  }

  function saveCustomer(customer) {
    const customers = getCustomers();
    const idx = customers.findIndex(c => c.id === customer.id);
    if (idx >= 0) {
      customers[idx] = customer;
    } else {
      customer.id = generateId('c');
      customer.totalSpent = customer.totalSpent || 0;
      customer.points = customer.points || 0;
      customer.createdAt = customer.createdAt || todayISODate();
      customers.push(customer);
    }
    writeLS('bp_customers', customers);
    return customer;
  }

  function deleteCustomer(id) {
    writeLS('bp_customers', getCustomers().filter(c => c.id !== id));
  }

  // ---------------------------------------------------------------------
  // Data access — Orders
  // ---------------------------------------------------------------------
  function getOrders() { return readLS('bp_orders', []); }
  function getOrderById(id) { return getOrders().find(o => o.id === id) || null; }

  function saveOrder(order) {
    const orders = getOrders();
    order.id = order.id || ('HD' + Date.now());
    order.timestamp = order.timestamp || new Date().toISOString();
    order.status = order.status || 'completed';
    order.hasReturn = order.hasReturn || false;
    orders.push(order);
    writeLS('bp_orders', orders);
    return order;
  }

  function updateOrder(order) {
    const orders = getOrders();
    const idx = orders.findIndex(o => o.id === order.id);
    if (idx >= 0) {
      orders[idx] = order;
      writeLS('bp_orders', orders);
    }
    return order;
  }

  function getOrdersByDateRange(fromDateStr, toDateStr) {
    const orders = getOrders();
    return orders.filter(o => {
      const d = dateOnly(o.timestamp);
      return d >= fromDateStr && d <= toDateStr;
    });
  }

  // ---------------------------------------------------------------------
  // Data access — Held orders (giữ đơn tạm)
  // ---------------------------------------------------------------------
  function getHeldOrders() { return readLS('bp_held_orders', []); }
  function saveHeldOrders(list) { writeLS('bp_held_orders', list); }

  // ---------------------------------------------------------------------
  // Data access — Shifts
  // ---------------------------------------------------------------------
  function getShifts() { return readLS('bp_shifts', []); }
  function getShiftById(id) { return getShifts().find(s => s.id === id) || null; }

  function saveShift(shift) {
    const shifts = getShifts();
    shift.id = shift.id || generateId('s');
    shifts.push(shift);
    writeLS('bp_shifts', shifts);
    return shift;
  }

  function updateShift(shift) {
    const shifts = getShifts();
    const idx = shifts.findIndex(s => s.id === shift.id);
    if (idx >= 0) {
      shifts[idx] = shift;
      writeLS('bp_shifts', shifts);
    }
    return shift;
  }

  function getOpenShiftForUser(username) {
    return getShifts().find(s => s.cashierUsername === username && s.status === 'open') || null;
  }

  // ---------------------------------------------------------------------
  // Data access — Stock imports (nhập kho)
  // ---------------------------------------------------------------------
  function getStockImports() { return readLS('bp_stock_imports', []); }
  function saveStockImport(record) {
    const list = getStockImports();
    record.id = record.id || generateId('pi');
    list.push(record);
    writeLS('bp_stock_imports', list);
    return record;
  }

  // ---------------------------------------------------------------------
  // Data access — Returns (trả hàng)
  // ---------------------------------------------------------------------
  function getReturns() { return readLS('bp_returns', []); }
  function saveReturn(record) {
    const list = getReturns();
    record.id = record.id || generateId('rt');
    record.timestamp = record.timestamp || new Date().toISOString();
    list.push(record);
    writeLS('bp_returns', list);
    return record;
  }
  function getReturnsForOrder(orderId) {
    return getReturns().filter(r => r.orderId === orderId);
  }

  // ---------------------------------------------------------------------
  // Data access — Stocktakes (kiểm kê)
  // ---------------------------------------------------------------------
  function getStocktakes() { return readLS('bp_stocktakes', []); }
  function saveStocktake(record) {
    const list = getStocktakes();
    record.id = record.id || generateId('st');
    list.push(record);
    writeLS('bp_stocktakes', list);
    return record;
  }

  // ---------------------------------------------------------------------
  // Data access — Suppliers
  // ---------------------------------------------------------------------
  function getSuppliers() { return readLS('bp_suppliers', []); }
  function addSupplier(name) {
    const n = (name || '').trim();
    if (!n) return getSuppliers();
    const list = getSuppliers();
    if (!list.includes(n)) {
      list.push(n);
      writeLS('bp_suppliers', list);
    }
    return list;
  }

  // ---------------------------------------------------------------------
  // Data access — Users / Contacts
  // ---------------------------------------------------------------------
  function getUsers() { return readLS('bp_users', []); }
  function getContacts() { return readLS('bp_contacts', []); }
  function saveContact(contact) {
    const list = getContacts();
    contact.id = contact.id || Date.now();
    contact.timestamp = contact.timestamp || new Date().toISOString();
    contact.status = contact.status || 'new';
    list.push(contact);
    writeLS('bp_contacts', list);
    return contact;
  }

  // ---------------------------------------------------------------------
  // Seed generator — orders/shifts trải 7 ngày gần nhất
  // ---------------------------------------------------------------------
  function pickRandom(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
  function randInt(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }

  function buildOrderItems(products) {
    const itemCount = randInt(1, 4);
    const items = [];
    for (let i = 0; i < itemCount; i++) {
      const product = pickRandom(products);
      let variantSku = null, size = null, color = null, price = product.price;
      if (product.hasVariants && product.variants && product.variants.length) {
        const v = pickRandom(product.variants);
        variantSku = v.sku; size = v.size; color = v.color; price = v.price;
      }
      const qty = randInt(1, 2);
      const existing = items.find(it => it.productId === product.id && it.variantSku === variantSku);
      if (existing) {
        existing.quantity += qty;
      } else {
        items.push({
          productId: product.id,
          name: product.name,
          unit: product.unit,
          variantSku, size, color,
          price, quantity: qty
        });
      }
    }
    return items;
  }

  function calcOrderTotals(items, discount) {
    const subtotal = items.reduce((s, it) => s + it.price * it.quantity, 0);
    let discountAmount = 0;
    if (discount && discount.value) {
      discountAmount = discount.type === 'percent' ? (subtotal * discount.value / 100) : discount.value;
    }
    discountAmount = Math.min(discountAmount, subtotal);
    const total = Math.max(0, subtotal - discountAmount);
    return { subtotal, discountAmount, total };
  }

  function seedGenerateHistory() {
    const products = SEED_PRODUCTS;
    const customers = SEED_CUSTOMERS.slice();
    const shifts = [];
    const orders = [];
    const paymentMethods = ['cash', 'cash', 'cash', 'transfer', 'transfer', 'qr', 'card'];
    let firstCoffeeOrderId = null;

    const now = new Date();

    for (let dayOffset = 6; dayOffset >= 0; dayOffset--) {
      const dayDate = new Date(now);
      dayDate.setDate(now.getDate() - dayOffset);

      const openTime = new Date(dayDate);
      openTime.setHours(8, 0, 0, 0);
      const closeTime = new Date(dayDate);
      // Ca hôm nay đóng sớm (buổi sáng) để mặc định KHÔNG có ca đang mở khi vào demo
      if (dayOffset === 0) {
        closeTime.setHours(12, 0, 0, 0);
      } else {
        closeTime.setHours(20, 0, 0, 0);
      }

      const openingCash = 500000;
      const shiftId = generateId('s');
      const orderCount = randInt(3, 6);
      const dayOrders = [];

      for (let i = 0; i < orderCount; i++) {
        const items = buildOrderItems(products);
        const discount = Math.random() < 0.25 ? { type: 'percent', value: randInt(5, 10) } : { type: 'percent', value: 0 };
        const totals = calcOrderTotals(items, discount);
        const hasCustomer = Math.random() < 0.6;
        const customer = hasCustomer ? pickRandom(customers) : null;
        const paymentMethod = pickRandom(paymentMethods);

        const orderTime = new Date(openTime.getTime() + (i + 1) * (1000 * 60 * randInt(20, 90)));
        if (orderTime > closeTime) orderTime.setTime(closeTime.getTime() - 1000 * 60 * 5);

        const pointsEarned = customer ? Math.floor(totals.total / 10000) : 0;
        if (customer) {
          customer.totalSpent += totals.total;
          customer.points += pointsEarned;
        }

        let cashReceived = null, changeGiven = null;
        if (paymentMethod === 'cash') {
          cashReceived = Math.ceil(totals.total / 10000) * 10000;
          changeGiven = cashReceived - totals.total;
        }

        const order = {
          id: 'HD' + orderTime.getTime() + randInt(100, 999),
          table: String(randInt(1, 12)),
          customer: customer ? customer.name : 'Khách lẻ',
          customerId: customer ? customer.id : null,
          items,
          subtotal: totals.subtotal,
          discount: totals.discountAmount,
          total: totals.total,
          paymentMethod,
          cashReceived,
          changeGiven,
          pointsEarned,
          shiftId,
          timestamp: orderTime.toISOString(),
          status: 'completed',
          hasReturn: false
        };

        if (!firstCoffeeOrderId && items.some(it => it.productId === 11)) {
          firstCoffeeOrderId = order.id;
        }

        orders.push(order);
        dayOrders.push(order);
      }

      const cashRevenue = dayOrders
        .filter(o => o.paymentMethod === 'cash')
        .reduce((s, o) => s + o.total, 0);
      const closingCashExpected = openingCash + cashRevenue;
      const variance = randInt(-5000, 5000);
      const closingCashCounted = Math.max(0, closingCashExpected + variance);

      shifts.push({
        id: shiftId,
        cashierUsername: 'nv01',
        openedAt: openTime.toISOString(),
        openingCash,
        closedAt: closeTime.toISOString(),
        closingCashCounted,
        closingCashExpected,
        difference: closingCashCounted - closingCashExpected,
        status: 'closed'
      });
    }

    writeLS('bp_orders', orders);
    writeLS('bp_shifts', shifts);
    writeLS('bp_customers', customers);

    // 1-2 phiếu nhập kho mẫu
    const importDate1 = new Date(now); importDate1.setDate(now.getDate() - 3);
    const importDate2 = new Date(now); importDate2.setDate(now.getDate() - 1);
    const imports = [
      {
        id: generateId('pi'),
        supplier: SEED_SUPPLIERS[0],
        date: dateOnly(importDate1),
        items: [
          { productId: 1, productName: 'Cơm Tấm Sườn Bì Chả', quantity: 50, unitCost: 27000 },
          { productId: 6, productName: 'Phở Bò Tái Nạm', quantity: 40, unitCost: 32000 }
        ],
        totalCost: 50 * 27000 + 40 * 32000
      },
      {
        id: generateId('pi'),
        supplier: SEED_SUPPLIERS[1],
        date: dateOnly(importDate2),
        items: [
          { productId: 14, productName: 'Nước Cam Ép', quantity: 30, unitCost: 8000 },
          { productId: 13, productName: 'Sinh Tố Bơ', quantity: 20, unitCost: 14000 }
        ],
        totalCost: 30 * 8000 + 20 * 14000
      }
    ];
    writeLS('bp_stock_imports', imports);
    writeLS('bp_suppliers', SEED_SUPPLIERS.slice());

    // 1 phiếu trả hàng mẫu — gắn vào 1 đơn có sản phẩm Cà Phê Sữa Đá nếu tìm được
    if (firstCoffeeOrderId) {
      const ordersNow = readLS('bp_orders', []);
      const targetOrder = ordersNow.find(o => o.id === firstCoffeeOrderId);
      if (targetOrder) {
        const coffeeItem = targetOrder.items.find(it => it.productId === 11);
        if (coffeeItem) {
          const returnRecord = {
            id: generateId('rt'),
            orderId: targetOrder.id,
            items: [{ productId: coffeeItem.productId, variantSku: coffeeItem.variantSku, name: coffeeItem.name, quantity: 1 }],
            reason: 'doi-y',
            refundAmount: coffeeItem.price * 1,
            timestamp: new Date(new Date(targetOrder.timestamp).getTime() + 1000 * 60 * 30).toISOString()
          };
          writeLS('bp_returns', [returnRecord]);
          targetOrder.hasReturn = true;
          const idx = ordersNow.findIndex(o => o.id === targetOrder.id);
          ordersNow[idx] = targetOrder;
          writeLS('bp_orders', ordersNow);

          // cộng lại tồn kho (giả lập trạng thái đã hoàn tất trả hàng lịch sử)
          const products2 = readLS('bp_products', []);
          const prod = products2.find(p => p.id === 11);
          if (prod && prod.hasVariants) {
            const variant = (prod.variants || []).find(v => v.sku === coffeeItem.variantSku);
            if (variant) variant.stock += 1;
            writeLS('bp_products', products2);
          }
        }
      }
    } else {
      writeLS('bp_returns', []);
    }

    writeLS('bp_stocktakes', []);
  }

  // ---------------------------------------------------------------------
  // Initialize localStorage (chỉ chạy khi chưa có dữ liệu)
  // ---------------------------------------------------------------------
  function initializeLocalStorage() {
    if (!localStorage.getItem('bp_categories')) writeLS('bp_categories', SEED_CATEGORIES);
    if (!localStorage.getItem('bp_users')) writeLS('bp_users', SEED_USERS);

    const productsAlreadySeeded = !!localStorage.getItem('bp_products');
    if (!productsAlreadySeeded) {
      writeLS('bp_products', JSON.parse(JSON.stringify(SEED_PRODUCTS)));
    }

    if (!localStorage.getItem('bp_orders') || !localStorage.getItem('bp_shifts') || !localStorage.getItem('bp_customers')) {
      seedGenerateHistory();
    }

    if (!localStorage.getItem('bp_held_orders')) writeLS('bp_held_orders', []);
    if (!localStorage.getItem('bp_stock_imports')) writeLS('bp_stock_imports', []);
    if (!localStorage.getItem('bp_returns')) writeLS('bp_returns', []);
    if (!localStorage.getItem('bp_stocktakes')) writeLS('bp_stocktakes', []);
    if (!localStorage.getItem('bp_suppliers')) writeLS('bp_suppliers', SEED_SUPPLIERS.slice());
    if (!localStorage.getItem('bp_contacts')) writeLS('bp_contacts', []);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeLocalStorage);
  } else {
    initializeLocalStorage();
  }

  // ---------------------------------------------------------------------
  // Export namespace POS (data layer dùng chung mọi trang)
  // ---------------------------------------------------------------------
  window.POS = window.POS || {};
  Object.assign(window.POS, {
    // utils
    formatCurrency, formatNumber, formatDateTimeVN, formatDateVN, dateOnly,
    escapeHtml, sanitizeInput: escapeHtml, generateId, safeImage, todayISODate,
    // products
    getProducts, getProductById, saveProduct, deleteProduct, findProductByBarcode,
    getVariant, getTotalStock, isLowStock, getMinPrice,
    // categories
    getCategories,
    // customers
    getCustomers, getCustomerById, findCustomersByPhonePrefix, searchCustomers,
    saveCustomer, deleteCustomer,
    // orders
    getOrders, getOrderById, saveOrder, updateOrder, getOrdersByDateRange,
    // held orders
    getHeldOrders, saveHeldOrders,
    // shifts
    getShifts, getShiftById, saveShift, updateShift, getOpenShiftForUser,
    // stock imports
    getStockImports, saveStockImport,
    // returns
    getReturns, saveReturn, getReturnsForOrder,
    // stocktakes
    getStocktakes, saveStocktake,
    // suppliers
    getSuppliers, addSupplier,
    // users/contacts
    getUsers, getContacts, saveContact
  });
})();
