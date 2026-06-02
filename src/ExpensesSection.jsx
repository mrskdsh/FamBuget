import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { EXPENSE_CATS, MONTHS, MONTHS_SHORT, fmt, SAL1, SAL2 } from './data'

const C = {
  bg: '#0d0d11', surface: '#14141c', card: '#1a1a24', card2: '#1f1f2c',
  border: '#252535', border2: '#2e2e42',
  accent: '#c8a96e', accentDim: 'rgba(200,169,110,0.12)',
  blue: '#7c9cf5', red: '#e87c6b', green: '#5cc98a',
  greenDim: 'rgba(92,201,138,0.12)', redDim: 'rgba(232,124,107,0.12)',
  purple: '#a07cf5', teal: '#5cc9c9', text: '#e4e0d8', text2: '#a8a4b8', muted: '#5a5868',
  sal1: '#f5c842', sal2: '#5cc98a',
}

export default function ExpensesSection({
  cm, cy, allItems, monthItems, expTotal, vikaTotal, ilyaTotal, sharedTotal,
  doneCount, pct, sal1Remain, sal2Remain,
  isDone, isPinned, toggle, togglePin, deleteCustom, addCustomItem, state
}) {
  const [tab, setTab] = useState('month')
  const [filter, setFilter] = useState('all')
  const [showModal, setShowModal] = useState(false)

  const tabs = [
    { id: 'month', label: '📅 Месяц', count: monthItems.length },
    { id: 'all',   label: '📋 Все',   count: allItems.length },
    { id: 'done',  label: '✅ Куплено', count: allItems.filter(i => isDone(i.id)).length },
    { id: 'overview', label: '📊 Обзор' },
    { id: 'chart', label: '📈 График' },
    { id: 'pdf',   label: '📤 PDF' },
  ]

  const filteredAll = filter === 'all' ? allItems
    : filter === 'recur' ? allItems.filter(i => i.r)
    : filter === 'pinned' ? allItems.filter(i => isPinned(i.id))
    : allItems.filter(i => i.cat === filter)

  return (
    <div>
      {/* HERO */}
      <div style={{ background: 'linear-gradient(160deg,#16161f 0%,#1c1b2a 100%)', borderBottom: `1px solid ${C.border}`, padding: '20px 16px 16px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
          <div>
            <div style={{ fontSize: 9, letterSpacing: '.2em', textTransform: 'uppercase', color: C.muted, marginBottom: 6 }}>Итого за месяц (без еды)</div>
            <div style={{ fontWeight: 700, fontSize: 'clamp(28px,6vw,46px)', color: C.accent, lineHeight: 1 }}>{fmt(expTotal)}</div>
            <div style={{ fontSize: 11, color: C.text2, marginTop: 4 }}>Без учёта еды</div>
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {[
              { label: 'Вика', val: vikaTotal, color: C.red },
              { label: 'Илья', val: ilyaTotal, color: C.blue },
              { label: 'Общее', val: sharedTotal, color: C.green },
            ].map(s => (
              <div key={s.label} style={{ textAlign: 'center', padding: '10px 12px', background: 'rgba(255,255,255,0.03)', border: `1px solid ${C.border}`, borderRadius: 12, minWidth: 80 }}>
                <div style={{ fontWeight: 700, fontSize: 15, color: s.color }}>{fmt(s.val)}</div>
                <div style={{ fontSize: 9, letterSpacing: '.1em', textTransform: 'uppercase', color: C.muted, marginTop: 3 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* SALARY CARDS */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, margin: '10px 16px 0' }}>
        {[
          { label: '3–6 числа', amount: SAL1, remain: sal1Remain, color: C.sal1, bg: 'rgba(245,200,66,0.05)', bc: 'rgba(245,200,66,0.2)', icon: '💛' },
          { label: '16–19 числа', amount: SAL2, remain: sal2Remain, color: C.sal2, bg: 'rgba(92,201,138,0.05)', bc: 'rgba(92,201,138,0.2)', icon: '💚' },
        ].map(s => (
          <div key={s.label} style={{ borderRadius: 12, padding: '10px 12px', border: `1px solid ${s.bc}`, background: s.bg, display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ fontSize: 18 }}>{s.icon}</div>
            <div>
              <div style={{ fontSize: 9, letterSpacing: '.08em', textTransform: 'uppercase', color: C.muted }}>{s.label}</div>
              <div style={{ fontWeight: 700, fontSize: 16, color: s.color }}>{fmt(s.amount)}</div>
              <div style={{ fontSize: 9, color: s.color, opacity: .7 }}>остаток ~{Math.max(0, s.remain).toLocaleString('ru-RU')} ₽</div>
            </div>
          </div>
        ))}
      </div>

      {/* PROGRESS BAR */}
      <div style={{ margin: '8px 16px 0', background: C.surface, border: `1px solid ${C.border}`, borderRadius: 10, padding: '9px 12px', display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{ fontSize: 10, color: C.text2, whiteSpace: 'nowrap', flexShrink: 0 }}>Куплено: {doneCount} из {monthItems.length}</div>
        <div style={{ flex: 1, height: 5, background: 'rgba(255,255,255,0.06)', borderRadius: 100, overflow: 'hidden', minWidth: 0 }}>
          <div style={{ height: '100%', borderRadius: 100, background: `linear-gradient(to right, ${C.green}, ${C.accent})`, width: pct + '%', transition: 'width .5s' }} />
        </div>
        <div style={{ fontSize: 10, fontWeight: 700, color: C.green, width: 30, textAlign: 'right', flexShrink: 0 }}>{pct}%</div>
      </div>

      {/* TABS */}
      <div style={{ display: 'flex', borderBottom: `1px solid ${C.border}`, padding: '8px 16px 0', overflowX: 'auto', scrollbarWidth: 'none' }}>
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{
            padding: '7px 10px 9px', fontSize: 10, fontWeight: 600,
            letterSpacing: '.05em', textTransform: 'uppercase',
            color: tab === t.id ? C.text : C.muted,
            borderBottom: `2px solid ${tab === t.id ? C.accent : 'transparent'}`,
            background: 'transparent', border: 'none', borderBottom: `2px solid ${tab === t.id ? C.accent : 'transparent'}`,
            cursor: 'pointer', whiteSpace: 'nowrap', flexShrink: 0,
            display: 'flex', alignItems: 'center', gap: 5,
          }}>
            {t.label}
            {t.count !== undefined && (
              <span style={{ background: tab === t.id ? C.accentDim : 'rgba(255,255,255,0.06)', color: tab === t.id ? C.accent : C.muted, borderRadius: 20, padding: '1px 5px', fontSize: 8 }}>
                {t.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* CONTENT */}
      <div style={{ padding: '14px 16px 100px' }}>
        {tab === 'month' && <ItemList items={monthItems} isDone={isDone} isPinned={isPinned} toggle={toggle} togglePin={togglePin} deleteCustom={deleteCustom} showPin={false} />}

        {tab === 'all' && (
          <>
            <FilterBar filter={filter} setFilter={setFilter} />
            <ItemList items={filteredAll} isDone={isDone} isPinned={isPinned} toggle={toggle} togglePin={togglePin} deleteCustom={deleteCustom} showPin={true} />
          </>
        )}

        {tab === 'done' && <DoneList items={allItems} isDone={isDone} />}
        {tab === 'overview' && <Overview monthItems={monthItems} allItems={allItems} isDone={isDone} />}
        {tab === 'chart' && <Chart cm={cm} cy={cy} allItems={allItems} state={state} expTotal={expTotal} />}
        {tab === 'pdf' && <PdfPanel cm={cm} cy={cy} monthItems={monthItems} expTotal={expTotal} isDone={isDone} />}
      </div>

      {/* FAB */}
      <motion.button
        onClick={() => setShowModal(true)}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        style={{
          position: 'fixed', bottom: 28, right: 28, width: 52, height: 52,
          borderRadius: '50%', background: '#c8a96e', border: 'none',
          color: '#ffffff', fontSize: 28, fontWeight: 300, cursor: 'pointer',
          boxShadow: '0 4px 24px rgba(200,169,110,0.45)', zIndex: 40,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}
      >+</motion.button>

      <AnimatePresence>
        {showModal && <AddModal onClose={() => setShowModal(false)} onSave={item => { addCustomItem(item); setShowModal(false) }} />}
      </AnimatePresence>
    </div>
  )
}

function ItemList({ items, isDone, isPinned, toggle, togglePin, deleteCustom, showPin }) {
  // Group by category
  const groups = {}
  items.forEach(i => { if (!groups[i.cat]) groups[i.cat] = []; groups[i.cat].push(i) })

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
    >
      {Object.entries(groups).map(([cat, arr]) => {
        const c = EXPENSE_CATS[cat] || EXPENSE_CATS.custom
        const total = arr.reduce((s, i) => s + i.p, 0)
        return (
          <div key={cat} style={{ marginBottom: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 7, padding: '0 2px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 7, fontWeight: 700, fontSize: 10, letterSpacing: '.07em', textTransform: 'uppercase', color: '#a8a4b8' }}>
                <span style={{ width: 7, height: 7, borderRadius: '50%', background: c.c, flexShrink: 0, display: 'inline-block' }} />
                {c.i} {c.l}
              </div>
              <div style={{ fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 7, background: 'rgba(255,255,255,0.04)', color: c.c }}>{fmt(total)}</div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {arr.map(item => <ExpenseItem key={item.id} item={item} done={isDone(item.id)} pinned={isPinned(item.id)} toggle={toggle} togglePin={togglePin} deleteCustom={deleteCustom} showPin={showPin} />)}
            </div>
          </div>
        )
      })}
    </motion.div>
  )
}

function ExpenseItem({ item, done, pinned, toggle, togglePin, deleteCustom, showPin }) {
  const c = EXPENSE_CATS[item.cat] || EXPENSE_CATS.custom
  const wColor = item.w === 'vika' ? '#e87c6b' : item.w === 'ilya' ? '#7c9cf5' : '#5cc98a'
  const wLabel = item.w === 'vika' ? 'Вика' : item.w === 'ilya' ? 'Илья' : 'Общее'

  return (
    <motion.div onClick={() => toggle(item.id)}
      whileTap={{ scale: 0.98 }}
      style={{
      display: 'flex', alignItems: 'center', gap: 10,
      background: done ? 'rgba(92,201,138,0.05)' : '#1a1a24',
      border: `1px solid ${done ? 'rgba(92,201,138,0.2)' : '#252535'}`,
      borderRadius: 11, padding: '10px 12px', cursor: 'pointer',
      transition: 'background .15s, border .15s',
    }}>
      {/* Checkbox */}
      <motion.div
        animate={{ scale: done ? [1, 1.2, 1] : 1, background: done ? '#5cc98a' : 'transparent' }}
        transition={{ type: 'spring', stiffness: 400, damping: 20 }}
        style={{
          width: 18, height: 18, borderRadius: 5, flexShrink: 0,
          border: done ? 'none' : '2px solid #2e2e42',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
        <AnimatePresence>
          {done && (
            <motion.span
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 500, damping: 25 }}
              style={{ color: 'white', fontSize: 10, fontWeight: 700 }}
            >✓</motion.span>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13, color: done ? '#5a5868' : '#e4e0d8', textDecoration: done ? 'line-through' : 'none', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {item.n}{item.note && <small style={{ color: '#5a5868', fontSize: 10 }}> ({item.note})</small>}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginTop: 2 }}>
          <span style={{ fontSize: 10, color: wColor }}>{wLabel}</span>
          <span style={{ fontSize: 9, borderRadius: 4, padding: '1px 5px', background: c.c + '22', color: c.c, fontWeight: 500 }}>{c.i} {c.l}</span>
        </div>
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 4, flexShrink: 0 }} onClick={e => e.stopPropagation()}>
        {showPin && !item.r && (
          <button onClick={() => togglePin(item.id)} style={{
            background: pinned ? 'rgba(200,169,110,0.12)' : 'transparent',
            border: `1px solid ${pinned ? '#c8a96e' : '#2e2e42'}`,
            borderRadius: 7, color: pinned ? '#c8a96e' : '#5a5868',
            fontSize: 9, padding: '2px 6px', cursor: 'pointer', whiteSpace: 'nowrap',
          }}>
            {pinned ? '📌 откреп.' : '📌 на гл.'}
          </button>
        )}
        {item.custom && (
          <button onClick={() => deleteCustom(item.id)} style={{
            background: 'transparent', border: '1px solid #e87c6b',
            borderRadius: 7, color: '#e87c6b', fontSize: 9, padding: '2px 6px', cursor: 'pointer',
          }}>🗑</button>
        )}
        <div style={{ fontSize: 12, fontWeight: 700, color: done ? '#5cc98a' : c.c }}>
          {item.p ? fmt(item.p) : <span style={{ color: '#5a5868', fontSize: 10 }}>—</span>}
        </div>
      </div>
    </motion.div>
  )
}

function FilterBar({ filter, setFilter }) {
  const filters = [
    { id: 'all', label: 'Все' },
    { id: 'recur', label: '🔁 Постоянные' },
    { id: 'pinned', label: '📌 На главной' },
    ...Object.entries(EXPENSE_CATS).map(([k, v]) => ({ id: k, label: v.i + ' ' + v.l })),
  ]
  return (
    <div style={{ display: 'flex', gap: 6, overflowX: 'auto', scrollbarWidth: 'none', marginBottom: 14, paddingBottom: 2 }}>
      {filters.map(f => (
        <button key={f.id} onClick={() => setFilter(f.id)} style={{
          flexShrink: 0, padding: '5px 12px', borderRadius: 100,
          border: `1px solid ${filter === f.id ? '#c8a96e' : '#2e2e42'}`,
          background: filter === f.id ? 'rgba(200,169,110,0.12)' : 'transparent',
          color: filter === f.id ? '#c8a96e' : '#a8a4b8',
          fontSize: 11, cursor: 'pointer', whiteSpace: 'nowrap',
        }}>{f.label}</button>
      ))}
    </div>
  )
}

function DoneList({ items, isDone }) {
  const done = items.filter(i => isDone(i.id))
  const total = done.reduce((s, i) => s + i.p, 0)
  if (!done.length) return <div style={{ textAlign: 'center', color: '#5a5868', padding: 32, fontSize: 13 }}>Ещё ничего не куплено</div>
  return (
    <div style={{ background: '#1a1a24', border: '1px solid #252535', borderRadius: 14, overflow: 'hidden' }}>
      <div style={{ padding: '11px 16px', background: '#14141c', borderBottom: '1px solid #252535', fontSize: 10, fontWeight: 700, letterSpacing: '.07em', textTransform: 'uppercase', color: '#a8a4b8' }}>История покупок</div>
      {done.map(item => {
        const c = EXPENSE_CATS[item.cat] || EXPENSE_CATS.custom
        return (
          <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 16px', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
            <div style={{ width: 7, height: 7, borderRadius: '50%', background: c.c, flexShrink: 0 }} />
            <div style={{ flex: 1, fontSize: 12 }}>{item.n}</div>
            <div style={{ fontSize: 10, color: '#5a5868' }}>{item.cat}</div>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#5cc98a' }}>{fmt(item.p)}</div>
          </div>
        )
      })}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '11px 16px', background: 'rgba(92,201,138,0.06)' }}>
        <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#5cc98a', flexShrink: 0 }} />
        <div style={{ flex: 1, fontSize: 11, fontWeight: 700 }}>Итого куплено</div>
        <div style={{ fontSize: 13, fontWeight: 700, color: '#5cc98a' }}>{fmt(total)}</div>
      </div>
    </div>
  )
}

function Overview({ monthItems, allItems, isDone }) {
  const total = monthItems.reduce((s, i) => s + i.p, 0)
  const totalDone = allItems.filter(i => isDone(i.id)).reduce((s, i) => s + i.p, 0)
  const byCat = {}
  monthItems.forEach(i => {
    if (!byCat[i.cat]) byCat[i.cat] = { t: 0, d: 0 }
    byCat[i.cat].t += i.p
    if (isDone(i.id)) byCat[i.cat].d += i.p
  })
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 10 }}>
      {[
        { icon: '📅', label: 'Этот месяц', val: fmt(total), sub: monthItems.length + ' позиций', color: '#c8a96e' },
        { icon: '✅', label: 'Куплено', val: fmt(totalDone), sub: allItems.filter(i => isDone(i.id)).length + ' поз.', color: '#5cc98a' },
      ].map(s => (
        <div key={s.label} style={{ background: '#1a1a24', border: '1px solid #252535', borderRadius: 13, padding: 16, position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: s.color, borderRadius: '13px 13px 0 0' }} />
          <div style={{ fontSize: 18, marginBottom: 6 }}>{s.icon}</div>
          <div style={{ fontSize: 9, letterSpacing: '.12em', textTransform: 'uppercase', color: '#5a5868', marginBottom: 4 }}>{s.label}</div>
          <div style={{ fontSize: 18, fontWeight: 700, color: s.color }}>{s.val}</div>
          <div style={{ fontSize: 10, color: '#5a5868', marginTop: 2 }}>{s.sub}</div>
        </div>
      ))}
      {Object.entries(byCat).map(([cat, d]) => {
        const c = EXPENSE_CATS[cat] || EXPENSE_CATS.custom
        const pct = d.t ? Math.round(d.d / d.t * 100) : 0
        return (
          <div key={cat} style={{ background: '#1a1a24', border: '1px solid #252535', borderRadius: 13, padding: 16, position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: c.c, borderRadius: '13px 13px 0 0' }} />
            <div style={{ fontSize: 18, marginBottom: 6 }}>{c.i}</div>
            <div style={{ fontSize: 9, letterSpacing: '.12em', textTransform: 'uppercase', color: '#5a5868', marginBottom: 4 }}>{c.l}</div>
            <div style={{ fontSize: 16, fontWeight: 700, color: c.c }}>{fmt(d.t)}</div>
            <div style={{ fontSize: 10, color: '#5a5868', marginTop: 2 }}>{pct}% куплено</div>
            <div style={{ marginTop: 8, height: 3, background: 'rgba(255,255,255,0.06)', borderRadius: 100, overflow: 'hidden' }}>
              <div style={{ height: '100%', background: c.c, width: pct + '%', borderRadius: 100, transition: 'width .5s' }} />
            </div>
          </div>
        )
      })}
    </div>
  )
}

function Chart({ cm, cy, allItems, state, expTotal }) {
  const now = new Date()
  const months = []
  for (let i = 5; i >= 0; i--) {
    let m = now.getMonth() - i, y = now.getFullYear()
    if (m < 0) { m += 12; y-- }
    months.push({ m, y, lbl: ['Янв','Фев','Мар','Апр','Май','Июн','Июл','Авг','Сен','Окт','Ноя','Дек'][m], key: y + '-' + m })
  }
  const foodTotal = 4700 // approximate monthly food
  const maxVal = Math.max(...months.map(mo => {
    const hist = state.history?.[mo.key]
    if (hist) return hist.exp + hist.food
    if (mo.m === cm && mo.y === cy) return expTotal + foodTotal
    return 0
  }), 1)

  const balance = 44000 - expTotal - foodTotal

  return (
    <div>
      <div style={{ background: '#1a1a24', border: '1px solid #252535', borderRadius: 16, padding: 20, marginBottom: 16 }}>
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.07em', textTransform: 'uppercase', color: '#a8a4b8', marginBottom: 16 }}>📈 Траты по месяцам</div>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6, height: 120 }}>
          {months.map((mo, idx) => {
            const hist = state.history?.[mo.key]
            const isCur = mo.m === cm && mo.y === cy
            const exp = isCur ? expTotal : (hist?.exp || 0)
            const food = isCur ? foodTotal : (hist?.food || 0)
            const expH = Math.round((exp / maxVal) * 100)
            const foodH = Math.round((food / maxVal) * 100)
            const noData = !isCur && !hist
            return (
              <div key={mo.key} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                <div style={{ fontSize: 8, color: '#a8a4b8', height: 16, display: 'flex', alignItems: 'center' }}>
                  {isCur && (exp + food) > 0 ? fmt(exp + food) : ''}
                </div>
                <div style={{ display: 'flex', alignItems: 'flex-end', gap: 2, height: 90, width: '100%' }}>
                  <div style={{ flex: 1, borderRadius: '4px 4px 0 0', background: '#c8a96e', opacity: noData ? 0.15 : isCur ? 1 : 0.6, height: Math.max(expH, 2) + '%', minHeight: 2 }} />
                  <div style={{ flex: 1, borderRadius: '4px 4px 0 0', background: '#5cc98a', opacity: noData ? 0.15 : isCur ? 1 : 0.6, height: Math.max(foodH, 2) + '%', minHeight: 2 }} />
                </div>
                <div style={{ fontSize: 9, color: isCur ? '#c8a96e' : '#5a5868', fontWeight: isCur ? 700 : 400 }}>{mo.lbl}</div>
              </div>
            )
          })}
        </div>
        <div style={{ display: 'flex', gap: 12, marginTop: 12 }}>
          {[{ c: '#c8a96e', l: 'Траты (без еды)' }, { c: '#5cc98a', l: 'Еда' }].map(l => (
            <div key={l.l} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 10, color: '#a8a4b8' }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: l.c }} />{l.l}
            </div>
          ))}
        </div>
      </div>

      <div style={{ background: '#1a1a24', border: '1px solid #252535', borderRadius: 16, padding: 20 }}>
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.07em', textTransform: 'uppercase', color: '#a8a4b8', marginBottom: 14 }}>💰 Баланс месяца</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 10 }}>
          <div style={{ background: 'rgba(92,201,138,0.06)', border: '1px solid #5cc98a', borderRadius: 12, padding: 14, textAlign: 'center' }}>
            <div style={{ fontSize: 9, color: '#5a5868', marginBottom: 4 }}>ДОХОД</div>
            <div style={{ fontSize: 20, fontWeight: 700, color: '#5cc98a' }}>44 000 ₽</div>
            <div style={{ fontSize: 9, color: '#5a5868', marginTop: 2 }}>18к + 26к</div>
          </div>
          <div style={{ background: 'rgba(232,124,107,0.06)', border: '1px solid #e87c6b', borderRadius: 12, padding: 14, textAlign: 'center' }}>
            <div style={{ fontSize: 9, color: '#5a5868', marginBottom: 4 }}>РАСХОДЫ</div>
            <div style={{ fontSize: 20, fontWeight: 700, color: '#e87c6b' }}>{fmt(expTotal + foodTotal)}</div>
            <div style={{ fontSize: 9, color: '#5a5868', marginTop: 2 }}>траты + еда</div>
          </div>
        </div>
        <div style={{ background: 'rgba(200,169,110,0.08)', border: '1px solid #c8a96e', borderRadius: 12, padding: 16, textAlign: 'center' }}>
          <div style={{ fontSize: 9, color: '#5a5868', marginBottom: 4 }}>ОСТАТОК</div>
          <div style={{ fontSize: 24, fontWeight: 700, color: balance >= 0 ? '#5cc98a' : '#e87c6b' }}>
            {balance >= 0 ? '+' : ''}{fmt(Math.abs(balance))}
          </div>
        </div>
      </div>
    </div>
  )
}

