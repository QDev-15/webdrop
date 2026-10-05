'use client'

import { useEffect, useState } from 'react'

type Lang = 'vi' | 'en'

const STORAGE_KEY = 'docscanner-privacy-lang'

export default function DocScannerPrivacyPolicyPage() {
  const [lang, setLang] = useState<Lang>('vi')

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY)
      if (saved === 'vi' || saved === 'en') setLang(saved)
    } catch { /* ignore */ }
  }, [])

  function selectLang(next: Lang) {
    setLang(next)
    try { window.localStorage.setItem(STORAGE_KEY, next) } catch { /* ignore */ }
  }

  return (
    <>
      <title>{lang === 'vi' ? 'Doc Scanner — Chính sách quyền riêng tư' : 'Doc Scanner — Privacy Policy'}</title>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link
        href="https://fonts.googleapis.com/css2?family=Source+Serif+4:opsz,wght@8..60,400;8..60,600;8..60,700&family=IBM+Plex+Sans:wght@400;500;600&display=swap"
        rel="stylesheet"
      />
      <style>{CSS}</style>

      <div className="ds-privacy">
        <div className="page">
          <header className="top">
            <div className="mark" aria-hidden="true">
              <svg viewBox="0 0 40 40" fill="none">
                <path
                  d="M11 11h6M11 11v6M29 11h-6M29 11v6M11 29h6M11 29v-6M29 29h-6M29 29v-6"
                  stroke="#fff"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                />
                <rect x="16" y="19" width="8" height="1.6" rx="0.8" fill="#5CF2B8" />
              </svg>
            </div>
            <div className="identity">
              <div className="app-name">Doc Scanner</div>
              <div className="pkg">btk.docscanner · Android</div>
            </div>
          </header>

          <h1>{lang === 'vi' ? 'Chính sách quyền riêng tư' : 'Privacy Policy'}</h1>
          <p className="updated">
            {lang === 'vi' ? 'Cập nhật lần cuối: 05/10/2026' : 'Last updated: October 5, 2026'}
          </p>

          <div className="lang-switch" role="group" aria-label="Language">
            <button type="button" className={lang === 'vi' ? 'active' : ''} onClick={() => selectLang('vi')}>
              Tiếng Việt
            </button>
            <button type="button" className={lang === 'en' ? 'active' : ''} onClick={() => selectLang('en')}>
              English
            </button>
          </div>

          {lang === 'vi' ? <ViContent /> : <EnContent />}

          <footer>
            <p>
              Doc Scanner · <span className="contact">nguyenquynhvp.ictu@gmail.com</span>
            </p>
          </footer>
        </div>
      </div>
    </>
  )
}

