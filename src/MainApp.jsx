import { useState, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { MONTHS, EXPENSE_ITEMS, FOOD_ITEMS, EXPENSE_CATS, FOOD_CATS, fmt, SAL1, SAL2 } from './data'
import ExpensesSection from './ExpensesSection'
import FoodSection from './FoodSection'

const DARK = {
  bg: '#0d0d11', surface: '#14141c', card: '#1a1a24', card2: '#1f1f2c',
  border: '#252535', border2: '#2e2e42',
  accent: '#c8a96e', accentDim: 'rgba(200,169,110,0.12)',
  blue: '#7c9cf5', red: '#e87c6b', green: '#5cc98a',
  greenDim: 'rgba(92,201,138,0.12)', redDim: 'rgba(232,124,107,0.12)',
  purple: '#a07cf5', teal: '#5cc9c9', text: '#e4e0d8', text2: '#a8a4b8', muted: '#5a5868',
  sal1: '#f5c842', sal2: '#5cc98a',
}

export default function Main({ user, state, saveState, logout }) {
  const C = DARK
  const now = new Date()
  const [cm, setCm] = useState(now.getMonth())
  const [cy, setCy] = useState(now.getFullYear())
  const [section, setSection] = useState('expenses')
  const [showLogout, setShowLogout] = useState(false)
  const [monthDir, setMonthDir] = useState(1)

  function changeMonth(d) {
    setMonthDir(d)
    let m = cm + d, y = cy
    if (m > 11) { m = 0; y++ }
    if (m < 0)  { m = 11; y-- }
    setCm(m); setCy(y)
  }

  function allItems() {
    const customs = (state.custom || []).map(c => ({ ...c, cat: c.cat || 'custom', custom: true }))
    return [...EXPENSE_ITEMS, ...customs]
  }

  function isDone(id) {
    const d = state.done?.[id]
    return !!(d && d.month === cm && d.year === cy)
  }

  function isPinned(id) { return !!(state.pinned?.[id]) }

  function inMonth(item) {
    return item.r || isPinned(item.id) || (item.m && item.m.includes(cm))
  }

  function toggle(id) {
    const newDone = { ...state.done }
    if (newDone[id] && newDone[id].month === cm && newDone[id].year === cy) {
      delete newDone[id]
    } else {
      newDone[id] = { month: cm, year: cy, label: MONTHS[cm] + ' ' + cy }
    }
    saveState({ ...state, done: newDone })
  }

  function togglePin(id) {
    const newPinned = { ...state.pinned }
    if (newPinned[id]) delete newPinned[id]
    else newPinned[id] = true
    saveState({ ...state, pinned: newPinned })
  }

  function deleteCustom(id) {
    if (!confirm('Удалить эту трату?')) return
    const newCustom = (state.custom || []).filter(c => c.id !== id)
    const newPinned = { ...state.pinned }
    const newDone = { ...state.done }
    delete newPinned[id]
    delete newDone[id]
    saveState({ ...state, custom: newCustom, pinned: newPinned, done: newDone })
  }

  function addCustomItem(item) {
    const newCustom = [...(state.custom || []), item]
    const newPinned = { ...state.pinned }
    if (item.r) newPinned[item.id] = true
    saveState({ ...state, custom: newCustom, pinned: newPinned })
  }

  const ai = allItems()
  const monthItems = ai.filter(inMonth)
  const expTotal = monthItems.reduce((s, i) => s + i.p, 0)
  const vikaTotal = monthItems.filter(i => i.w === 'vika').reduce((s, i) => s + i.p, 0)
  const ilyaTotal = monthItems.filter(i => i.w === 'ilya').reduce((s, i) => s + i.p, 0)
  const sharedTotal = monthItems.filter(i => i.w === 'shared').reduce((s, i) => s + i.p, 0)
  const doneItems = monthItems.filter(i => isDone(i.id))
  const pct = monthItems.length ? Math.round(doneItems.length / monthItems.length * 100) : 0
  const sal1Remain = Math.round(SAL1 - expTotal * (SAL1 / (SAL1 + SAL2)))
  const sal2Remain = Math.round(SAL2 - expTotal * (SAL2 / (SAL1 + SAL2)))

  const foodWeekly = FOOD_ITEMS.filter(i => i.wk?.length > 0)
  const foodTotal = FOOD_ITEMS.reduce((s, i) => s + i.p, 0)
  const foodDone = FOOD_ITEMS.filter(i => {
    const d = state.done?.['f_' + i.id]
    return !!(d && d.month === cm && d.year === cy)
  })
  const foodPct = FOOD_ITEMS.length ? Math.round(foodDone.length / FOOD_ITEMS.length * 100) : 0

  function toggleFood(id) {
    const key = 'f_' + id
    const newDone = { ...state.done }
    if (newDone[key] && newDone[key].month === cm && newDone[key].year === cy) {
      delete newDone[key]
    } else {
      newDone[key] = { month: cm, year: cy, label: MONTHS[cm] + ' ' + cy }
    }
    saveState({ ...state, done: newDone })
  }

  function isFoodDone(id) {
    const d = state.done?.['f_' + id]
    return !!(d && d.month === cm && d.year === cy)
  }

  return (
    <div style={{ minHeight: '100vh', background: C.bg, color: C.text, fontFamily: "'Golos Text', system-ui, sans-serif", paddingBottom: 80, transition: 'background .2s' }}>

      {/* TOPBAR */}
      <div style={{
        position: 'sticky', top: 0, zIndex: 60,
        background: C.surface, borderBottom: `1px solid ${C.border}`,
        padding: '0 16px', height: 52,
        display: 'flex', alignItems: 'center', gap: 8,
      }}>
        {/* Left side - logo */}
        <div style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
          <div style={{ fontWeight: 700, color: C.accent, fontSize: 13, cursor: 'pointer', userSelect: 'none' }}
            onClick={() => setShowLogout(true)}>
            💰 FamBuget
          </div>
        </div>

        {/* Section switcher - CENTER */}
        <div style={{
          display: 'flex', background: C.card, border: `1px solid ${C.border2}`,
          borderRadius: 12, padding: 4, gap: 3, flexShrink: 0,
        }}>
          {['expenses', 'food'].map(s => (
            <button key={s} onClick={() => setSection(s)} style={{
              padding: '5px 14px', borderRadius: 9, border: 'none',
              fontWeight: 600, fontSize: 11, cursor: 'pointer',
              background: section === s ? C.card2 : 'transparent',
              color: section === s ? (s === 'food' ? C.green : C.accent) : C.muted,
              transition: 'all .15s',
            }}>
              {s === 'expenses' ? 'Траты' : 'Еда'}
            </button>
          ))}
        </div>

        {/* Right side */}
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 8 }}>

        {/* Month nav */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, flexShrink: 0 }}>
          <button onClick={() => changeMonth(-1)} style={{...navBtnStyle, background: C.card, border: `1px solid ${C.border2}`, color: C.text2}}>‹</button>
          <div style={{ fontSize: 11, fontWeight: 700, minWidth: 68, textAlign: 'center', color: C.text, whiteSpace: 'nowrap', overflow: 'hidden', position: 'relative', height: 20 }}>
            <AnimatePresence mode="wait" custom={monthDir}>
              <motion.span
                key={cm + '-' + cy}
                custom={monthDir}
                initial={{ y: monthDir > 0 ? 16 : -16, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: monthDir > 0 ? -16 : 16, opacity: 0 }}
                transition={{ duration: 0.18, ease: 'easeOut' }}
                style={{ position: 'absolute', width: '100%', left: 0 }}
              >
                {MONTHS[cm].slice(0, 3)} {String(cy).slice(2)}
              </motion.span>
            </AnimatePresence>
          </div>
          <button onClick={() => changeMonth(1)} style={{...navBtnStyle, background: C.card, border: `1px solid ${C.border2}`, color: C.text2}}>›</button>
        </div>

        {/* Logout - desktop only */}
        <button onClick={() => setShowLogout(true)} className="logout-desktop" style={{
          background: C.surface, border: `1px solid ${C.border2}`,
          borderRadius: 7, color: C.muted, fontSize: 10,
          padding: '3px 8px', cursor: 'pointer', flexShrink: 0,
        }}>
          Выйти
        </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {section === 'expenses' ? (
          <motion.div key="expenses"
            initial={{ opacity: 0, x: -24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 24 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
          >
            <ExpensesSection
              cm={cm} cy={cy}
              allItems={ai}
              monthItems={monthItems}
              expTotal={expTotal}
              vikaTotal={vikaTotal}
              ilyaTotal={ilyaTotal}
              sharedTotal={sharedTotal}
              doneCount={doneItems.length}
              pct={pct}
              sal1Remain={sal1Remain}
              sal2Remain={sal2Remain}
              isDone={isDone}
              isPinned={isPinned}
              toggle={toggle}
              togglePin={togglePin}
              deleteCustom={deleteCustom}
              addCustomItem={addCustomItem}
              state={state}
            />
          </motion.div>
        ) : (
          <motion.div key="food"
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
          >
            <FoodSection
              cm={cm} cy={cy}
              foodTotal={foodTotal}
              foodDoneCount={foodDone.length}
              foodPct={foodPct}
              isFoodDone={isFoodDone}
              toggleFood={toggleFood}
              state={state}
              expTotal={expTotal}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Custom logout dialog */}
      <AnimatePresence>
        {showLogout && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowLogout(false)}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}
          >
            <motion.div
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.85, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              onClick={e => e.stopPropagation()}
              style={{ background: '#1a1a24', border: '1px solid #2e2e42', borderRadius: 20, padding: '28px 24px', width: '100%', maxWidth: 320, textAlign: 'center' }}
            >
              <div style={{ fontSize: 36, marginBottom: 12 }}>👋</div>
              <div style={{ fontWeight: 700, fontSize: 17, color: '#e4e0d8', marginBottom: 8 }}>Выходишь?</div>
              <div style={{ fontSize: 13, color: '#5a5868', marginBottom: 24 }}>Данные сохранены, вернёмся когда нужно</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <button onClick={() => setShowLogout(false)} style={{ padding: '11px', background: '#252535', border: '1px solid #2e2e42', borderRadius: 12, color: '#a8a4b8', fontWeight: 600, fontSize: 13, cursor: 'pointer' }}>
                  Остаться
                </button>
                <button onClick={() => { setShowLogout(false); logout() }} style={{ padding: '11px', background: '#e87c6b', border: 'none', borderRadius: 12, color: 'white', fontWeight: 700, fontSize: 13, cursor: 'pointer' }}>
                  Выйти
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @media(max-width:430px){
          .logout-desktop { display: none !important; }
        }
        @media(max-width:380px){
          .month-label { font-size: 10px !important; min-width: 60px !important; }
        }
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { display: none; }
        body { margin: 0; background: ${C.bg}; }
      `}</style>
    </div>
  )
}

const navBtnStyle = {
  background: '#1a1a24', border: '1px solid #2e2e42',
  borderRadius: 7, color: '#a8a4b8', width: 26, height: 26,
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  cursor: 'pointer', fontSize: 13,
}
