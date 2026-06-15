<?php
declare(strict_types=1);

class PublicController {
    public function __construct(private Database $db) {}

    public function settings(array $p): void {
        $rows = $this->db->query("SELECT key, value, \"group\" FROM settings");
        $result = [];
        foreach ($rows as $r) {
            $result[$r['group']][$r['key']] = $r['value'];
        }
        Response::json($result);
    }

    public function heroSlides(array $p): void {
        $slides = $this->db->query(
            "SELECT * FROM hero_slides WHERE status = 'published' ORDER BY sort_order, id"
        );
        Response::json($slides);
    }

    public function forumCategories(array $p): void {
        $cats = $this->db->query(
            "SELECT c.*, COUNT(t.id) as thread_count
             FROM forum_categories c
             LEFT JOIN forum_threads t ON t.category_id = c.id AND t.status = 'published'
             WHERE c.status = 'published'
             GROUP BY c.id
             ORDER BY c.sort_order, c.id"
        );
        Response::json($cats);
    }

    public function forumThreads(array $p): void {
        $limit  = max(1, min(50, (int)($_GET['limit'] ?? 20)));
        $offset = max(0, (int)($_GET['offset'] ?? 0));
        $sort   = $_GET['sort'] ?? 'latest'; // latest | hot | unanswered
        $catId  = $_GET['category_id'] ?? null;

        $where = "t.status = 'published'";
        $binds = [];
        if ($catId) {
            $where .= " AND t.category_id = ?";
            $binds[] = (int)$catId;
        }
        if ($sort === 'hot') {
            $where .= " AND t.is_hot = 1";
        } elseif ($sort === 'unanswered') {
            $where .= " AND t.reply_count = 0";
        }

        $orderBy = match($sort) {
            'hot'        => "t.is_hot DESC, t.reply_count DESC",
            'unanswered' => "t.created_at DESC",
            default      => "t.is_pinned DESC, t.updated_at DESC, t.created_at DESC",
        };

        $binds[] = $limit;
        $binds[] = $offset;

        $threads = $this->db->query(
            "SELECT t.*, c.name as category_name, c.slug as category_slug, c.icon as category_icon
             FROM forum_threads t
             LEFT JOIN forum_categories c ON c.id = t.category_id
             WHERE {$where}
             ORDER BY {$orderBy}
             LIMIT ? OFFSET ?",
            $binds
        );
        Response::json($threads);
    }

    public function forumTags(array $p): void {
        $tags = $this->db->query(
            "SELECT * FROM forum_tags ORDER BY usage_count DESC LIMIT 20"
        );
        Response::json($tags);
    }

    public function submitContact(array $p): void {
        $b = bodyJson();
        $name    = trim($b['name'] ?? '');
        $email   = trim($b['email'] ?? '');
        $message = trim($b['message'] ?? '');

        if (!$name || !$message) {
            Response::error('Họ tên và nội dung không được để trống.'); return;
        }

        $this->db->execute(
            "INSERT INTO contacts (name, email, phone, subject, message) VALUES (?, ?, ?, ?, ?)",
            [$name, $email, $b['phone'] ?? '', $b['subject'] ?? '', $message]
        );
        Response::json(['ok' => true], 201);
    }
}
