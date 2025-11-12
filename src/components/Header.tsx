import logo from '../assets/logo.png'
import {UserIcon} from "../assets/UserIcon.tsx";

function Header() {
  return (
    <header className="app-header">
      <div className="header-left">
        <div className="logo">
          <img src={logo} alt="PulseFit" className="logo-image" />
        </div>
      </div>
      <div className="header-right">
        <div className="user-info desktop-only">
          <div className="user-icon">
            <UserIcon />
          </div>
          <span className="user-name">Austin White</span>
        </div>
        <button className="hamburger-menu mobile-only" aria-label="Menu">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 12H21" stroke="#6A34C0" strokeWidth="2" strokeLinecap="round"/>
            <path d="M3 6H21" stroke="#6A34C0" strokeWidth="2" strokeLinecap="round"/>
            <path d="M3 18H21" stroke="#6A34C0" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </button>
      </div>
    </header>
  )
}

export default Header