function ViContent() {
  return (
    <section className="lang">
      <div className="summary">
        <strong>Tóm tắt:</strong> Doc Scanner lưu toàn bộ ảnh, tài liệu và PDF bạn quét{' '}
        <strong>ngay trên điện thoại</strong>. Chúng tôi không có máy chủ riêng và không tải tài liệu của bạn lên bất
        kỳ đâu. Dữ liệu duy nhất rời khỏi máy là thông tin kỹ thuật mà Google thu thập qua quảng cáo (AdMob), thanh
        toán (Play Billing) và kiểm tra bản cập nhật (Play Core) — ba dịch vụ của Google mà ứng dụng sử dụng.
      </div>

      <h2>1. Ứng dụng và nhà phát triển</h2>
      <p>
        Chính sách này áp dụng cho ứng dụng <strong>Doc Scanner</strong> (mã gói <code>btk.docscanner</code>) trên
        Android, do <strong>Nguyễn Hữu Quỳnh</strong> phát triển và phát hành độc lập trên Google Play.
      </p>

      <h2>2. Tài liệu, ảnh và dữ liệu bạn tạo ra</h2>
      <p>
        Ảnh chụp, tài liệu đã quét, file PDF và chữ ký bạn tạo trong Doc Scanner được lưu{' '}
        <strong>hoàn toàn trên bộ nhớ thiết bị</strong>. Ứng dụng không tự động tải lên, sao lưu hay gửi các tệp này
        tới bất kỳ máy chủ nào.
      </p>
      <p>Các tệp này chỉ rời khỏi máy khi chính bạn chủ động thực hiện, ví dụ:</p>
      <ul>
        <li>
          Dùng chức năng <strong>Chia sẻ</strong> (Share) để gửi qua email, Zalo, hoặc ứng dụng khác;
        </li>
        <li>
          Lưu PDF vào thư mục <strong>Tải về/DocScanner</strong> — đây là thư mục công khai trên máy, do hệ điều hành
          Android quản lý.
        </li>
      </ul>
      <p>
        Khi bạn gỡ cài đặt ứng dụng, dữ liệu riêng của ứng dụng (danh sách tài liệu, thư mục trong app) sẽ bị xoá theo
        cơ chế của Android. Các file PDF đã lưu vào thư mục Tải về không bị ảnh hưởng.
      </p>

      <h2>3. Quyền truy cập máy ảnh (Camera)</h2>
      <p>
        Doc Scanner xin quyền <strong>Camera</strong> chỉ để bạn chụp tài liệu ngay trong ứng dụng. Hình ảnh chụp được
        xử lý và lưu cục bộ như mô tả ở Mục 2 — không được truyền đi hay chia sẻ với bên thứ ba dưới bất kỳ hình thức
        nào khác.
      </p>

      <h2>4. Dữ liệu qua các dịch vụ của Google</h2>
      <p>
        Ứng dụng sử dụng ba dịch vụ của Google LLC. Đây là nơi duy nhất dữ liệu kỹ thuật (không phải tài liệu của bạn)
        có thể rời khỏi máy:
      </p>
      <table>
        <caption className="muted">Các dịch vụ bên thứ ba và dữ liệu liên quan</caption>
        <thead>
          <tr>
            <th>Dịch vụ</th>
            <th>Mục đích</th>
            <th>Dữ liệu liên quan</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Google AdMob</td>
            <td>Hiển thị quảng cáo trong bản miễn phí</td>
            <td>
              Advertising ID, dữ liệu tương tác quảng cáo. Với người dùng ở EEA/Anh, hộp thoại xin sự đồng ý (Google
              UMP) hiện ra trước khi cá nhân hoá quảng cáo.
            </td>
          </tr>
          <tr>
            <td>Google Play Billing</td>
            <td>Xử lý giao dịch mua gói Pro (một lần, không phải gói thuê bao)</td>
            <td>
              Trạng thái giao dịch mua hàng. Ứng dụng không thu thập hay lưu trữ thông tin thẻ/thanh toán của bạn —
              toàn bộ do Google Play xử lý.
            </td>
          </tr>
          <tr>
            <td>Google Play Core (In-app Update)</td>
            <td>Kiểm tra xem có bản cập nhật mới trên Play không</td>
            <td>
              Không có máy chủ riêng của ứng dụng tham gia — việc kiểm tra và tải bản cập nhật hoàn toàn qua hạ tầng
              của Google Play.
            </td>
          </tr>
        </tbody>
      </table>
      <p>
        Tìm hiểu thêm về cách Google xử lý dữ liệu tại{' '}
        <a href="https://policies.google.com/privacy" target="_blank" rel="noopener">
          Chính sách quyền riêng tư của Google
        </a>{' '}
        và{' '}
        <a href="https://policies.google.com/technologies/ads" target="_blank" rel="noopener">
          cách Google dùng dữ liệu cho quảng cáo
        </a>
        .
      </p>

      <h2>5. Chia sẻ dữ liệu</h2>
      <p>
        Chúng tôi không bán và không chia sẻ dữ liệu của bạn cho bất kỳ bên thứ ba nào ngoài ba dịch vụ Google nêu ở
        Mục 4. Không có công ty, đối tác quảng cáo, hay đơn vị phân tích nào khác được tích hợp trong ứng dụng.
      </p>

      <h2>6. Trẻ em</h2>
      <p>Doc Scanner không hướng đến trẻ em dưới 13 tuổi và không cố ý thu thập dữ liệu từ trẻ em.</p>

      <h2>7. Bảo mật</h2>
      <p>
        Tài liệu của bạn được bảo vệ bởi cơ chế hộp cát (sandbox) của Android — mỗi ứng dụng chỉ có thể truy cập vùng
        dữ liệu riêng của nó, các ứng dụng khác không thể đọc trực tiếp dữ liệu của Doc Scanner.
      </p>

      <h2>8. Quyền của bạn</h2>
      <p>
        Vì không có tài khoản hay máy chủ nào lưu dữ liệu của bạn, bạn có toàn quyền kiểm soát: xoá từng tài liệu ngay
        trong ứng dụng, hoặc gỡ cài đặt ứng dụng để xoá toàn bộ dữ liệu riêng của ứng dụng khỏi máy bất cứ lúc nào.
      </p>

      <h2>9. Thay đổi chính sách</h2>
      <p>Chính sách này có thể được cập nhật khi ứng dụng có thay đổi. Ngày cập nhật gần nhất luôn hiển thị ở đầu trang.</p>

      <h2>10. Liên hệ</h2>
      <p>
        Mọi câu hỏi về quyền riêng tư, vui lòng liên hệ:{' '}
        <a href="mailto:nguyenquynhvp.ictu@gmail.com">nguyenquynhvp.ictu@gmail.com</a>
      </p>
    </section>
  )
}

