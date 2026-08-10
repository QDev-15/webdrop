import nodemailer from 'nodemailer'
import { prisma } from './prisma'

async function getSmtpConfig() {
  const keys = ['smtp_host', 'smtp_port', 'smtp_user', 'smtp_password', 'smtp_from_name', 'smtp_from_email']
  const rows = await prisma.setting.findMany({ where: { key: { in: keys } } })
  const cfg: Record<string, string> = {}
  for (const r of rows) cfg[r.key] = r.value ?? ''
  return cfg
}

async function getEmailSettings() {
  const keys = ['email_subject_download', 'email_text_website_zip', 'email_text_admin_zip', 'email_text_expiry', 'email_logo_text']
  const rows = await prisma.setting.findMany({ where: { key: { in: keys } } })
  const settings: Record<string, string> = {}
  for (const r of rows) settings[r.key] = r.value ?? ''

  // Fallback defaults if settings not configured
  return {
    email_subject_download: settings.email_subject_download || '[webdrop.store] Link tải file — Đơn hàng {orderCode}',
    email_text_website_zip: settings.email_text_website_zip || '↓ Tải web.zip — Website public',
    email_text_admin_zip: settings.email_text_admin_zip || '↓ Tải admin.zip — Trang quản trị',
    email_text_expiry: settings.email_text_expiry || 'Link có hiệu lực <strong>72 giờ</strong> và dùng được tối đa <strong>5 lần</strong>.',
    email_logo_text: settings.email_logo_text || 'webdrop<span style="color:#4ade80">.</span>store',
  }
}

export async function sendDownloadEmail(opts: {
  to: string
  customerName: string
  orderCode: string
  downloadToken: string
  type: 'template' | 'website'
  slug: string
  amount: number
}) {
  let cfg: Record<string, string>
  let emailSettings: Record<string, string>
  try {
    cfg = await getSmtpConfig()
    emailSettings = await getEmailSettings()
  } catch {
    console.error('[email] Không lấy được cấu hình email')
    return
  }

  if (!cfg.smtp_host || !cfg.smtp_user || !cfg.smtp_password) {
    console.warn('[email] SMTP chưa cấu hình — bỏ qua gửi email')
    return
  }

  const transporter = nodemailer.createTransport({
    host: cfg.smtp_host,
    port: parseInt(cfg.smtp_port || '587'),
    secure: cfg.smtp_port === '465',
    auth: { user: cfg.smtp_user, pass: cfg.smtp_password },
  })

  const baseUrl = process.env.NEXT_PUBLIC_URL || 'https://webdrop.store'
  const tokenParam = encodeURIComponent(opts.downloadToken)

  const downloadLinks = opts.type === 'website'
    ? `
      <a href="${baseUrl}/api/download?token=${tokenParam}&file=web" style="display:block;margin:8px 0;padding:12px 18px;background:#1a6b52;color:#fff;border-radius:8px;text-decoration:none;font-weight:600">
        ${emailSettings.email_text_website_zip}
      </a>
      <a href="${baseUrl}/api/download?token=${tokenParam}&file=admin" style="display:block;margin:8px 0;padding:12px 18px;background:#1a6b52;color:#fff;border-radius:8px;text-decoration:none;font-weight:600">
        ${emailSettings.email_text_admin_zip}
      </a>`
    : `
      <a href="${baseUrl}/api/download?token=${tokenParam}&file=template" style="display:block;margin:8px 0;padding:12px 18px;background:#1a6b52;color:#fff;border-radius:8px;text-decoration:none;font-weight:600">
        ↓ Tải ${opts.slug}.zip — File template
      </a>`

  const html = `
<!DOCTYPE html>
<html lang="vi">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#faf9f7;font-family:'DM Sans',Arial,sans-serif">
  <div style="max-width:520px;margin:40px auto;background:#fff;border-radius:14px;border:1px solid #e8e5df;overflow:hidden">
    <div style="background:#0c0b09;padding:24px 32px">
      <div style="font-size:18px;font-weight:700;color:#fff">${emailSettings.email_logo_text}</div>
    </div>
    <div style="padding:32px">
      <h1 style="font-size:20px;font-weight:700;margin:0 0 8px;color:#1a1917">Thanh toán thành công! 🎉</h1>
      <p style="color:#6b6760;font-size:14px;margin:0 0 24px">Xin chào <strong>${opts.customerName}</strong>, đơn hàng <strong>${opts.orderCode}</strong> đã được xác nhận.</p>

      <div style="background:#e8f4ef;border:1px solid #2d9b73;border-radius:10px;padding:16px 18px;margin-bottom:24px">
        <div style="font-size:12px;font-weight:600;color:#1a6b52;text-transform:uppercase;letter-spacing:.5px;margin-bottom:12px">Tải xuống ngay</div>
        ${downloadLinks}
        <p style="font-size:12px;color:#6b6760;margin:12px 0 0">${emailSettings.email_text_expiry}</p>
      </div>

      <p style="font-size:13px;color:#6b6760;line-height:1.7;margin:0 0 16px">
        Nếu gặp khó khăn khi tải xuống, hãy liên hệ hỗ trợ qua Zalo hoặc email này.
      </p>

      <div style="border-top:1px solid #e8e5df;padding-top:16px;font-size:12px;color:#a09d97">
        webdrop.store · ${cfg.smtp_from_email || 'hello@webdrop.store'}
      </div>
    </div>
  </div>
</body>
</html>`

  const subject = emailSettings.email_subject_download.replace('{orderCode}', opts.orderCode)

  try {
    await transporter.sendMail({
      from: `"${cfg.smtp_from_name || 'webdrop.store'}" <${cfg.smtp_from_email || cfg.smtp_user}>`,
      to: opts.to,
      subject,
      html,
    })
    console.log('[email] Đã gửi download email tới', opts.to)
  } catch (e) {
    console.error('[email] Lỗi gửi email:', e)
  }
}

