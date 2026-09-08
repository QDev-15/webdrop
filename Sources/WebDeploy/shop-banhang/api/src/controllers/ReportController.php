<?php
declare(strict_types=1);

class ReportController {
    public function __construct(private Database $db) {}

    private function isLowStock(array $product): bool {
        $total = $product['has_variants']
            ? (int)$this->db->scalar("SELECT COALESCE(SUM(stock),0) FROM product_variants WHERE product_id = ?", [$product['id']])
            : (int)$product['stock'];
        return $total <= (int)$product['min_stock'];
    }

    private function last7Days(): array {
        $days = [];
        for ($i = 6; $i >= 0; $i--) {
            $days[] = date('Y-m-d', strtotime("-{$i} days"));
        }
        return $days;
    }

    // GET /reports/dashboard — superadmin
    public function dashboard(array $p): void {
        Auth::requireRole('superadmin');
        $today = date('Y-m-d');

        $todayOrders = $this->db->query("SELECT * FROM orders WHERE date(created_at) = ?", [$today]);
        $revenue = array_sum(array_map(fn($o) => (float)$o['total'], $todayOrders));
        $products = $this->db->query("SELECT * FROM products");
        $lowStock = count(array_filter($products, fn($pr) => $this->isLowStock($pr)));
        $newCustomers = (int)$this->db->scalar("SELECT COUNT(*) FROM customers WHERE date(created_at) = ?", [$today]);

        $days = $this->last7Days();
        $orders7d = $this->db->query(
            "SELECT * FROM orders WHERE date(created_at) BETWEEN ? AND ?",
            [$days[0], $days[count($days) - 1]]
        );
        $revenueByDay = array_fill_keys($days, 0.0);
        foreach ($orders7d as $o) {
            $d = date('Y-m-d', strtotime($o['created_at']));
            if (isset($revenueByDay[$d])) $revenueByDay[$d] += (float)$o['total'];
        }

        $categories = $this->db->query("SELECT * FROM categories ORDER BY sort_order, id");
        $productCat = [];
        foreach ($products as $pr) { $productCat[$pr['id']] = $pr['category_id']; }
        $catRevenue = array_fill_keys(array_column($categories, 'id'), 0.0);
        $topMap = [];
        foreach ($orders7d as $o) {
            $items = $this->db->query("SELECT * FROM order_items WHERE order_id = ?", [$o['id']]);
            foreach ($items as $it) {
                $catId = $productCat[$it['product_id']] ?? null;
                if ($catId !== null && isset($catRevenue[$catId])) $catRevenue[$catId] += $it['price'] * $it['quantity'];
                $key = $it['product_id'];
                if (!isset($topMap[$key])) $topMap[$key] = ['product_id' => $key, 'name' => $it['product_name'], 'qty' => 0, 'revenue' => 0];
                $topMap[$key]['qty'] += (int)$it['quantity'];
                $topMap[$key]['revenue'] += $it['price'] * $it['quantity'];
            }
        }
        usort($topMap, fn($a, $b) => $b['qty'] <=> $a['qty']);

        $recentOrders = $this->db->query(
            "SELECT o.*, COALESCE(c.name, 'Khách lẻ') AS customer_name FROM orders o
             LEFT JOIN customers c ON c.id = o.customer_id
             ORDER BY o.id DESC LIMIT 5"
        );

        $openShift = $this->db->queryOne(
            "SELECT s.*, u.name AS cashier_name FROM shifts s INNER JOIN users u ON u.id = s.user_id WHERE s.status = 'open' ORDER BY s.id DESC LIMIT 1"
        );

        Response::json([
            'stats' => ['revenue' => $revenue, 'order_count' => count($todayOrders), 'low_stock' => $lowStock, 'new_customers' => $newCustomers],
            'days' => $days,
            'revenue_series' => array_values($revenueByDay),
            'category_breakdown' => ['labels' => array_column($categories, 'name'), 'values' => array_values($catRevenue)],
            'top_products' => array_slice($topMap, 0, 5),
            'recent_orders' => $recentOrders,
            'open_shift' => $openShift,
        ]);
    }