function EnContent() {
  return (
    <section className="lang">
      <div className="summary">
        <strong>Summary:</strong> Doc Scanner stores every photo, scanned document and PDF{' '}
        <strong>on your phone only</strong>. There is no server of our own, and your documents are never uploaded
        anywhere by the app. The only data that leaves the device is technical data collected by Google through ads
        (AdMob), purchases (Play Billing) and update checks (Play Core) — the three Google services the app uses.
      </div>

      <h2>1. App and developer</h2>
      <p>
        This policy applies to the Android app <strong>Doc Scanner</strong> (package id{' '}
        <code>btk.docscanner</code>), developed and published independently on Google Play by{' '}
        <strong>Nguyễn Hữu Quỳnh</strong>.
      </p>

      <h2>2. Documents, photos and data you create</h2>
      <p>
        Photos, scanned documents, PDF files and signatures you create in Doc Scanner are stored{' '}
        <strong>entirely on your device&apos;s storage</strong>. The app never automatically uploads, backs up or
        transmits these files to any server.
      </p>
      <p>These files only leave your device when you take an explicit action, such as:</p>
      <ul>
        <li>
          Using the <strong>Share</strong> feature to send a file by email, messaging apps, or another app;
        </li>
        <li>
          Saving a PDF to the <strong>Downloads/DocScanner</strong> folder — a public folder managed by the Android
          operating system itself.
        </li>
      </ul>
      <p>
        Uninstalling the app removes the app&apos;s own private data (your in-app document list and folders)
        following standard Android behavior. PDFs already saved to the Downloads folder are not affected.
      </p>

      <h2>3. Camera permission</h2>
      <p>
        Doc Scanner requests the <strong>Camera</strong> permission solely so you can photograph documents inside the
        app. Captured images are processed and stored locally as described in Section 2 — they are not transmitted
        to or shared with any third party in any other way.
      </p>

      <h2>4. Data via Google services</h2>
      <p>
        The app uses three services from Google LLC. This is the only place technical data (not your documents) may
        leave your device:
      </p>
      <table>
        <caption className="muted">Third-party services and related data</caption>
        <thead>
          <tr>
            <th>Service</th>
            <th>Purpose</th>
            <th>Related data</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Google AdMob</td>
            <td>Shows ads in the free tier</td>
            <td>
              Advertising ID and ad-interaction data. Users in the EEA/UK see a consent prompt (Google&apos;s User
              Messaging Platform) before any ad personalization.
            </td>
          </tr>
          <tr>
            <td>Google Play Billing</td>
            <td>Processes the one-time &quot;Pro&quot; upgrade purchase (not a subscription)</td>
            <td>
              Purchase/transaction status. The app never collects or stores your payment or card details — Google
              Play handles the entire transaction.
            </td>
          </tr>
          <tr>
            <td>Google Play Core (In-app Update)</td>
            <td>Checks whether a newer version is available on Play</td>
            <td>
              No server of our own is involved — checking for and downloading updates happens entirely through
              Google Play&apos;s own infrastructure.
            </td>
          </tr>
        </tbody>
      </table>
      <p>
        Learn more in{' '}
        <a href="https://policies.google.com/privacy" target="_blank" rel="noopener">
          Google&apos;s Privacy Policy
        </a>{' '}
        and{' '}
        <a href="https://policies.google.com/technologies/ads" target="_blank" rel="noopener">
          how Google uses data for advertising
        </a>
        .
      </p>

      <h2>5. Data sharing</h2>
      <p>
        We do not sell and do not share your data with any third party beyond the three Google services listed in
        Section 4. No other company, ad partner, or analytics provider is integrated into this app.
      </p>

      <h2>6. Children</h2>
      <p>Doc Scanner is not directed at children under 13 and does not knowingly collect data from children.</p>

      <h2>7. Security</h2>
      <p>
        Your documents are protected by Android&apos;s own app sandbox — each app can only access its own private
        storage area, so other apps cannot directly read Doc Scanner&apos;s data.
      </p>

      <h2>8. Your choices</h2>
      <p>
        Because no account or server stores your data, you remain in full control: delete individual documents
        inside the app, or uninstall the app at any time to remove all of the app&apos;s own data from your device.
      </p>

      <h2>9. Changes to this policy</h2>
      <p>This policy may be updated as the app changes. The most recent update date is always shown at the top of this page.</p>

      <h2>10. Contact</h2>
      <p>
        For any privacy questions, please contact:{' '}
        <a href="mailto:nguyenquynhvp.ictu@gmail.com">nguyenquynhvp.ictu@gmail.com</a>
      </p>
    </section>
  )
}

