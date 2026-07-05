<?php
declare(strict_types=1);

class ArticleController {
    public function __construct(private Database $db) {}

    public function index(array $p): void {
        Auth::require();
        $rows = $this->db->query("SELECT * FROM articles ORDER BY sort_order ASC, created_at DESC");
        Response::json($rows);
    }

    public function store(array $p): void {
        Auth::require();
        $b = bodyJson();
        $title = trim($b['title'] ?? '');
        if (!$title) { Response::error('Tiêu đề bài viết không được để trống.', 422); return; }
        $slug = $b['slug'] ?? preg_replace('/[^a-z0-9]+/', '-', strtolower($title));
        $id = $this->db->execute(
            "INSERT INTO articles (title, slug, excerpt, content, thumbnail, tag, read_time, status, sort_order) VALUES (?,?,?,?,?,?,?,?,?)",
            [
                $title,
                $slug,
                trim($b['excerpt']   ?? ''),
                trim($b['content']   ?? ''),
                trim($b['thumbnail'] ?? ''),
                trim($b['tag']       ?? ''),
                trim($b['read_time'] ?? ''),
                trim($b['status']    ?? 'published'),
                (int)($b['sort_order'] ?? 0),
            ]
        );
        Response::json($this->db->queryOne("SELECT * FROM articles WHERE id = ?", [$id]), 201);
    }

    public function show(array $p): void {
        Auth::require();
        $row = $this->db->queryOne("SELECT * FROM articles WHERE id = ?", [(int)$p['id']]);
        if (!$row) { Response::error('Không tìm thấy.', 404); return; }
        Response::json($row);
    }

    public function update(array $p): void {
        Auth::require();
        $b = bodyJson();
        $id = (int)$p['id'];
        $row = $this->db->queryOne("SELECT id FROM articles WHERE id = ?", [$id]);
        if (!$row) { Response::error('Không tìm thấy.', 404); return; }
        $this->db->execute(
            "UPDATE articles SET title=?, slug=?, excerpt=?, content=?, thumbnail=?, tag=?, read_time=?, status=?, sort_order=? WHERE id=?",
            [
                trim($b['title']     ?? ''),
                trim($b['slug']      ?? ''),
                trim($b['excerpt']   ?? ''),
                trim($b['content']   ?? ''),
                trim($b['thumbnail'] ?? ''),
                trim($b['tag']       ?? ''),
                trim($b['read_time'] ?? ''),
                trim($b['status']    ?? 'published'),
                (int)($b['sort_order'] ?? 0),
                $id,
            ]
        );
        Response::json($this->db->queryOne("SELECT * FROM articles WHERE id = ?", [$id]));
    }

    public function destroy(array $p): void {
        Auth::require();
        $this->db->execute("DELETE FROM articles WHERE id = ?", [(int)$p['id']]);
        Response::json(['ok' => true]);
    }
}
