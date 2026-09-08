// ============================================================================
// reports.js — Số liệu Dashboard + Báo cáo doanh thu/lợi nhuận (chuẩn bị data cho Chart.js)
// ============================================================================

(function () {
  'use strict';

  function last7Days() {
    const days = [];
    const now = new Date();
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(now.getDate() - i);
      days.push(POS.dateOnly(d));
    }
    return days;
  }

  function revenueByDay(orders, days) {
    const map = {};
    days.forEach(d => { map[d] = 0; });
    orders.forEach(o => {
      const d = POS.dateOnly(o.timestamp);
      if (map.hasOwnProperty(d)) map[d] += o.total || 0;
    });
    return days.map(d => map[d]);
  }

  function revenueByCategory(orders) {
    const categories = POS.getCategories();
    const products = POS.getProducts();
    const catMap = {};
    categories.forEach(c => { catMap[c.id] = 0; });

    orders.forEach(o => {
      (o.items || []).forEach(item => {
        const product = products.find(p => p.id === item.productId);
        const catId = product ? product.categoryId : null;
        if (catId && catMap.hasOwnProperty(catId)) {
          catMap[catId] += item.price * item.quantity;
        }
      });
    });

    return {
      labels: categories.map(c => c.name),
      values: categories.map(c => catMap[c.id])
    };
  }

  function topProducts(orders, limit) {
    const map = {}; // productId -> {name, qty, revenue}
    orders.forEach(o => {
      (o.items || []).forEach(item => {
        if (!map[item.productId]) {
          map[item.productId] = { productId: item.productId, name: item.name, qty: 0, revenue: 0 };
        }
        map[item.productId].qty += item.quantity;
        map[item.productId].revenue += item.price * item.quantity;
      });
    });
    return Object.values(map).sort((a, b) => b.qty - a.qty).slice(0, limit || 5);
  }

  function todayStats() {
    const today = POS.todayISODate();
    const orders = POS.getOrders().filter(o => POS.dateOnly(o.timestamp) === today);
    const revenue = orders.reduce((s, o) => s + (o.total || 0), 0);
    const lowStock = POS.getProducts().filter(p => POS.isLowStock(p)).length;
    const newCustomers = POS.getCustomers().filter(c => c.createdAt === today).length;
    return { revenue, orderCount: orders.length, lowStock, newCustomers };
  }

  function getDashboardData() {
    const days = last7Days();
    const orders7d = POS.getOrders().filter(o => days.includes(POS.dateOnly(o.timestamp)));
    return {
      stats: todayStats(),
      days,
      revenueSeries: revenueByDay(orders7d, days),
      categoryBreakdown: revenueByCategory(orders7d),
      topProducts: topProducts(orders7d, 5),
      recentOrders: POS.getOrders().slice(-5).reverse()
    };
  }

  // Lợi nhuận: doanh thu - (giá vốn hiện tại * số lượng) — dùng giá vốn CURRENT làm xấp xỉ
  function calcItemCost(item) {
    const product = POS.getProductById(item.productId);
    const cost = product ? (Number(product.costPrice) || 0) : 0;
    return cost * item.quantity;
  }

  function buildPeriodReport(fromDate, toDate, categoryId, staffUsername) {
    let orders = POS.getOrdersByDateRange(fromDate, toDate);

    if (staffUsername) {
      const staffShiftIds = POS.getShifts().filter(s => s.cashierUsername === staffUsername).map(s => s.id);
      orders = orders.filter(o => staffShiftIds.includes(o.shiftId));
    }

    if (categoryId) {
      const catId = Number(categoryId);
      const products = POS.getProducts();
      orders = orders.filter(o => (o.items || []).some(item => {
        const product = products.find(p => p.id === item.productId);
        return product && product.categoryId === catId;
      }));
    }

    // Nhóm theo ngày
    const byDate = {};
    orders.forEach(o => {
      const d = POS.dateOnly(o.timestamp);
      if (!byDate[d]) byDate[d] = { date: d, orderCount: 0, qty: 0, revenue: 0, profit: 0 };
      byDate[d].orderCount++;
      byDate[d].revenue += o.total || 0;
      (o.items || []).forEach(item => {
        byDate[d].qty += item.quantity;
        byDate[d].profit += (item.price * item.quantity) - calcItemCost(item);
      });
      // trừ phần chiết khấu ra khỏi lợi nhuận theo tỷ lệ đơn giản (chiết khấu làm giảm doanh thu thực nhận)
      byDate[d].profit -= (o.discount || 0);
    });

    const rows = Object.values(byDate).sort((a, b) => a.date.localeCompare(b.date));

    const totalRevenue = orders.reduce((s, o) => s + (o.total || 0), 0);
    const totalProfit = rows.reduce((s, r) => s + r.profit, 0);
    const totalOrders = orders.length;

    // Báo cáo theo nhân viên
    const staffMap = {};
    orders.forEach(o => {
      const shift = POS.getShiftById(o.shiftId);
      const staff = shift ? shift.cashierUsername : 'unknown';
      if (!staffMap[staff]) staffMap[staff] = { username: staff, orderCount: 0, revenue: 0 };
      staffMap[staff].orderCount++;
      staffMap[staff].revenue += o.total || 0;
    });
    const staffReport = Object.values(staffMap).sort((a, b) => b.revenue - a.revenue);

    return {
      orders, rows,
      totalRevenue, totalProfit, totalOrders,
      avgRevenue: totalOrders ? totalRevenue / totalOrders : 0,
      topProducts: topProducts(orders, 5),
      staffReport
    };
  }

  window.Reports = {
    last7Days, revenueByDay, revenueByCategory, topProducts,
    todayStats, getDashboardData, buildPeriodReport
  };
})();
