// ============================================================================
// pos.js — Logic nghiệp vụ trang lap-don.html: barcode, giữ đơn (hold), biến
// thể sản phẩm, tìm khách hàng, xử lý thanh toán. DOM rendering nằm trong
// <script> riêng của lap-don.html — file này chỉ chứa state + business logic.
// ============================================================================

(function () {
  'use strict';

  function blankOrder() {
    return {
      holdId: null,
      label: 'Đơn mới',
      table: '',
      customerId: null,
      customerName: '',
      items: [],
      discount: { type: 'percent', value: 0 },
      payment: { method: 'cash', cashReceived: 0 }
    };
  }

  const state = {
    activeOrder: blankOrder(),
    heldOrders: []
  };

  function init() {
    state.heldOrders = POS.getHeldOrders();
    state.activeOrder = blankOrder();
  }

  // ---------------------------------------------------------------------
  // Items
  // ---------------------------------------------------------------------
  function findItem(productId, variantSku) {
    return state.activeOrder.items.find(it => it.productId === productId && (it.variantSku || null) === (variantSku || null));
  }

  function addItem(product, variantSku) {
    let price = product.price, size = null, color = null, availableStock = product.stock;

    if (product.hasVariants) {
      const variant = POS.getVariant(product, variantSku);
      if (!variant) throw new Error('Vui lòng chọn biến thể sản phẩm');
      price = variant.price; size = variant.size; color = variant.color; availableStock = variant.stock;
    }

    const existing = findItem(product.id, variantSku || null);
    const currentQtyInOrder = existing ? existing.quantity : 0;

    if (currentQtyInOrder + 1 > availableStock) {
      throw new Error(`${product.name}${size ? ' (' + size + '/' + color + ')' : ''} không đủ tồn kho (còn ${availableStock})`);
    }

    if (existing) {
      existing.quantity += 1;
    } else {
      state.activeOrder.items.push({
        productId: product.id, name: product.name, unit: product.unit,
        variantSku: variantSku || null, size, color, price, quantity: 1
      });
    }
  }

  function removeItem(productId, variantSku) {
    state.activeOrder.items = state.activeOrder.items.filter(
      it => !(it.productId === productId && (it.variantSku || null) === (variantSku || null))
    );
  }

  function updateItemQty(productId, variantSku, delta) {
    const item = findItem(productId, variantSku || null);
    if (!item) return;
    const product = POS.getProductById(productId);
    let availableStock = product ? product.stock : Infinity;
    if (product && product.hasVariants) {
      const variant = POS.getVariant(product, variantSku);
      availableStock = variant ? variant.stock : 0;
    }
    const newQty = item.quantity + delta;
    if (newQty <= 0) {
      removeItem(productId, variantSku);
      return;
    }
    if (newQty > availableStock) {
      throw new Error(`${item.name} không đủ tồn kho (còn ${availableStock})`);
    }
    item.quantity = newQty;
  }

  // ---------------------------------------------------------------------
  // Barcode
  // ---------------------------------------------------------------------
  // Trả về { status: 'added' } | { status: 'needVariant', product } | { status: 'notfound' }
  function scanBarcode(code) {
    const product = POS.findProductByBarcode(code);
    if (!product) return { status: 'notfound' };
    if (product.hasVariants) return { status: 'needVariant', product };
    addItem(product, null);
    return { status: 'added', product };
  }

  // ---------------------------------------------------------------------
  // Discount / Totals
  // ---------------------------------------------------------------------
  function setDiscount(type, value) {
    const v = Number(value) || 0;
    state.activeOrder.discount = { type: type === 'fixed' ? 'fixed' : 'percent', value: Math.max(0, v) };
  }

  function calcTotals() {
    const items = state.activeOrder.items;
    const subtotal = items.reduce((s, it) => s + it.price * it.quantity, 0);
    const discount = state.activeOrder.discount;
    let discountAmount = 0;
    if (discount.value > 0) {
      discountAmount = discount.type === 'percent'
        ? (subtotal * Math.min(discount.value, 100) / 100)
        : discount.value;
    }
    discountAmount = Math.min(discountAmount, subtotal);
    const total = Math.max(0, subtotal - discountAmount);
    return { subtotal, discountAmount, total };
  }

  // ---------------------------------------------------------------------
  // Khách hàng
  // ---------------------------------------------------------------------
  function selectCustomer(customerId) {
    const customer = POS.getCustomerById(customerId);
    if (!customer) return null;
    state.activeOrder.customerId = customer.id;
    state.activeOrder.customerName = customer.name;
    return customer;
  }

  function clearCustomer() {
    state.activeOrder.customerId = null;
    state.activeOrder.customerName = '';
  }

  function quickAddCustomer(name, phone) {
    const n = (name || '').trim();
    if (!n) throw new Error('Vui lòng nhập tên khách hàng');
    if (!CRM.validatePhone(phone)) throw new Error('Số điện thoại không hợp lệ (10 số, bắt đầu bằng 0)');
    if (POS.getCustomers().some(c => c.phone === phone.trim())) {
      throw new Error('Số điện thoại này đã tồn tại trong hệ thống');
    }
    const customer = POS.saveCustomer({ name: n, phone: phone.trim(), email: '', birthday: '' });
    return selectCustomer(customer.id);
  }

  // ---------------------------------------------------------------------
  // Giữ đơn (Hold orders) — tối thiểu 2 đơn đồng thời qua tab
  // ---------------------------------------------------------------------
  function persistHeld() {
    POS.saveHeldOrders(state.heldOrders);
  }

  function holdActiveOrder() {
    if (state.activeOrder.items.length === 0) return null;
    const held = Object.assign({}, state.activeOrder, {
      holdId: state.activeOrder.holdId || POS.generateId('hold'),
      label: state.activeOrder.label === 'Đơn mới' ? ('Đơn ' + (state.heldOrders.length + 1)) : state.activeOrder.label,
      createdAt: new Date().toISOString()
    });
    // nếu đơn này vốn đã có trong danh sách giữ (đang sửa lại) thì thay thế, không nhân đôi
    const idx = state.heldOrders.findIndex(h => h.holdId === held.holdId);
    if (idx >= 0) state.heldOrders[idx] = held; else state.heldOrders.push(held);
    persistHeld();
    return held;
  }

  function startNewOrder() {
    holdActiveOrder();
    state.activeOrder = blankOrder();
  }

  function switchToHeldOrder(holdId) {
    holdActiveOrder();
    const idx = state.heldOrders.findIndex(h => h.holdId === holdId);
    if (idx === -1) return false;
    const [order] = state.heldOrders.splice(idx, 1);
    persistHeld();
    state.activeOrder = order;
    return true;
  }

  function discardHeldOrder(holdId) {
    state.heldOrders = state.heldOrders.filter(h => h.holdId !== holdId);
    persistHeld();
  }

  // ---------------------------------------------------------------------
  // Thanh toán
  // ---------------------------------------------------------------------
  function validatePayment() {
    const totals = calcTotals();
    const payment = state.activeOrder.payment;
    if (payment.method === 'cash') {
      const received = Number(payment.cashReceived) || 0;
      if (received < totals.total) {
        throw new Error('Tiền khách đưa không đủ để thanh toán');
      }
    }
    return totals;
  }

  function checkout(session, shiftId) {
    if (state.activeOrder.items.length === 0) {
      throw new Error('Vui lòng chọn ít nhất một sản phẩm');
    }
    const totals = validatePayment();

    // Trừ tồn kho — atomic: nếu bất kỳ item nào không đủ hàng thì huỷ toàn bộ, không trừ gì
    const deduct = Inventory.deductStockForItems(state.activeOrder.items);
    if (!deduct.ok) throw new Error(deduct.message);

    const payment = state.activeOrder.payment;
    const cashReceived = payment.method === 'cash' ? (Number(payment.cashReceived) || 0) : null;
    const changeGiven = payment.method === 'cash' ? (cashReceived - totals.total) : null;

    const order = {
      table: state.activeOrder.table || '',
      customer: state.activeOrder.customerName || 'Khách lẻ',
      customerId: state.activeOrder.customerId || null,
      items: state.activeOrder.items,
      subtotal: totals.subtotal,
      discount: totals.discountAmount,
      total: totals.total,
      paymentMethod: payment.method,
      cashReceived,
      changeGiven,
      pointsEarned: 0,
      shiftId,
      cashierUsername: session.username,
      timestamp: new Date().toISOString(),
      status: 'completed',
      hasReturn: false
    };

    if (state.activeOrder.customerId) {
      order.pointsEarned = CRM.applyPurchase(state.activeOrder.customerId, totals.total) || 0;
    }

    const saved = POS.saveOrder(order);

    // dọn khỏi danh sách giữ đơn nếu đơn này từng được giữ
    if (state.activeOrder.holdId) {
      discardHeldOrder(state.activeOrder.holdId);
    }
    state.activeOrder = blankOrder();

    return saved;
  }

  window.Cashier = {
    state, init,
    addItem, removeItem, updateItemQty,
    scanBarcode, setDiscount, calcTotals,
    selectCustomer, clearCustomer, quickAddCustomer,
    holdActiveOrder, startNewOrder, switchToHeldOrder, discardHeldOrder,
    validatePayment, checkout
  };
})();
