import { useEffect, useState } from 'react'
import NavBar from './components/NavBar'
import { navigation } from './navigation'
import './App.css'

function currentPage() {
  return navigation.find((item) => item.id === window.location.hash.slice(1)) ?? navigation[0]
}

export default function App() {
  const [page, setPage] = useState(currentPage)

  useEffect(() => {
    const updatePage = () => {
      const destination = navigation.find((item) => item.id === window.location.hash.slice(1))
      if (destination) setPage(destination)
    }
    window.addEventListener('hashchange', updatePage)
    return () => window.removeEventListener('hashchange', updatePage)
  }, [])

  return (
    <>
      <a className="skip-link" href="#main-content">Skip to content</a>
      <NavBar activePage={page.id} />
      <main id="main-content" className="page" tabIndex={-1}>
        <p className="eyebrow">YOUR MONEY, WITH DIRECTION</p>
        <h1>{page.label}</h1>
        <p className="page-description">{page.description}</p>
      </main>
    </>
  )
}