function PdfPanel({ cm, cy, monthItems, expTotal, isDone }) {
  const foodTotal = 4700
  const balance = 44000 - expTotal - foodTotal
  const doneItems = monthItems.filter(i => isDone(i.id))

  function exportPDF() {
    const groups = {}
    monthItems.forEach(i => { if (!groups[i.cat]) groups[i.cat] = []; groups[i.cat].push(i) })
    let rows = ''
    Object.entries(groups).forEach(([cat, arr]) => {
      const c = EXPENSE_CATS[cat] || EXPENSE_CATS.custom
      rows += `<tr style="background:#f5f4f0"><td colspan="3" style="padding:8px 12px;font-weight:700;font-size:12px">${c.i} ${c.l}</td><td style="padding:8px 12px;text-align:right;font-weight:700">${fmt(arr.reduce((s,i)=>s+i.p,0))}</td></tr>`
      arr.forEach(i => {
        const done = isDone(i.id)
        rows += `<tr><td style="padding:6px 12px 6px 24px;font-size:12px;color:${done?'#3a9e68':'#333'}">${done?'✓ ':''}${i.n}</td><td style="padding:6px 12px;font-size:11px;color:#888">${i.w==='vika'?'Вика':i.w==='ilya'?'Илья':'Общее'}</td><td style="padding:6px 12px;font-size:11px;color:#888">${i.r?'постоянная':'разовая'}</td><td style="padding:6px 12px;text-align:right;font-size:12px;font-weight:600">${fmt(i.p)}</td></tr>`
      })
    })
    const html = `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>FamBuget · ${MONTHS[cm]} ${cy}</title>
    <style>body{font-family:Arial,sans-serif;margin:0;padding:32px;background:#fff}h1{color:#a07840;font-size:24px;margin-bottom:4px}h2{color:#888;font-size:14px;font-weight:400;margin-bottom:24px}table{width:100%;border-collapse:collapse;margin-bottom:24px}th{background:#1a1a24;color:#c8a96e;padding:10px 12px;text-align:left;font-size:12px}tr:nth-child(even){background:#fafaf8}td{border-bottom:1px solid #eee}.grid{display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:24px}.card{border-radius:12px;padding:16px;border:2px solid #eee}@media print{button{display:none}}</style>
    </head><body>
    <h1>💰 FamBuget</h1><h2>Отчёт за ${MONTHS[cm]} ${cy}</h2>
    <div class="grid">
      <div class="card" style="border-color:#c8a96e"><div style="font-size:11px;color:#888;margin-bottom:4px">ТРАТЫ БЕЗ ЕДЫ</div><div style="font-size:22px;font-weight:700;color:#a07840">${fmt(expTotal)}</div></div>
      <div class="card" style="border-color:#3a9e68"><div style="font-size:11px;color:#888;margin-bottom:4px">ЕДА</div><div style="font-size:22px;font-weight:700;color:#3a9e68">${fmt(foodTotal)}</div></div>
      <div class="card" style="border-color:#333"><div style="font-size:11px;color:#888;margin-bottom:4px">ДОХОД</div><div style="font-size:22px;font-weight:700">44 000 ₽</div></div>
      <div class="card" style="border-color:${balance>=0?'#3a9e68':'#c0503e'}"><div style="font-size:11px;color:#888;margin-bottom:4px">ОСТАТОК</div><div style="font-size:22px;font-weight:700;color:${balance>=0?'#3a9e68':'#c0503e'}">${balance>=0?'+':''}${fmt(Math.abs(balance))}</div></div>
    </div>
    <table><tr><th>Название</th><th>Кто</th><th>Тип</th><th style="text-align:right">Сумма</th></tr>${rows}</table>
    <p style="color:#888;font-size:11px">Куплено: ${doneItems.length} из ${monthItems.length} позиций</p>
    <button onclick="window.print()" style="background:#a07840;color:#fff;border:none;border-radius:8px;padding:12px 24px;font-size:14px;cursor:pointer">🖨️ Распечатать / Сохранить PDF</button>
    </body></html>`
    const win = window.open('', '_blank')
    win.document.write(html)
    win.document.close()
  }

  return (
    <div>
      <button onClick={exportPDF} style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#c8a96e', border: 'none', borderRadius: 12, padding: '12px 20px', fontWeight: 700, fontSize: 11, color: '#0d0d11', cursor: 'pointer', marginBottom: 20 }}>
        📤 Скачать PDF отчёт
      </button>
      <div style={{ background: '#1a1a24', border: '1px solid #252535', borderRadius: 16, padding: 20 }}>
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.07em', textTransform: 'uppercase', color: '#a8a4b8', marginBottom: 16 }}>Предпросмотр · {MONTHS[cm]} {cy}</div>
        {[
          { label: 'Траты (без еды)', val: fmt(expTotal), color: '#c8a96e' },
          { label: 'Еда', val: fmt(foodTotal), color: '#5cc98a' },
          { label: 'Итого расходов', val: fmt(expTotal + foodTotal), color: '#e4e0d8' },
          { label: 'Доход', val: '44 000 ₽', color: '#5cc98a' },
        ].map(r => (
          <div key={r.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #252535' }}>
            <span style={{ color: '#a8a4b8', fontSize: 13 }}>{r.label}</span>
            <span style={{ fontWeight: 700, fontSize: 13, color: r.color }}>{r.val}</span>
          </div>
        ))}
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0' }}>
          <span style={{ fontWeight: 700, fontSize: 14 }}>Остаток</span>
          <span style={{ fontWeight: 700, fontSize: 14, color: balance >= 0 ? '#5cc98a' : '#e87c6b' }}>
            {balance >= 0 ? '+' : ''}{fmt(Math.abs(balance))}
          </span>
        </div>
        <div style={{ fontSize: 11, color: '#5a5868', marginTop: 4 }}>Куплено: {doneItems.length} из {monthItems.length} позиций</div>
      </div>
    </div>
  )
}

function AddModal({ onClose, onSave }) {
  const [name, setName] = useState('')
  const [price, setPrice] = useState('')
  const [who, setWho] = useState('shared')
  const [cat, setCat] = useState('custom')
  const [rec, setRec] = useState('0')

  function save() {
    if (!name.trim()) { alert('Введи название'); return }
    onSave({ id: 'c_' + Date.now(), n: name.trim(), p: parseInt(price) || 0, w: who, cat, r: rec === '1', m: [] })
  }

  const inp = { width: '100%', background: '#14141c', border: '1px solid #2e2e42', borderRadius: 12, padding: '12px 14px', color: '#e4e0d8', fontSize: 14, outline: 'none', boxSizing: 'border-box', marginBottom: 10 }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={e => e.target === e.currentTarget && onClose()}
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 150, display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}
    >
      <motion.div
        initial={{ y: 80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 80, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 400, damping: 35 }}
        style={{ background: '#1a1a24', border: '1px solid #2e2e42', borderRadius: '24px 24px 0 0', padding: '28px 20px 40px', width: '100%', maxWidth: 480 }}
      >
        <div style={{ fontWeight: 700, fontSize: 14, color: '#e4e0d8', marginBottom: 20, textAlign: 'center' }}>➕ Новая трата</div>
        <input style={inp} placeholder="Название (например: Парикмахер)" value={name} onChange={e => setName(e.target.value)} />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 10 }}>
          <input style={{ ...inp, marginBottom: 0 }} type="number" placeholder="Сумма ₽" value={price} onChange={e => setPrice(e.target.value)} />
          <select style={{ ...inp, marginBottom: 0 }} value={who} onChange={e => setWho(e.target.value)}>
            <option value="shared">Общее</option>
            <option value="vika">Вика</option>
            <option value="ilya">Илья</option>
          </select>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 10 }}>
          <select style={{ ...inp, marginBottom: 0 }} value={cat} onChange={e => setCat(e.target.value)}>
            {Object.entries(EXPENSE_CATS).map(([k, v]) => <option key={k} value={k}>{v.i} {v.l}</option>)}
          </select>
          <select style={{ ...inp, marginBottom: 0 }} value={rec} onChange={e => setRec(e.target.value)}>
            <option value="0">Разовая</option>
            <option value="1">Каждый месяц</option>
          </select>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 16 }}>
          <button onClick={onClose} style={{ background: '#14141c', border: '1px solid #2e2e42', borderRadius: 12, padding: 13, color: '#a8a4b8', fontWeight: 600, fontSize: 11, cursor: 'pointer' }}>Отмена</button>
          <button onClick={save} style={{ background: '#c8a96e', border: 'none', borderRadius: 12, padding: 13, color: '#0d0d11', fontWeight: 700, fontSize: 11, cursor: 'pointer' }}>Сохранить</button>
        </div>
      </motion.div>
    </motion.div>
  )
}
