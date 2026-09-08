// ============================================================================
// inventory.js — Quản lý sản phẩm (biến thể), nhập kho, kiểm kê tồn kho
// ============================================================================

(function () {
  'use strict';

  function suggestSku(productName, size, color) {
    const initials = (productName || 'SP')
      .normalize('NFD').replace(/[̀-ͯ]/g, '')
      .split(/\s+/).map(w => w[0]).join('').toUpperCase().slice(0, 4) || 'SP';
    const sizePart = (size || '').toUpperCase().replace(/\s+/g, '').slice(0, 2);
    const colorPart = (color || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toUpperCase().replace(/\s+/g, '').slice(0, 1);
    return [initials, sizePart, colorPart].filter(Boolean).join('-');
  }

  // Trừ tồn kho khi thanh toán — trả về false nếu không đủ hàng cho BẤT KỲ item nào (không trừ phần nào cả)
  function deductStockForItems(items) {
    const products = POS.getProducts();
    // 1) validate toàn bộ trước khi trừ bất cứ gì (atomic ở mức UI)
    for (const item of items) {
      const product = products.find(p => p.id === item.productId);
      if (!product) return { ok: false, message: `Sản phẩm không tồn tại (ID ${item.productId})` };
      if (product.hasVariants) {
        const variant = (product.variants || []).find(v => v.sku === item.variantSku);
        if (!variant) return { ok: false, message: `Biến thể không tồn tại: ${item.name}` };
        if (variant.stock < item.quantity) {
          return { ok: false, message: `${item.name} (${item.size}/${item.color}) chỉ còn ${variant.stock} trong kho` };
        }
      } else {
        if (product.stock < item.quantity) {
          return { ok: false, message: `${item.name} chỉ còn ${product.stock} trong kho` };
        }
      }
    }
    // 2) trừ thật
    for (const item of items) {
      const product = products.find(p => p.id === item.productId);
      if (product.hasVariants) {
        const variant = product.variants.find(v => v.sku === item.variantSku);
        variant.stock -= item.quantity;
      } else {
        product.stock -= item.quantity;
      }
    }
    POS.saveProduct.length; // no-op reference to avoid unused warnings in some linters
    localStorage.setItem('bp_products', JSON.stringify(products));
    return { ok: true };
  }

  // Cộng lại tồn kho (dùng khi trả hàng)
  function restockItem(productId, variantSku, quantity) {
    const products = POS.getProducts();
    const product = products.find(p => p.id === productId);
    if (!product) return false;
    if (product.hasVariants && variantSku) {
      const variant = (product.variants || []).find(v => v.sku === variantSku);
      if (variant) variant.stock += quantity;
    } else {
      product.stock += quantity;
    }
    localStorage.setItem('bp_products', JSON.stringify(products));
    return true;
  }

  // ---------------------------------------------------------------------
  // Nhập kho
  // ---------------------------------------------------------------------
  function createStockImport(supplier, date, lines) {
    if (!supplier || !supplier.trim()) throw new Error('Vui lòng chọn hoặc nhập nhà cung cấp');
    if (!lines || !lines.length) throw new Error('Vui lòng chọn ít nhất 1 sản phẩm để nhập kho');

    const products = POS.getProducts();
    let totalCost = 0;
    const items = [];

    for (const line of lines) {
      const qty = Number(line.quantity);
      const unitCost = Number(line.unitCost);
      if (!line.productId || isNaN(qty) || qty <= 0) throw new Error('Số lượng nhập phải lớn hơn 0');
      if (isNaN(unitCost) || unitCost < 0) throw new Error('Đơn giá nhập không hợp lệ');

      const product = products.find(p => p.id === line.productId);
      if (!product) throw new Error('Sản phẩm không tồn tại');

      if (product.hasVariants) {
        const variant = (product.variants || []).find(v => v.sku === line.variantSku);
        if (!variant) throw new Error(`Vui lòng chọn biến thể cho "${product.name}"`);
        variant.stock += qty;
        items.push({ productId: product.id, productName: product.name, variantSku: variant.sku, quantity: qty, unitCost });
      } else {
        product.stock += qty;
        items.push({ productId: product.id, productName: product.name, quantity: qty, unitCost });
      }
      totalCost += qty * unitCost;
    }

    localStorage.setItem('bp_products', JSON.stringify(products));
    POS.addSupplier(supplier.trim());

    return POS.saveStockImport({ supplier: supplier.trim(), date, items, totalCost });
  }

  // ---------------------------------------------------------------------
  // Kiểm kê tồn kho — trả về danh sách dòng {productId, variantSku, label, systemStock}
  // ---------------------------------------------------------------------
  function buildStocktakeRows() {
    const rows = [];
    POS.getProducts().forEach(product => {
      if (product.hasVariants && product.variants && product.variants.length) {
        product.variants.forEach(v => {
          rows.push({
            productId: product.id,
            variantSku: v.sku,
            label: `${product.name} (${v.size}/${v.color})`,
            systemStock: v.stock
          });
        });
      } else {
        rows.push({
          productId: product.id,
          variantSku: null,
          label: product.name,
          systemStock: product.stock
        });
      }
    });
    return rows;
  }

  // countedMap: { "productId" hoặc "productId::variantSku" -> số lượng thực tế }
  function applyStocktake(countedMap, checkedBy) {
    const products = POS.getProducts();
    let discrepancies = 0;

    products.forEach(product => {
      if (product.hasVariants && product.variants && product.variants.length) {
        product.variants.forEach(v => {
          const key = product.id + '::' + v.sku;
          if (Object.prototype.hasOwnProperty.call(countedMap, key)) {
            const counted = Number(countedMap[key]);
            if (!isNaN(counted) && counted !== v.stock) discrepancies++;
            if (!isNaN(counted)) v.stock = Math.max(0, counted);
          }
        });
      } else {
        const key = String(product.id);
        if (Object.prototype.hasOwnProperty.call(countedMap, key)) {
          const counted = Number(countedMap[key]);
          if (!isNaN(counted) && counted !== product.stock) discrepancies++;
          if (!isNaN(counted)) product.stock = Math.max(0, counted);
        }
      }
    });

    localStorage.setItem('bp_products', JSON.stringify(products));
    return POS.saveStocktake({
      date: POS.todayISODate(),
      checkedBy: checkedBy || '',
      discrepancies
    });
  }

  window.Inventory = {
    suggestSku, deductStockForItems, restockItem,
    createStockImport, buildStocktakeRows, applyStocktake
  };
})();