    // GET /reports/period?from=&to=&category_id=&staff_id= — superadmin
    public function period(array $p): void {
        Auth::requireRole('superadmin');
        $from = trim((string)($_GET['from'] ?? ''));
        $to = trim((string)($_GET['to'] ?? ''));
        $categoryId = $_GET['category_id'] ?? '';
        $staffId = $_GET['staff_id'] ?? '';

        if (!$from || !$to) { Response::error('Vui lòng chọn khoảng thời gian.'); return; }
        if ($from > $to) { Response::error('"Từ ngày" phải trước hoặc bằng "Đến ngày".'); return; }

        $sql = "SELECT o.* FROM orders o";
        $params = [];
        if ($staffId !== '') {
            $sql .= " INNER JOIN shifts s ON s.id = o.shift_id WHERE s.user_id = ? AND date(o.created_at) BETWEEN ? AND ?";
            $params = [(int)$staffId, $from, $to];
        } else {
            $sql .= " WHERE date(o.created_at) BETWEEN ? AND ?";
            $params = [$from, $to];
        }
        $orders = $this->db->query($sql, $params);

        if ($categoryId !== '') {
            $catId = (int)$categoryId;
            $orders = array_values(array_filter($orders, function ($o) use ($catId) {
                $items = $this->db->query("SELECT product_id FROM order_items WHERE order_id = ?", [$o['id']]);
                foreach ($items as $it) {
                    $pcat = $this->db->scalar("SELECT category_id FROM products WHERE id = ?", [$it['product_id']]);
                    if ((int)$pcat === $catId) return true;
                }
                return false;
            }));
        }

        if (!$orders) { Response::json(['total_orders' => 0]); return; }

        $byDate = [];
        $topMap = [];
        foreach ($orders as $o) {
            $d = date('Y-m-d', strtotime($o['created_at']));
            if (!isset($byDate[$d])) $byDate[$d] = ['date' => $d, 'order_count' => 0, 'qty' => 0, 'revenue' => 0.0, 'profit' => 0.0];
            $byDate[$d]['order_count']++;
            $byDate[$d]['revenue'] += (float)$o['total'];
            $items = $this->db->query("SELECT oi.*, p.cost_price FROM order_items oi LEFT JOIN products p ON p.id = oi.product_id WHERE oi.order_id = ?", [$o['id']]);
            foreach ($items as $it) {
                $byDate[$d]['qty'] += (int)$it['quantity'];
                $lineProfit = $it['price'] * $it['quantity'] - ((float)($it['cost_price'] ?? 0)) * $it['quantity'];
                $byDate[$d]['profit'] += $lineProfit;
                $key = $it['product_id'];
                if (!isset($topMap[$key])) $topMap[$key] = ['product_id' => $key, 'name' => $it['product_name'], 'qty' => 0, 'revenue' => 0];
                $topMap[$key]['qty'] += (int)$it['quantity'];
                $topMap[$key]['revenue'] += $it['price'] * $it['quantity'];
            }
            // Chiết khấu làm giảm doanh thu thực nhận — trừ khỏi lợi nhuận trong ngày
            $byDate[$d]['profit'] -= (float)$o['discount'];
        }
        ksort($byDate);
        $rows = array_values($byDate);

        $totalRevenue = array_sum(array_map(fn($o) => (float)$o['total'], $orders));
        $totalProfit = array_sum(array_column($rows, 'profit'));
        $totalOrders = count($orders);

        usort($topMap, fn($a, $b) => $b['qty'] <=> $a['qty']);

        $staffMap = [];
        foreach ($orders as $o) {
            $shift = $this->db->queryOne("SELECT s.user_id, u.name FROM shifts s INNER JOIN users u ON u.id = s.user_id WHERE s.id = ?", [$o['shift_id']]);
            $uid = $shift['user_id'] ?? 0;
            if (!isset($staffMap[$uid])) $staffMap[$uid] = ['user_id' => $uid, 'name' => $shift['name'] ?? 'N/A', 'order_count' => 0, 'revenue' => 0];
            $staffMap[$uid]['order_count']++;
            $staffMap[$uid]['revenue'] += (float)$o['total'];
        }
        usort($staffMap, fn($a, $b) => $b['revenue'] <=> $a['revenue']);

        Response::json([
            'total_orders' => $totalOrders,
            'total_revenue' => $totalRevenue,
            'total_profit' => $totalProfit,
            'avg_revenue' => $totalOrders ? $totalRevenue / $totalOrders : 0,
            'rows' => $rows,
            'top_products' => array_slice($topMap, 0, 5),
            'staff_report' => array_values($staffMap),
        ]);
    }
}
