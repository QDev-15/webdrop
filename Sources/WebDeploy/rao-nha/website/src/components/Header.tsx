import { useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { useSite } from '../contexts/SiteContext'
import { useAccount } from '../contexts/AccountContext'

export default function Header() {
  const [open, setOpen] = useState(false)
  const { settings } = useSite()
  const { account } = useAccount()
  const location = useLocation()

  const phone = settings.site_phone || '1900 6789'
  const needParam = new URLSearchParams(location.search).get('nhu-cau')
  const isPropertiesPage = location.pathname === '/bat-dong-san'

  const close = () => setOpen(false)

  const AccountLink = ({ mobile }: { mobile?: boolean }) => account ? (
    <Link to="/tai-khoan" className={mobile ? 'rn-nav-mob-account' : 'rn-nav-account'} onClick={close}>
      {mobile ? '👤 Tài khoản của tôi · ' : '👤 '}
      {mobile ? `${account.credit_balance.toLocaleString('vi-VN')}đ` : (
        <>{account.name.split(' ').slice(-1)[0]} · <strong>{account.credit_balance.toLocaleString('vi-VN')}đ</strong></>
      )}
    </Link>
  ) : (
    <Link to="/dang-nhap" className={mobile ? 'rn-nav-mob-account' : 'rn-nav-account'} onClick={close}>
      {mobile ? 'Đăng nhập / Đăng ký' : 'Đăng nhập'}
    </Link>
  )

  return (
    <nav id="nav">
      <div className="rn-container rn-nav-inner">
        <Link to="/" className="rn-logo">Rao<span>Nhà</span></Link>
        <div className="rn-nav-links">
          <NavLink to="/" end className={({ isActive }) => isActive ? 'active' : ''}>Trang chủ</NavLink>
          <NavLink to="/bat-dong-san?nhu-cau=ban" className={isPropertiesPage && needParam === 'ban' ? 'active' : ''}>Nhà đất bán</NavLink>
          <NavLink to="/bat-dong-san?nhu-cau=cho-thue" className={isPropertiesPage && needParam === 'cho-thue' ? 'active' : ''}>Nhà đất cho thuê</NavLink>
          <NavLink to="/tin-tuc" className={({ isActive }) => isActive ? 'active' : ''}>Tin tức</NavLink>
        </div>
        <div className="rn-nav-right">
          <span className="rn-nav-phone">📞 {phone}</span>
          <AccountLink />
          <Link to="/dang-tin" className="rn-nav-cta">+ Đăng tin</Link>
        </div>
        <button className={'rn-burger' + (open ? ' open' : '')} aria-label="Menu" onClick={() => setOpen(o => !o)}>
          <span></span><span></span><span></span>
        </button>
      </div>
      <div className={'rn-nav-mob' + (open ? ' open' : '')} id="navMob">
        <div className="rn-nav-mob-inner">
          <Link to="/" onClick={close}>Trang chủ</Link>
          <Link to="/bat-dong-san?nhu-cau=ban" onClick={close}>Nhà đất bán</Link>
          <Link to="/bat-dong-san?nhu-cau=cho-thue" onClick={close}>Nhà đất cho thuê</Link>
          <Link to="/tin-tuc" onClick={close}>Tin tức</Link>
          <Link to="/ve-chung-toi" onClick={close}>Giới thiệu</Link>
          <Link to="/lien-he" onClick={close}>Liên hệ</Link>
          <AccountLink mobile />
          <Link to="/dang-tin" className="rn-nav-cta" onClick={close}>+ Đăng tin</Link>
          <div className="rn-nav-mob-phone">📞 Hotline: {phone}</div>
        </div>
      </div>
    </nav>
  )
}
