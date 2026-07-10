<?php
declare(strict_types=1);

class ProductReviewController {
    public function __construct(private Database $db) {}

    public function index(): void {
        Auth::require();
        $productId = isset($_GET['product_id']) && $_GET['product_id'] !== '' ? (int)$_GET['product_id'] : null;
        if ($productId) {
            $rows = $this->db->query(
                "SELECT r.*, p.name as product_name FROM product_reviews r
                 LEFT JOIN products p ON p.id = r.product_id
                 WHERE r.product_id = ? ORDER BY r.sort_order ASC, r.created_at DESC",
                [$productId]
            );
        } else {
            $rows = $this->db->query(
                "SELECT r.*, p.name as product_name FROM product_reviews r
                 LEFT JOIN products p ON p.id = r.product_id
                 ORDER BY r.created_at DESC"
            );
        }
        Response::json($rows);
    }

    public function show(array $params): void {
        Auth::require();
        $id  = (int)($params['id'] ?? 0);
        $row = $this->db->queryOne(
            "SELECT r.*, p.name as product_name FROM product_reviews r
             LEFT JOIN products p ON p.id = r.product_id
             WHERE r.id = ?",
            [$id]
        );
        if (!$row) { Response::error('Không tìm thấy đánh giá', 404); return; }
        Response::json($row);
    }

    public function store(): void {
        Auth::require();
        $data        = bodyJson();
        $productId   = (int)($data['product_id'] ?? 0);
        $authorName  = trim($data['author_name'] ?? '');
        $rating      = max(1, min(5, (int)($data['rating'] ?? 5)));
        $variantNote = trim($data['variant_note'] ?? '');
        $reviewDate  = trim($data['review_date'] ?? date('Y-m-d'));
        $content     = trim($data['content'] ?? '');
        $sortOrder   = (int)($data['sort_order'] ?? 0);

        if (!$productId || !$authorName || !$content) {
            Response::error('Vui lòng chọn sản phẩm và điền đầy đủ tên, nội dung đánh giá', 422);
            return;
        }
        $product = $this->db->queryOne("SELECT id FROM products WHERE id = ?", [$productId]);
        if (!$product) { Response::error('Sản phẩm không tồn tại', 404); return; }

        $id = $this->db->execute(
            "INSERT INTO product_reviews (product_id, author_name, rating, variant_note, review_date, content, sort_order)
             VALUES (?, ?, ?, ?, ?, ?, ?)",
            [$productId, $authorName, $rating, $variantNote, $reviewDate, $content, $sortOrder]
        );
        $this->recalcProductRating($productId);
        $row = $this->db->queryOne("SELECT * FROM product_reviews WHERE id = ?", [$id]);
        Response::json($row, 201);
    }

    public function update(array $params): void {
        Auth::require();
        $id  = (int)($params['id'] ?? 0);
        $row = $this->db->queryOne("SELECT * FROM product_reviews WHERE id = ?", [$id]);
        if (!$row) { Response::error('Không tìm thấy đánh giá', 404); return; }

        $data        = bodyJson();
        $authorName  = trim($data['author_name'] ?? $row['author_name']);
        $rating      = max(1, min(5, (int)($data['rating'] ?? $row['rating'])));
        $variantNote = trim($data['variant_note'] ?? ($row['variant_note'] ?? ''));
        $reviewDate  = trim($data['review_date'] ?? ($row['review_date'] ?? ''));
        $content     = trim($data['content'] ?? $row['content']);
        $sortOrder   = (int)($data['sort_order'] ?? $row['sort_order']);

        $this->db->execute(
            "UPDATE product_reviews SET author_name=?, rating=?, variant_note=?, review_date=?, content=?, sort_order=? WHERE id=?",
            [$authorName, $rating, $variantNote, $reviewDate, $content, $sortOrder, $id]
        );
        $this->recalcProductRating((int)$row['product_id']);
        $row = $this->db->queryOne("SELECT * FROM product_reviews WHERE id = ?", [$id]);
        Response::json($row);
    }

    public function destroy(array $params): void {
        Auth::require();
        $id  = (int)($params['id'] ?? 0);
        $row = $this->db->queryOne("SELECT * FROM product_reviews WHERE id = ?", [$id]);
        if (!$row) { Response::error('Không tìm thấy đánh giá', 404); return; }
        $this->db->execute("DELETE FROM product_reviews WHERE id = ?", [$id]);
        $this->recalcProductRating((int)$row['product_id']);
        Response::json(['message' => 'Đã xóa đánh giá']);
    }

    private function recalcProductRating(int $productId): void {
        $agg = $this->db->queryOne(
            "SELECT AVG(rating) as avg_rating, COUNT(*) as cnt FROM product_reviews WHERE product_id = ?",
            [$productId]
        );
        $cnt = (int)($agg['cnt'] ?? 0);
        if ($cnt === 0) {
            $this->db->execute("UPDATE products SET review_count = 0 WHERE id = ?", [$productId]);
            return;
        }
        $avg = round((float)$agg['avg_rating'], 1);
        $this->db->execute("UPDATE products SET rating = ?, review_count = ? WHERE id = ?", [$avg, $cnt, $productId]);
    }
}