export async function sendCvCredentialsEmail(opts: {
  to: string
  name: string
  email: string
  password: string
  orderCode: string
}) {
  let cfg: Record<string, string>
  let emailSettings: Record<string, string>
  try {
    cfg = await getSmtpConfig()
    emailSettings = await getEmailSettings()
  } catch {
    console.error('[email] Không lấy được cấu hình email')
    return
  }

  if (!cfg.smtp_host || !cfg.smtp_user || !cfg.smtp_password) {
    console.warn('[email] SMTP chưa cấu hình — bỏ qua gửi email')
    return
  }

  const transporter = nodemailer.createTransport({
    host: cfg.smtp_host,
    port: parseInt(cfg.smtp_port || '587'),
    secure: cfg.smtp_port === '465',
    auth: { user: cfg.smtp_user, pass: cfg.smtp_password },
  })

  const baseUrl = process.env.NEXT_PUBLIC_URL || 'https://webdrop.store'
  const loginUrl = `${baseUrl}/cv-manager/login`

  const html = `
<!DOCTYPE html>
<html lang="vi">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#faf9f7;font-family:'DM Sans',Arial,sans-serif">
  <div style="max-width:520px;margin:40px auto;background:#fff;border-radius:14px;border:1px solid #e8e5df;overflow:hidden">
    <div style="background:#0c0b09;padding:24px 32px">
      <div style="font-size:18px;font-weight:700;color:#fff">${emailSettings.email_logo_text}</div>
    </div>
    <div style="padding:32px">
      <h1 style="font-size:20px;font-weight:700;margin:0 0 8px;color:#1a1917">Tài khoản CV của bạn đã sẵn sàng! 🎉</h1>
      <p style="color:#6b6760;font-size:14px;margin:0 0 24px">Xin chào <strong>${opts.name}</strong>, thanh toán đơn hàng <strong>${opts.orderCode}</strong> đã được xác nhận. Dưới đây là thông tin đăng nhập CV Manager.</p>

      <div style="background:#e8f4ef;border:1px solid #2d9b73;border-radius:10px;padding:16px 18px;margin-bottom:24px">
        <div style="font-size:12px;font-weight:600;color:#1a6b52;text-transform:uppercase;letter-spacing:.5px;margin-bottom:12px">Thông tin đăng nhập</div>
        <div style="font-size:13px;color:#1a1917;line-height:2">
          <div><strong>Email:</strong> ${opts.email}</div>
          <div><strong>Mật khẩu:</strong> <code style="background:#f5f0e8;padding:2px 8px;border-radius:4px;font-size:14px;letter-spacing:1px">${opts.password}</code></div>
        </div>
        <a href="${loginUrl}" style="display:block;margin-top:16px;padding:12px 18px;background:#1a6b52;color:#fff;border-radius:8px;text-decoration:none;font-weight:600;text-align:center;font-size:14px">
          Đăng nhập CV Manager →
        </a>
      </div>

      <div style="background:#fffbeb;border:1px solid #fcd34d;border-radius:8px;padding:12px 14px;margin-bottom:20px;font-size:12.5px;color:#92400e;line-height:1.7">
        <strong>⚠️ Bảo mật:</strong> Hãy đổi mật khẩu sau khi đăng nhập lần đầu tại phần "Tài khoản" trong CV Manager.
      </div>

      <p style="font-size:13px;color:#6b6760;line-height:1.7;margin:0 0 16px">
        Bạn có thể chọn tất cả 5 mẫu CV và cập nhật nội dung bất cứ lúc nào. Link CV của bạn sẵn sàng để gửi cho nhà tuyển dụng sau khi điền thông tin.
      </p>

      <div style="border-top:1px solid #e8e5df;padding-top:16px;font-size:12px;color:#a09d97">
        webdrop.store · ${cfg.smtp_from_email || 'hello@webdrop.store'}
      </div>
    </div>
  </div>
</body>
</html>`

  try {
    await transporter.sendMail({
      from: `"${cfg.smtp_from_name || 'webdrop.store'}" <${cfg.smtp_from_email || cfg.smtp_user}>`,
      to: opts.to,
      subject: `[webdrop.store] Tài khoản CV của bạn — Đơn hàng ${opts.orderCode}`,
      html,
    })
    console.log('[email] Đã gửi CV credentials email tới', opts.to)
  } catch (e) {
    console.error('[email] Lỗi gửi CV credentials email:', e)
  }
}
