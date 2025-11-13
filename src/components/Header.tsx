import logo from '../assets/logo.png'
import {UserIcon} from "./svg/UserIcon.tsx";
import {HamburgerMenu} from "./svg/HamburgerMenu.tsx";
import {ChevronDown} from "./svg/ChevronDown.tsx";

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
          <ChevronDown />
        </div>
        <button className="hamburger-menu mobile-only" aria-label="Menu">
          <HamburgerMenu />
        </button>
      </div>
    </header>
  )
}

export default Header

