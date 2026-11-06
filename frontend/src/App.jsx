import { useEffect, useState } from 'react'
import NavBar from './components/NavBar'
import { Auth, Landing, Onboarding } from './components/Welcome'
import { formatMoney } from './formatMoney'
import { navigation } from './navigation'
import './App.css'

function readSession() {
  try { return JSON.parse(sessionStorage.getItem('northstar-preview')) || null } catch { return null }
}
const getRoute = () => window.location.hash.slice(1) || 'home'
export default function App() {
  const [route, setRoute] = useState(getRoute)
  const [session, setSession] = useState(readSession)
  const [newProfile, setNewProfile] = useState(null)
  useEffect(() => {
    const update = () => { const next = getRoute(); setRoute(next); if (next !== 'how-it-works') window.scrollTo(0, 0) }
    window.addEventListener('hashchange', update)
    return () => window.removeEventListener('hashchange', update)
  }, [])
  const dashboardPage = navigation.find(item => item.id === route)
  useEffect(() => {
    if (dashboardPage && !session) window.location.hash = 'login'
    else if (route === 'onboarding' && !newProfile) window.location.hash = session ? 'overview' : 'signup'
    else if (session && ['home', 'login', 'signup'].includes(route)) window.location.hash = 'overview'
  }, [route, session, newProfile, dashboardPage])
  function enter(profile, setup = null) {
    const next = { profile, setup }
    setSession(next)
    try { sessionStorage.setItem('northstar-preview', JSON.stringify(next)) } catch { /* Preview still works when storage is unavailable. */ }
    setNewProfile(null)
    window.location.hash = 'overview'
  }
  function logout() {
    try { sessionStorage.removeItem('northstar-preview') } catch { /* In-memory sign-out remains available. */ }
    setSession(null)
    setRoute('home')
    window.location.hash = 'home'
  }
  let content
  if (dashboardPage && session) content = <><NavBar activePage={dashboardPage.id} onLogout={logout} /><main id="main-content" className="page" tabIndex={-1}><p className="eyebrow">YOUR MONEY, WITH DIRECTION</p><h1>{dashboardPage.label}</h1><p className="page-description">{dashboardPage.description}</p>{route === 'overview' && <div className="overview-content"><div className="welcome-banner"><div><p className="eyebrow">YOUR NEXT CHAPTER</p><h2>{session.profile.name === 'Welcome back' ? 'Welcome back.' : `Welcome, ${session.profile.name.split(' ')[0]}.`}</h2><p>{session.setup ? `Your starting direction: ${session.setup.goal.toLowerCase()}.` : 'A little intention today. A little more possibility tomorrow.'}</p></div><span aria-hidden="true">✦</span></div>{session.setup ? <><div className="overview-stats">{[['Monthly income', session.setup.income.monthly], ['Recurring commitments', session.setup.monthlyBills], ['Before everyday spending', session.setup.income.monthly - session.setup.monthlyBills]].map(([label, value]) => <article key={label}><p>{label}</p><h2>{formatMoney(value)}</h2></article>)}</div><div className="overview-bills"><h2>Your recurring commitments</h2>{session.setup.expenses.length ? session.setup.expenses.map(item => <div key={item.id}><span>{item.name}</span><span>{formatMoney(item.amount)} <small>/ {item.frequency.toLowerCase()}</small></span></div>) : <p>No recurring expenses added yet.</p>}</div></> : <a className="button" href="#onboarding" onClick={() => setNewProfile(session.profile)}>Set up my financial picture →</a>}<p className="privacy-note">Frontend preview · No bank accounts are connected.</p></div>}</main></>
  else if (route === 'onboarding' && newProfile) content = <Onboarding profile={newProfile} onComplete={setup => enter(newProfile, setup)} />
  else if (['login', 'signup'].includes(route)) content = <Auth key={route} mode={route} onLogin={enter} onSignup={profile => { setNewProfile(profile); window.location.hash = 'onboarding' }} />
  else content = <Landing />
  return <><a className="skip-link" href="#main-content" onClick={event => { event.preventDefault(); document.getElementById('main-content')?.focus(); document.getElementById('main-content')?.scrollIntoView() }}>Skip to content</a>{content}</>
}