const CSS = `
.ds-privacy {
  --dsp-bg: #FAFAFC;
  --dsp-surface: #FFFFFF;
  --dsp-text: #1C1B29;
  --dsp-text-muted: #5B5873;
  --dsp-accent: #5B4FE0;
  --dsp-accent-soft: #EDEBFC;
  --dsp-border: #E4E1F5;
  background: var(--dsp-bg);
  color: var(--dsp-text);
  font-family: 'IBM Plex Sans', system-ui, sans-serif;
  font-size: 15px;
  line-height: 1.65;
  padding: 48px 20px;
  min-height: 100vh;
}
@media (prefers-color-scheme: dark) {
  .ds-privacy {
    --dsp-bg: #15131F;
    --dsp-surface: #1E1C2C;
    --dsp-text: #EDEBFA;
    --dsp-text-muted: #A8A4C4;
    --dsp-accent: #8A7FF0;
    --dsp-accent-soft: #2A2743;
    --dsp-border: #322F49;
  }
}
.ds-privacy .page { max-width: 680px; margin: 0 auto; }
.ds-privacy header.top { display: flex; align-items: center; gap: 14px; margin-bottom: 8px; }
.ds-privacy .mark { flex: none; width: 40px; height: 40px; border-radius: 10px; background: linear-gradient(135deg, var(--dsp-accent), #8A7FF0 60%, #3A2F99); }
.ds-privacy .mark svg { width: 40px; height: 40px; display: block; }
.ds-privacy .identity { min-width: 0; }
.ds-privacy .identity .app-name { font-family: 'Source Serif 4', Georgia, serif; font-weight: 700; font-size: 19px; letter-spacing: -0.01em; }
.ds-privacy .identity .pkg { font-size: 12.5px; color: var(--dsp-text-muted); font-variant-numeric: tabular-nums; }
.ds-privacy h1 { font-family: 'Source Serif 4', Georgia, serif; font-weight: 700; font-size: clamp(28px, 6vw, 38px); line-height: 1.15; letter-spacing: -0.01em; text-wrap: balance; margin: 28px 0 6px; }
.ds-privacy .updated { color: var(--dsp-text-muted); font-size: 13px; margin-bottom: 26px; }
.ds-privacy .lang-switch { display: inline-flex; border: 1px solid var(--dsp-border); border-radius: 999px; padding: 3px; background: var(--dsp-surface); margin-bottom: 36px; }
.ds-privacy .lang-switch button { appearance: none; border: none; background: transparent; color: var(--dsp-text-muted); font: inherit; font-size: 13px; font-weight: 600; padding: 7px 16px; border-radius: 999px; cursor: pointer; }
.ds-privacy .lang-switch button.active { background: var(--dsp-accent); color: #fff; }
.ds-privacy .summary { background: var(--dsp-accent-soft); border: 1px solid var(--dsp-border); border-radius: 14px; padding: 18px 20px; margin-bottom: 32px; font-size: 14px; color: var(--dsp-text); }
.ds-privacy .summary strong { color: var(--dsp-accent); }
.ds-privacy h2 { font-family: 'Source Serif 4', Georgia, serif; font-weight: 600; font-size: 20px; margin: 34px 0 10px; padding-top: 18px; border-top: 1px solid var(--dsp-border); }
.ds-privacy section.lang > h2:first-of-type { border-top: none; padding-top: 0; }
.ds-privacy p { margin: 0 0 12px; color: var(--dsp-text); max-width: 65ch; }
.ds-privacy .muted { color: var(--dsp-text-muted); }
.ds-privacy ul { margin: 0 0 12px; padding-left: 20px; }
.ds-privacy li { margin-bottom: 6px; max-width: 62ch; }
.ds-privacy table { width: 100%; border-collapse: collapse; margin: 14px 0 18px; font-size: 13.5px; }
.ds-privacy caption { caption-side: top; text-align: left; margin-bottom: 6px; }
.ds-privacy th, .ds-privacy td { text-align: left; padding: 9px 10px; border-bottom: 1px solid var(--dsp-border); vertical-align: top; }
.ds-privacy th { color: var(--dsp-text-muted); font-weight: 600; font-size: 12px; text-transform: uppercase; letter-spacing: 0.03em; }
.ds-privacy a { color: var(--dsp-accent); text-decoration-color: var(--dsp-border); }
.ds-privacy a:hover { text-decoration-thickness: 2px; }
.ds-privacy code { font-size: 0.9em; background: var(--dsp-accent-soft); padding: 1px 6px; border-radius: 5px; }
.ds-privacy footer { margin-top: 44px; padding-top: 22px; border-top: 1px solid var(--dsp-border); font-size: 13px; color: var(--dsp-text-muted); }
.ds-privacy footer .contact { color: var(--dsp-text); font-weight: 500; }
@media (max-width: 420px) {
  .ds-privacy .identity .app-name { font-size: 17px; }
}
`
