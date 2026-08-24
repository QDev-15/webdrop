<?php
declare(strict_types=1);

/**
 * AccountController — đăng ký / đăng nhập / thông tin tài khoản cho NGƯỜI ĐĂNG TIN
 * công khai (website). Dùng AccountAuth (session riêng), KHÔNG liên quan bảng `users`/Auth.php.
 */
class AccountController {
    public function __construct(private Database $db) {}

    private function publicFields(array $a): array {
        return [
            'id'             => (int)$a['id'],
            'name'           => $a['name'],
            'email'          => $a['email'],
            'phone'          => $a['phone'],
            'role'           => $a['role'],
            'avatar'         => $a['avatar'],
            'credit_balance' => (int)$a['credit_balance'],
            'status'         => $a['status'],
        ];
    }

    public function register(array $p): void {
        $b = bodyJson();
        $name  = trim($b['name'] ?? '');
        $email = trim(mb_strtolower($b['email'] ?? '', 'UTF-8'));
        $phone = trim($b['phone'] ?? '');
        $password = (string)($b['password'] ?? '');

        if (!$name || !$email || !$phone || !$password) { Response::error('Vui lòng điền đầy đủ thông tin.'); return; }
        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) { Response::error('Email không hợp lệ.'); return; }
        if (mb_strlen($password) < 6) { Response::error('Mật khẩu tối thiểu 6 ký tự.'); return; }
        if ($this->db->queryOne("SELECT id FROM accounts WHERE email = ?", [$email])) {
            Response::error('Email này đã được đăng ký.'); return;
        }

        $hash = password_hash($password, PASSWORD_BCRYPT);
        $id = $this->db->execute(
            "INSERT INTO accounts (name, email, phone, password, role, credit_balance, status) VALUES (?, ?, ?, ?, 'chinh-chu', 0, 'active')",
            [$name, $email, $phone, $hash]
        );
        $acc = $this->db->queryOne("SELECT * FROM accounts WHERE id = ?", [$id]);
        AccountAuth::login($acc);
        Response::json($this->publicFields($acc), 201);
    }

    public function login(array $p): void {
        $b = bodyJson();
        $email    = trim(mb_strtolower($b['email'] ?? '', 'UTF-8'));
        $password = (string)($b['password'] ?? '');
        if (!$email || !$password) { Response::error('Email và mật khẩu không được để trống.'); return; }

        $acc = $this->db->queryOne("SELECT * FROM accounts WHERE email = ?", [$email]);
        if (!$acc || !password_verify($password, $acc['password'])) {
            Response::error('Email hoặc mật khẩu không đúng.', 401); return;
        }
        if ($acc['status'] === 'banned') {
            Response::error('Tài khoản của bạn đã bị khóa. Vui lòng liên hệ hỗ trợ.', 403); return;
        }
        AccountAuth::login($acc);
        Response::json($this->publicFields($acc));
    }

    public function logout(array $p): void {
        AccountAuth::logout();
        Response::json(['ok' => true]);
    }

    public function me(array $p): void {
        $session = AccountAuth::require();
        $acc = $this->db->queryOne("SELECT * FROM accounts WHERE id = ?", [$session['id']]);
        if (!$acc) { Response::error('Không tìm thấy tài khoản.', 404); return; }
        Response::json($this->publicFields($acc));
    }

    public function updateMe(array $p): void {
        $session = AccountAuth::require();
        $b = bodyJson();
        $name  = trim($b['name'] ?? '');
        $email = trim(mb_strtolower($b['email'] ?? '', 'UTF-8'));
        $phone = trim($b['phone'] ?? '');
        if (!$name || !$email || !$phone) { Response::error('Vui lòng điền đầy đủ thông tin.'); return; }
        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) { Response::error('Email không hợp lệ.'); return; }

        $existing = $this->db->queryOne("SELECT id FROM accounts WHERE email = ? AND id != ?", [$email, $session['id']]);
        if ($existing) { Response::error('Email này đã được dùng bởi tài khoản khác.'); return; }

        $this->db->execute("UPDATE accounts SET name = ?, email = ?, phone = ? WHERE id = ?", [$name, $email, $phone, $session['id']]);
        $acc = $this->db->queryOne("SELECT * FROM accounts WHERE id = ?", [$session['id']]);
        AccountAuth::login($acc); // cập nhật lại tên/email trong session
        Response::json($this->publicFields($acc));
    }
}
