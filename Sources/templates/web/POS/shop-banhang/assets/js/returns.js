// ============================================================================
// returns.js — Trả hàng / hoàn tiền
// ============================================================================

(function () {
  'use strict';

  const REASON_LABELS = {
    'loi-san-pham': 'Lỗi sản phẩm',
    'doi-y': 'Đổi ý',
    'giao-nham': 'Giao nhầm',
    'khac': 'Khác'
  };

  function findOrder(orderId) {
    const id = (orderId || '').trim();
    if (!id) return null;
    return POS.getOrderById(id);
  }

  // Số lượng tối đa còn có thể trả cho từng item trong đơn (đã trừ phần đã trả trước đó)
  function getReturnableItems(order) {
    if (!order) return [];
    const priorReturns = POS.getReturnsForOrder(order.id);
    const returnedQty = {};
    priorReturns.forEach(r => {
      r.items.forEach(it => {
        const key = it.productId + '::' + (it.variantSku || '');
        returnedQty[key] = (returnedQty[key] || 0) + it.quantity;
      });
    });

    return order.items.map(item => {
      const key = item.productId + '::' + (item.variantSku || '');
      const alreadyReturned = returnedQty[key] || 0;
      return Object.assign({}, item, {
        alreadyReturned,
        maxReturnable: Math.max(0, item.quantity - alreadyReturned)
      });
    });
  }

  // selections: [{productId, variantSku, name, price, quantity}]
  function processReturn(order, selections, reason) {
    if (!order) throw new Error('Không tìm thấy đơn hàng');
    if (!selections || !selections.length) throw new Error('Vui lòng chọn ít nhất 1 sản phẩm cần trả');
    if (!REASON_LABELS[reason]) throw new Error('Vui lòng chọn lý do trả hàng');

    const returnable = getReturnableItems(order);

    let refundAmount = 0;
    selections.forEach(sel => {
      const qty = Number(sel.quantity);
      if (isNaN(qty) || qty <= 0) throw new Error('Số lượng trả phải lớn hơn 0');
      const ref = returnable.find(it => it.productId === sel.productId && (it.variantSku || null) === (sel.variantSku || null));
      if (!ref) throw new Error('Sản phẩm không thuộc đơn hàng này');
      if (qty > ref.maxReturnable) {
        throw new Error(`${ref.name} chỉ có thể trả tối đa ${ref.maxReturnable} (đã mua ${ref.quantity}, đã trả ${ref.alreadyReturned})`);
      }
      refundAmount += ref.price * qty;
    });

    // Cộng lại tồn kho cho từng sản phẩm/biến thể
    selections.forEach(sel => {
      Inventory.restockItem(sel.productId, sel.variantSku || null, Number(sel.quantity));
    });

    const record = POS.saveReturn({
      orderId: order.id,
      items: selections.map(sel => ({
        productId: sel.productId, variantSku: sel.variantSku || null,
        name: sel.name, quantity: Number(sel.quantity)
      })),
      reason,
      refundAmount
    });

    order.hasReturn = true;
    POS.updateOrder(order);

    return record;
  }

  window.Returns = { REASON_LABELS, findOrder, getReturnableItems, processReturn };
})();
