// ============================================================================
// shift.js — Quản lý ca làm việc (mở ca / đóng ca / thống kê ca hiện tại)
// ============================================================================

(function () {
  'use strict';

  function openShift(cashierUsername, openingCash) {
    const cash = Number(openingCash);
    if (isNaN(cash) || cash < 0) {
      throw new Error('Tiền mặt đầu ca không hợp lệ');
    }
    const existing = POS.getOpenShiftForUser(cashierUsername);
    if (existing) {
      throw new Error('Đã có ca đang mở, vui lòng đóng ca hiện tại trước');
    }
    const shift = {
      cashierUsername,
      openedAt: new Date().toISOString(),
      openingCash: cash,
      closedAt: null,
      closingCashCounted: null,
      closingCashExpected: null,
      difference: null,
      status: 'open'
    };
    return POS.saveShift(shift);
  }

  // Thống kê ca: số đơn, tổng doanh thu, tiền mặt thu được — tính từ bp_orders trong ca
  function getShiftStats(shift) {
    if (!shift) return { orderCount: 0, totalRevenue: 0, cashRevenue: 0 };
    const orders = POS.getOrders().filter(o => o.shiftId === shift.id);
    const totalRevenue = orders.reduce((s, o) => s + (o.total || 0), 0);
    const cashRevenue = orders
      .filter(o => o.paymentMethod === 'cash')
      .reduce((s, o) => s + (o.total || 0), 0);
    return { orderCount: orders.length, totalRevenue, cashRevenue, orders };
  }

  function closeShift(shift, closingCashCounted) {
    const counted = Number(closingCashCounted);
    if (closingCashCounted === '' || closingCashCounted === null || closingCashCounted === undefined || isNaN(counted) || counted < 0) {
      throw new Error('Vui lòng nhập số tiền mặt đếm thực tế hợp lệ (>= 0)');
    }
    const stats = getShiftStats(shift);
    const closingCashExpected = (shift.openingCash || 0) + stats.cashRevenue;
    const difference = counted - closingCashExpected;

    const updated = Object.assign({}, shift, {
      closedAt: new Date().toISOString(),
      closingCashCounted: counted,
      closingCashExpected,
      difference,
      status: 'closed'
    });
    POS.updateShift(updated);
    return updated;
  }

  window.Shift = { openShift, closeShift, getShiftStats };
})();
