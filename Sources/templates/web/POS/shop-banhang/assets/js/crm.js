// ============================================================================
// crm.js — Quản lý khách hàng: hạng thành viên, tích điểm, lịch sử mua hàng
// ============================================================================

(function () {
  'use strict';

  const TIER_THRESHOLDS = { dong: 0, bac: 2000000, vang: 10000000, 'kim-cuong': 30000000 };
  const TIER_ORDER = ['dong', 'bac', 'vang', 'kim-cuong'];
  const TIER_LABELS = { dong: 'Đồng', bac: 'Bạc', vang: 'Vàng', 'kim-cuong': 'Kim Cương' };
  const TIER_COLORS = { dong: '#a0714d', bac: '#94a3b8', vang: '#eab308', 'kim-cuong': '#38bdf8' };
  const VND_PER_POINT = 10000; // 1 điểm / 10.000đ chi tiêu

  function calcTier(totalSpent) {
    const spent = Number(totalSpent) || 0;
    if (spent >= TIER_THRESHOLDS['kim-cuong']) return 'kim-cuong';
    if (spent >= TIER_THRESHOLDS.vang) return 'vang';
    if (spent >= TIER_THRESHOLDS.bac) return 'bac';
    return 'dong';
  }

  function calcPointsForAmount(amount) {
    return Math.floor((Number(amount) || 0) / VND_PER_POINT);
  }

  // Thông tin tiến độ lên hạng tiếp theo
  function getTierProgress(totalSpent) {
    const spent = Number(totalSpent) || 0;
    const tier = calcTier(spent);
    const idx = TIER_ORDER.indexOf(tier);
    const nextTier = TIER_ORDER[idx + 1] || null;

    if (!nextTier) {
      return { tier, nextTier: null, percent: 100, remaining: 0, label: 'Đã đạt hạng cao nhất' };
    }

    const min = TIER_THRESHOLDS[tier];
    const max = TIER_THRESHOLDS[nextTier];
    const percent = Math.max(0, Math.min(100, ((spent - min) / (max - min)) * 100));
    const remaining = Math.max(0, max - spent);

    return {
      tier, nextTier, percent, remaining,
      label: `Còn ${POS.formatCurrency(remaining)} để lên hạng ${TIER_LABELS[nextTier]}`
    };
  }

  function getCustomerOrders(customerId) {
    return POS.getOrders()
      .filter(o => o.customerId === customerId)
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  }

  function getLastPurchaseDate(customerId) {
    const orders = getCustomerOrders(customerId);
    return orders.length ? orders[0].timestamp : null;
  }

  // Cộng điểm & tổng chi tiêu cho khách hàng sau khi thanh toán 1 đơn
  function applyPurchase(customerId, orderTotal) {
    if (!customerId) return null;
    const customer = POS.getCustomerById(customerId);
    if (!customer) return null;
    const pointsEarned = calcPointsForAmount(orderTotal);
    customer.totalSpent = (customer.totalSpent || 0) + orderTotal;
    customer.points = (customer.points || 0) + pointsEarned;
    customer.tier = calcTier(customer.totalSpent);
    POS.saveCustomer(customer);
    return pointsEarned;
  }

  function validatePhone(phone) {
    return /^0\d{9}$/.test((phone || '').trim());
  }

  window.CRM = {
    TIER_THRESHOLDS, TIER_ORDER, TIER_LABELS, TIER_COLORS,
    calcTier, calcPointsForAmount, getTierProgress,
    getCustomerOrders, getLastPurchaseDate, applyPurchase, validatePhone
  };
})();
