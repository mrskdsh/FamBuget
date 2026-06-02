import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'
import MainComponent from './MainApp'

const supabase = createClient(
  'https://tbbgfpihkhifpvjaqafz.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRiYmdmcGloa2hpZnB2amFxYWZ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAxNjkxNjksImV4cCI6MjA5NTc0NTE2OX0.x27vn2wXm-9wLCrPJowv9JyY6ksCsUafrJ7KzfIFtWI'
)

async function sha256(str) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(str))
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('')
}

export default function App() {
  const [user, setUser] = useState(null)
  const [state, setState] = useState({ done: {}, pinned: {}, custom: [], history: {} })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const savedUser = localStorage.getItem('bgt_user')
    if (savedUser) loadUser(savedUser)
    else setLoading(false)
  }, [])

  async function loadUser(username) {
    try {
      const { data } = await supabase
        .from('budget_state')
        .select('data')
        .eq('user_id', username)
        .single()
      if (data?.data) {
        const parsed = JSON.parse(data.data)
        setState({ done: {}, pinned: {}, custom: [], history: {}, ...parsed })
      }
    } catch {}
    setUser(username)
    setLoading(false)
  }

  async function saveState(newState) {
    if (!user) return
    setState(newState)
    await supabase
      .from('budget_state')
      .update({ data: JSON.stringify(newState) })
      .eq('user_id', user)
  }

  function logout() {
    if (!confirm('Выйти?')) return
    localStorage.removeItem('bgt_user')
    setUser(null)
    setState({ done: {}, pinned: {}, custom: [], history: {} })
  }

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center" style={{background:'#0d0d11'}}>
      <div style={{color:'#c8a96e', fontFamily:'sans-serif', fontSize:18}}>Загрузка...</div>
    </div>
  )

  if (!user) return <Login setUser={setUser} setState={setState} />

  return (
    <Main
      user={user}
      state={state}
      saveState={saveState}
      logout={logout}
    />
  )
}

function Login({ setUser, setState }) {
  const [login, setLogin] = useState('')
  const [pass, setPass] = useState('')
  const [err, setErr] = useState('')

  async function doAuth() {
    if (!login || !pass) { setErr('Заполни все поля'); return }
    setErr('Входим...')
    const hash = await sha256(pass)
    const { data: rows } = await supabase
      .from('budget_state')
      .select('data')
      .eq('user_id', login.trim().toLowerCase())
    
    if (rows && rows.length > 0) {
      let saved = { done: {}, pinned: {}, custom: [], history: {} }
      try { saved = JSON.parse(rows[0].data) } catch {}
      if (saved._pw === hash) {
        localStorage.setItem('bgt_user', login.trim().toLowerCase())
        setState({ done: {}, pinned: {}, custom: [], history: {}, ...saved })
        setUser(login.trim().toLowerCase())
      } else {
        setErr('Неверный пароль')
      }
    } else {
      const newState = { done: {}, pinned: {}, custom: [], history: {}, _pw: hash }
      const { error } = await supabase.from('budget_state').insert({ user_id: login.trim().toLowerCase(), data: JSON.stringify(newState) })
      if (!error) {
        localStorage.setItem('bgt_user', login.trim().toLowerCase())
        setState(newState)
        setUser(login.trim().toLowerCase())
      } else {
        setErr('Ошибка: ' + error.message)
      }
    }
  }

  return (
    <div style={{minHeight:'100vh',background:'#0d0d11',display:'flex',alignItems:'center',justifyContent:'center',padding:20}}>
      <div style={{background:'#1a1a24',border:'1px solid #2e2e42',borderRadius:24,padding:'40px 32px',width:'100%',maxWidth:380,textAlign:'center'}}>
        <div style={{fontFamily:'sans-serif',fontSize:32,marginBottom:6}}>💰</div>
        <div style={{fontFamily:'sans-serif',fontSize:24,fontWeight:700,color:'#c8a96e',marginBottom:6}}>FamBuget</div>
        <div style={{color:'#5a5868',fontSize:13,marginBottom:28}}>Введи логин и пароль · первый вход создаёт аккаунт</div>
        <input
          style={{width:'100%',background:'#14141c',border:'1px solid #2e2e42',borderRadius:12,padding:'13px 16px',color:'#e4e0d8',fontSize:15,marginBottom:10,outline:'none',boxSizing:'border-box'}}
          placeholder="Логин" value={login} onChange={e=>setLogin(e.target.value)}
          onKeyDown={e=>e.key==='Enter'&&doAuth()}
          autoComplete="off"
        />
        <input
          style={{width:'100%',background:'#14141c',border:'1px solid #2e2e42',borderRadius:12,padding:'13px 16px',color:'#e4e0d8',fontSize:15,marginBottom:10,outline:'none',boxSizing:'border-box'}}
          placeholder="Пароль" type="password" value={pass} onChange={e=>setPass(e.target.value)}
          onKeyDown={e=>e.key==='Enter'&&doAuth()}
          autoComplete="new-password"
        />
        <button
          onClick={doAuth}
          style={{width:'100%',padding:14,background:'#c8a96e',border:'none',borderRadius:12,fontWeight:700,fontSize:13,color:'#0d0d11',cursor:'pointer',marginTop:6}}
        >Войти</button>
        <div style={{color:'#e87c6b',fontSize:12,marginTop:10,minHeight:18}}>{err}</div>
      </div>
    </div>
  )
}

function Main({ user, state, saveState, theme, toggleTheme, logout }) {
  return <MainComponent user={user} state={state} saveState={saveState} theme={theme} toggleTheme={toggleTheme} logout={logout} />
}