import { useEffect, useRef, useState } from 'react'
import { navigation } from '../navigation'
import './NavBar.css'

export default function NavBar({ activePage }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const toggleRef = useRef(null)

  useEffect(() => {
    if (!menuOpen) return
    const closeOnEscape = (event) => {
      if (event.key === 'Escape') {
        setMenuOpen(false)
        toggleRef.current?.focus()
      }
    }
    document.addEventListener('keydown', closeOnEscape)
    return () => document.removeEventListener('keydown', closeOnEscape)
  }, [menuOpen])

  return (
    <header className="site-header">
      <div className="navbar">
        <a className="brand" href="#overview" aria-label="Northstar overview" onClick={() => setMenuOpen(false)}>
          <svg className="brand-mark" viewBox="0 0 32 32" fill="none" aria-hidden="true">
            <path d="M16 1 20 12 31 16 20 20 16 31 12 20 1 16 12 12Z" fill="currentColor" />
            <path d="m16 10 2 4 4 2-4 2-2 4-2-4-4-2 4-2Z" fill="var(--surface)" />
          </svg>
          <span>northstar<span className="brand-dot">.</span></span>
        </a>
        <button
          ref={toggleRef}
          className="menu-toggle"
          type="button"
          aria-controls="primary-navigation"
          aria-expanded={menuOpen}
          aria-label={menuOpen ? 'Close navigation' : 'Open navigation'}
          onClick={() => setMenuOpen((open) => !open)}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" aria-hidden="true">
            {menuOpen ? <path d="m6 6 12 12M6 18 18 6" /> : <path d="M4 6h16M4 12h16M4 18h16" />}
          </svg>
        </button>
        <nav id="primary-navigation" className={`primary-navigation${menuOpen ? ' is-open' : ''}`} aria-label="Main navigation">
          <ul>
            {navigation.map((item) => (
              <li key={item.id}>
                <a href={`#${item.id}`} aria-current={activePage === item.id ? 'page' : undefined} onClick={() => setMenuOpen(false)}>
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <span className="navbar-caption">A clearer way forward</span>
      </div>
    </header>
  )
}
