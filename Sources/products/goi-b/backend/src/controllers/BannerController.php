<?php
class BannerController {
    public function __construct(private Database $db) {}

    public function index(array $params): void {
        Auth::require();
        Response::ok($this->db->query("SELECT * FROM banners ORDER BY sort_order ASC, created_at DESC"));
    }

    public function show(array $params): void {
        Auth::require();
        $banner = $this->db->queryOne("SELECT * FROM banners WHERE id = ?", [$params['id']]);
        if (!$banner) Response::notFound('Banner không tồn tại');
        Response::ok($banner);
    }

    public function store(array $params): void {
        Auth::require();
        $body  = bodyJson();
        $title = trim($body['title'] ?? '');
        $image = trim($body['image'] ?? '');
        if (!$title) Response::error('Tiêu đề không được để trống');
        if (!$image) Response::error('Ảnh không được để trống');

        $id = $this->db->execute(
            "INSERT INTO banners (title, image, link, target, position, sort_order, status)
             VALUES (?, ?, ?, ?, ?, ?, ?)",
            [
                $title, $image,
                $body['link'] ?? '',
                $body['target'] ?? '_self',
                $body['position'] ?? 'homepage_hero',
                (int) ($body['sort_order'] ?? 0),
                $body['status'] ?? 'published',
            ]
        );
        Response::created($this->db->queryOne("SELECT * FROM banners WHERE id = ?", [$id]));
    }

    public function update(array $params): void {
        Auth::require();
        $banner = $this->db->queryOne("SELECT * FROM banners WHERE id = ?", [$params['id']]);
        if (!$banner) Response::notFound('Banner không tồn tại');

        $body = bodyJson();
        $this->db->execute(
            "UPDATE banners SET title=?, image=?, link=?, target=?, position=?, sort_order=?, status=?
             WHERE id=?",
            [
                trim($body['title'] ?? $banner['title']),
                $body['image'] ?? $banner['image'],
                $body['link'] ?? $banner['link'],
                $body['target'] ?? $banner['target'],
                $body['position'] ?? $banner['position'],
                (int) ($body['sort_order'] ?? $banner['sort_order']),
                $body['status'] ?? $banner['status'],
                $params['id'],
            ]
        );
        Response::ok($this->db->queryOne("SELECT * FROM banners WHERE id = ?", [$params['id']]));
    }

    public function destroy(array $params): void {
        Auth::require();
        if (!$this->db->queryOne("SELECT id FROM banners WHERE id = ?", [$params['id']])) {
            Response::notFound('Banner không tồn tại');
        }
        $this->db->execute("DELETE FROM banners WHERE id = ?", [$params['id']]);
        Response::ok();
    }
}
