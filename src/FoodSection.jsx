import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FOOD_ITEMS, FOOD_CATS, fmt, SAL1, SAL2 } from './data'

const C = {
  bg: '#0d0d11', surface: '#14141c', card: '#1a1a24',
  border: '#252535', border2: '#2e2e42',
  accent: '#c8a96e', green: '#5cc98a', greenDim: 'rgba(92,201,138,0.12)',
  blue: '#7c9cf5', purple: '#a07cf5', teal: '#5cc9c9', pink: '#f57ca0',
  text: '#e4e0d8', text2: '#a8a4b8', muted: '#5a5868',
  sal1: '#f5c842', sal2: '#5cc98a',
}

const WEEK_LABELS = ['1-я неделя', '2-я неделя', '3-я неделя', '4-я неделя']
const WEEK_NOTES  = ['(после 1-й получки)', '(до 2-й получки)', '(после 2-й получки)', '(конец месяца)']
const WEEK_COLORS = [C.sal1, C.blue, C.sal2, C.purple]

export default function FoodSection({ cm, cy, foodTotal, foodDoneCount, foodPct, isFoodDone, toggleFood, state, expTotal }) {
  const [tab, setTab] = useState('week')

  const w12 = FOOD_ITEMS.filter(i => i.wk?.includes(1) || i.wk?.includes(2)).reduce((s, i) => s + i.p, 0)
  const w34 = FOOD_ITEMS.filter(i => i.wk?.includes(3) || i.wk?.includes(4)).reduce((s, i) => s + i.p, 0)
  const wantTotal = FOOD_ITEMS.filter(i => i.want).reduce((s, i) => s + i.p, 0)

  const sal1Remain = Math.max(0, Math.round(SAL1 - expTotal * (SAL1 / (SAL1 + SAL2)) - w12))
  const sal2Remain = Math.max(0, Math.round(SAL2 - expTotal * (SAL2 / (SAL1 + SAL2)) - w34))

  const allFoodItems = FOOD_ITEMS
  const weekItems = (w) => FOOD_ITEMS.filter(i => i.wk?.includes(w))
  const totalItems = FOOD_ITEMS.length

  const tabs = [
    { id: 'week', label: '🗓 По неделям', count: FOOD_ITEMS.filter(i => i.wk?.length > 0).length },
    { id: 'all',  label: '📋 Все',        count: totalItems },
    { id: 'done', label: '✅ Куплено',     count: foodDoneCount },
    { id: 'want', label: '🌟 Хочу',       count: FOOD_ITEMS.filter(i => i.want || i.salad || i.rare).length },
  ]

  return (
    <div>
      {/* HERO */}
      <div style={{ background: 'linear-gradient(160deg,#16161f 0%,#1c1b2a 100%)', borderBottom: `1px solid ${C.border}`, padding: '20px 16px 16px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
          <div>
            <div style={{ fontSize: 9, letterSpacing: '.2em', textTransform: 'uppercase', color: C.muted, marginBottom: 6 }}>Еда на месяц</div>
            <div style={{ fontWeight: 700, fontSize: 'clamp(28px,6vw,46px)', color: C.green, lineHeight: 1 }}>{fmt(foodTotal)}</div>
            <div style={{ fontSize: 11, color: C.text2, marginTop: 4 }}>1-я получка 18 000 ₽ · 2-я получка 26 000 ₽</div>
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {[
              { label: '1–2 нед.', val: w12, color: C.sal1 },
              { label: '3–4 нед.', val: w34, color: C.sal2 },
              { label: 'Хочу',     val: wantTotal, color: C.purple },
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
          { label: '1-я получка · 18 000 ₽', remain: sal1Remain, color: C.sal1, bg: 'rgba(245,200,66,0.05)', bc: 'rgba(245,200,66,0.2)', icon: '🛒', sub: 'после трат + еда 1–2 нед.' },
          { label: '2-я получка · 26 000 ₽', remain: sal2Remain, color: C.sal2, bg: 'rgba(92,201,138,0.05)', bc: 'rgba(92,201,138,0.2)', icon: '🛒', sub: 'после трат + еда 3–4 нед.' },
        ].map((s, idx) => (
          <div key={idx} style={{ borderRadius: 12, padding: '10px 12px', border: `1px solid ${s.bc}`, background: s.bg, display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ fontSize: 18 }}>{s.icon}</div>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: 8, letterSpacing: '.06em', textTransform: 'uppercase', color: C.muted }}>{s.label}</div>
              <div style={{ fontWeight: 700, fontSize: 15, color: s.color }}>{fmt(s.remain)}</div>
              <div style={{ fontSize: 8, color: s.color, opacity: .7 }}>{s.sub}</div>
            </div>
          </div>
        ))}
      </div>

      {/* PROGRESS BAR */}
      <div style={{ margin: '8px 16px 0', background: C.surface, border: `1px solid ${C.border}`, borderRadius: 10, padding: '9px 12px', display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{ fontSize: 10, color: C.text2, whiteSpace: 'nowrap', flexShrink: 0 }}>Куплено: {foodDoneCount} из {totalItems}</div>
        <div style={{ flex: 1, height: 5, background: 'rgba(255,255,255,0.06)', borderRadius: 100, overflow: 'hidden', minWidth: 0 }}>
          <div style={{ height: '100%', borderRadius: 100, background: `linear-gradient(to right, ${C.teal}, ${C.green})`, width: foodPct + '%', transition: 'width .5s' }} />
        </div>
        <div style={{ fontSize: 10, fontWeight: 700, color: C.teal, width: 30, textAlign: 'right', flexShrink: 0 }}>{foodPct}%</div>
      </div>

      {/* TABS */}
      <div style={{ display: 'flex', borderBottom: `1px solid ${C.border}`, padding: '8px 16px 0', overflowX: 'auto', scrollbarWidth: 'none' }}>
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{
            padding: '7px 10px 9px', fontSize: 10, fontWeight: 600,
            letterSpacing: '.05em', textTransform: 'uppercase',
            color: tab === t.id ? C.text : C.muted,
            borderBottom: `2px solid ${tab === t.id ? C.green : 'transparent'}`,
            background: 'transparent', border: 'none',
            borderBottom: `2px solid ${tab === t.id ? C.green : 'transparent'}`,
            cursor: 'pointer', whiteSpace: 'nowrap', flexShrink: 0,
            display: 'flex', alignItems: 'center', gap: 5,
          }}>
            {t.label}
            {t.count !== undefined && (
              <span style={{ background: tab === t.id ? C.greenDim : 'rgba(255,255,255,0.06)', color: tab === t.id ? C.green : C.muted, borderRadius: 20, padding: '1px 5px', fontSize: 8 }}>
                {t.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* CONTENT */}
      <div style={{ padding: '14px 16px 100px' }}>
        {tab === 'week' && (
          <div>
            {[1, 2, 3, 4].map(w => {
              const items = weekItems(w)
              const total = items.reduce((s, i) => s + i.p, 0)
              const done = items.filter(i => isFoodDone(i.id)).length
              return (
                <div key={w}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 2px 7px', fontWeight: 700, fontSize: 10, letterSpacing: '.08em', textTransform: 'uppercase', color: C.text2 }}>
                    <span style={{ color: WEEK_COLORS[w - 1] }}>
                      {WEEK_LABELS[w - 1]}{' '}
                      <small style={{ color: C.muted, fontSize: 8, fontWeight: 400 }}>{WEEK_NOTES[w - 1]}</small>
                    </span>
                    <span style={{ color: C.green }}>{fmt(total)} · {done}/{items.length}</span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 2, marginBottom: 16 }}>
                    {items.map(item => <FoodItem key={item.id} item={item} done={isFoodDone(item.id)} toggle={toggleFood} />)}
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {tab === 'all' && (
          <FoodByCategory items={FOOD_ITEMS} isFoodDone={isFoodDone} toggleFood={toggleFood} />
        )}

        {tab === 'done' && (
          <FoodDoneList items={FOOD_ITEMS} isFoodDone={isFoodDone} />
        )}

        {tab === 'want' && (
          <div>
            {[
              { label: '🌟 Хочу', filter: i => i.want, color: C.pink },
              { label: '🥙 К салатам', filter: i => i.salad, color: C.teal },
              { label: '📦 Редко', filter: i => i.rare, color: C.purple },
            ].map(group => {
              const items = FOOD_ITEMS.filter(group.filter)
              if (!items.length) return null
              const total = items.reduce((s, i) => s + i.p, 0)
              return (
                <div key={group.label}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 2px 7px', fontWeight: 700, fontSize: 10, letterSpacing: '.08em', textTransform: 'uppercase' }}>
                    <span style={{ color: group.color }}>{group.label}</span>
                    {total > 0 && <span style={{ color: C.green }}>{fmt(total)}</span>}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 2, marginBottom: 16 }}>
                    {items.map(item => <FoodItem key={item.id} item={item} done={isFoodDone(item.id)} toggle={toggleFood} />)}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

function FoodItem({ item, done, toggle }) {
  const c = FOOD_CATS[item.cat] || { c: '#a8a4b8', i: '🍽', l: item.cat }
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
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13, color: done ? '#5a5868' : '#e4e0d8', textDecoration: done ? 'line-through' : 'none' }}>
          {item.n}
        </div>
        <div style={{ marginTop: 2 }}>
          <span style={{ fontSize: 9, borderRadius: 4, padding: '1px 5px', background: c.c + '22', color: c.c, fontWeight: 500 }}>{c.i} {c.l}</span>
        </div>
      </div>
      <div style={{ fontSize: 12, fontWeight: 700, color: done ? '#5cc98a' : c.c, flexShrink: 0 }}>
        {item.p ? fmt(item.p) : <span style={{ color: '#5a5868', fontSize: 10 }}>~цена</span>}
      </div>
    </motion.div>
  )
}

function FoodByCategory({ items, isFoodDone, toggleFood }) {
  const groups = {}
  items.forEach(i => { if (!groups[i.cat]) groups[i.cat] = []; groups[i.cat].push(i) })
  return (
    <div>
      {Object.entries(groups).map(([cat, arr]) => {
        const c = FOOD_CATS[cat] || { c: '#a8a4b8', i: '🍽', l: cat }
        const total = arr.reduce((s, i) => s + i.p, 0)
        return (
          <div key={cat} style={{ marginBottom: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 7, padding: '0 2px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 7, fontWeight: 700, fontSize: 10, letterSpacing: '.07em', textTransform: 'uppercase', color: '#a8a4b8' }}>
                <span style={{ width: 7, height: 7, borderRadius: '50%', background: c.c, flexShrink: 0, display: 'inline-block' }} />
                {c.i} {c.l}
              </div>
              <div style={{ fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 7, background: 'rgba(255,255,255,0.04)', color: c.c }}>{total ? fmt(total) : '—'}</div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {arr.map(item => <FoodItem key={item.id} item={item} done={isFoodDone(item.id)} toggle={toggleFood} />)}
            </div>
          </div>
        )
      })}
    </div>
  )
}

function FoodDoneList({ items, isFoodDone }) {
  const done = items.filter(i => isFoodDone(i.id))
  if (!done.length) return <div style={{ textAlign: 'center', color: '#5a5868', padding: 32, fontSize: 13 }}>Ещё ничего не куплено</div>
  return (
    <div style={{ background: '#1a1a24', border: '1px solid #252535', borderRadius: 14, overflow: 'hidden' }}>
      <div style={{ padding: '11px 16px', background: '#14141c', borderBottom: '1px solid #252535', fontSize: 10, fontWeight: 700, letterSpacing: '.07em', textTransform: 'uppercase', color: '#a8a4b8' }}>История (еда)</div>
      {done.map(item => {
        const c = FOOD_CATS[item.cat] || { c: '#a8a4b8' }
        return (
          <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 16px', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
            <div style={{ width: 7, height: 7, borderRadius: '50%', background: c.c, flexShrink: 0 }} />
            <div style={{ flex: 1, fontSize: 12 }}>{item.n}</div>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#5cc98a' }}>{fmt(item.p)}</div>
          </div>
        )
      })}
    </div>
  )
}
