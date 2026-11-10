import {useEffect, useMemo, useRef, useState} from 'react'
import {motion} from 'framer-motion'
import {wedding as w} from './config'
import './envelope.css'

/* ---------- small geometry helpers (seeded, so shapes are stable on every load) ---------- */
const seeded = (seed) => { let s = seed; return () => (s = (s * 16807) % 2147483647, (s - 1) / 2147483646) }
const pct = (n) => n.toFixed(2) + '%'
const toClip = (pts) => `polygon(${pts.map(([x, y]) => `${pct(x)} ${pct(y)}`).join(',')})`

// Torn / deckled edge between two points. With `inward`, the tear only bites into the paper.
function tear(r, [x1, y1], [x2, y2], n, amp, inward = false) {
  const dx = x2 - x1, dy = y2 - y1, len = Math.hypot(dx, dy), nx = -dy / len, ny = dx / len
  const phase = r() * 6, out = []
  for (let i = 1; i <= n; i++) {
    const t = i / n
    let j = (Math.sin(t * 11 + phase) * 0.4 + (r() - 0.5) * 1.2 + (r() < 0.08 ? (r() - 0.5) * 1.2 : 0)) * amp
    if (i === n) j = 0
    if (inward) j = Math.abs(j)
    out.push([x1 + dx * t + nx * j, y1 + dy * t + ny * j])
  }
  return out
}

function deckledRect(seed, amp = 1.3, n = 30) {
  const r = seeded(seed), a = [0.5, 0.6], b = [99.5, 0.5], c = [99.4, 99.5], d = [0.6, 99.4]
  return toClip([a, ...tear(r, a, b, n, amp, true), ...tear(r, b, c, n, amp, true), ...tear(r, c, d, n, amp, true), ...tear(r, d, a, n, amp, true)])
}

function flapShape() {
  const r = seeded(77), L = [0, 20], R = [100, 20], tip = [50, 100]
  return toClip([[0, 0], [100, 0], R, ...tear(r, R, tip, 44, 1.1), ...tear(r, tip, L, 44, 1.1)])
}

function sheetShape() {
  const r = seeded(31)
  return toClip([[0, 2], ...tear(r, [0, 2], [100, 2], 70, 0.5), [100, 97.5], ...tear(r, [100, 97.5], [0, 97.5], 70, 0.5)])
}

/* ---------- wax seal ---------- */
function sealBlob() {
  const r = seeded(9), pts = []
  for (let i = 0; i < 80; i++) {
    const a = (i / 80) * Math.PI * 2
    const rad = 55 + Math.sin(a * 5 + 1) * 1.4 + Math.sin(a * 13) * 0.8 + (r() - 0.5) * 1.6
    pts.push(`${(60 + Math.cos(a) * rad).toFixed(2)},${(60 + Math.sin(a) * rad).toFixed(2)}`)
  }
  return `M${pts.join('L')}Z`
}

function laurel() {
  const leaves = []
  const branch = (from, to, side) => {
    for (let k = 0; k <= 9; k++) {
      const deg = from + ((to - from) * k) / 9, a = (deg * Math.PI) / 180
      const x = 60 + Math.cos(a) * 34, y = 61 + Math.sin(a) * 34
      const tangent = deg + (side < 0 ? -90 : 90)
      const size = 1 - k * 0.04
      leaves.push({x, y, rot: tangent + 38, s: size, dx: Math.cos(a) * 3.4, dy: Math.sin(a) * 3.4})
      leaves.push({x, y, rot: tangent - 38, s: size, dx: -Math.cos(a) * 3.4, dy: -Math.sin(a) * 3.4})
    }
  }
  branch(102, 232, 1)
  branch(78, -52, -1)
  return leaves
}

function Seal() {
  const blob = useMemo(sealBlob, []), leaves = useMemo(laurel, [])
  const mono = `${w.groom[0]}&${w.bride[0]}`
  return (
    <svg viewBox="0 0 120 120" aria-hidden>
      <path d={blob} fill="url(#ev-wax)" />
      <path d={blob} fill="none" stroke="url(#ev-gold)" strokeWidth="1.2" strokeDasharray="5 9 2 14 7 22" opacity=".85" />
      <circle cx="60" cy="61" r="42" fill="url(#ev-wax-in)" />
      <circle cx="60" cy="61" r="42" fill="none" stroke="#132a1a" strokeOpacity=".55" strokeWidth="1.4" />
      <circle cx="60" cy="61.8" r="42" fill="none" stroke="#7fa486" strokeOpacity=".25" strokeWidth=".8" />
      <g fill="url(#ev-gold)">
        {leaves.map((l, i) => (
          <ellipse key={i} cx={(l.x + l.dx).toFixed(2)} cy={(l.y + l.dy).toFixed(2)} rx={(5.2 * l.s).toFixed(2)} ry={(2.1 * l.s).toFixed(2)}
            transform={`rotate(${l.rot.toFixed(1)} ${(l.x + l.dx).toFixed(2)} ${(l.y + l.dy).toFixed(2)})`} />
        ))}
      </g>
      <path d="M60 94 L56 99 M60 94 L64 99" stroke="url(#ev-gold)" strokeWidth="1.2" strokeLinecap="round" />
      <text x="60" y="68.5" textAnchor="middle" className="ev-seal-mono" fill="#0f2215" opacity=".6" transform="translate(.6 1)">{mono}</text>
      <text x="60" y="68.5" textAnchor="middle" className="ev-seal-mono" fill="url(#ev-gold)">{mono}</text>
      <g fill="#d9b569" opacity=".85">
        <path d="M16 38c2-3 5-2 4 1s-4 3-4-1z" /><path d="M96 22c3-1 4 2 2 3s-4-1-2-3z" />
        <path d="M104 78c2 0 3 3 0 4s-3-3 0-4z" /><path d="M30 98c3-1 4 1 2 3s-4 0-2-3z" />
        <circle cx="88" cy="101" r="1.4" /><circle cx="22" cy="70" r="1.1" /><circle cx="70" cy="9" r="1.2" />
      </g>
    </svg>
  )
}

/* ---------- eucalyptus sprig ---------- */
function Sprig({p, leaves = 11, size = 26, seed = 1, className}) {
  const shapes = useMemo(() => {
    const r = seeded(seed), [a, b, c, d] = p
    const at = (t) => {
      const m = 1 - t
      return [
        m * m * m * a[0] + 3 * m * m * t * b[0] + 3 * m * t * t * c[0] + t * t * t * d[0],
        m * m * m * a[1] + 3 * m * m * t * b[1] + 3 * m * t * t * c[1] + t * t * t * d[1]
      ]
    }
    return Array.from({length: leaves}, (_, i) => {
      const t = 0.06 + (i / (leaves - 1)) * 0.92
      const [x, y] = at(t), [x2, y2] = at(Math.min(t + 0.01, 1))
      const ang = Math.atan2(y2 - y, x2 - x), side = i % 2 ? 1 : -1
      const s = size * (1 - t * 0.45) * (0.88 + r() * 0.24)
      const off = s * 0.95
      const cx = x + Math.cos(ang + side * Math.PI / 2) * off, cy = y + Math.sin(ang + side * Math.PI / 2) * off
      const rot = (ang * 180) / Math.PI + side * (55 + r() * 25)
      return {x, y, cx, cy, s, rot, tone: Math.floor(r() * 3)}
    })
  }, [p, leaves, size, seed])
  const [a, b, c, d] = p
  return (
    <svg className={className} viewBox="0 0 400 400" aria-hidden>
      <path d={`M${a}C${b} ${c} ${d}`} fill="none" stroke="#857560" strokeWidth="2.6" strokeLinecap="round" />
      {shapes.map((l, i) => (
        <g key={i}>
          <line x1={l.x} y1={l.y} x2={l.cx} y2={l.cy} stroke="#857560" strokeWidth="1.6" />
          <g transform={`rotate(${l.rot.toFixed(1)} ${l.cx.toFixed(1)} ${l.cy.toFixed(1)})`}>
            <ellipse cx={l.cx} cy={l.cy} rx={l.s} ry={l.s * 0.84} fill={`url(#ev-leaf-${l.tone})`} />
            <path d={`M${l.cx - l.s * 0.85} ${l.cy}Q${l.cx} ${l.cy - l.s * 0.08} ${l.cx + l.s * 0.8} ${l.cy}`} fill="none" stroke="#e8ead9" strokeOpacity=".35" strokeWidth="1" />
          </g>
        </g>
      ))}
    </svg>
  )
}

const TOP_SPRIG = [[400, 210], [330, 160], [250, 70], [170, 0]]
const BOTTOM_SPRIG = [[0, 40], [60, 120], [120, 240], [190, 400]]

/* ---------- the intro ---------- */
export default function Envelope({onStart, onDone}) {
  const [phase, setPhase] = useState('idle') // idle -> open -> reveal
  const timers = useRef([])
  const clips = useMemo(() => ({card: deckledRect(5), flap: flapShape(), sheet: sheetShape()}), [])
  useEffect(() => () => timers.current.forEach(clearTimeout), [])

  const go = () => {
    if (phase !== 'idle') return
    setPhase('open'); onStart()
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) { timers.current.push(setTimeout(onDone, 300)); return }
    timers.current.push(setTimeout(() => setPhase('reveal'), 2900))
    timers.current.push(setTimeout(onDone, 4900))
  }

  return (
    <motion.div id="envelope-intro" data-phase={phase} exit={{opacity: 0}} transition={{duration: 1.1}}>
      <svg width="0" height="0" style={{position: 'absolute'}} aria-hidden>
        <defs>
          <radialGradient id="ev-wax" cx="38%" cy="32%" r="75%">
            <stop offset="0" stopColor="#4d7a55" /><stop offset=".45" stopColor="#2c5535" /><stop offset="1" stopColor="#173321" />
          </radialGradient>
          <radialGradient id="ev-wax-in" cx="62%" cy="70%" r="80%">
            <stop offset="0" stopColor="#36623f" /><stop offset=".7" stopColor="#24482d" /><stop offset="1" stopColor="#1a3822" />
          </radialGradient>
          <linearGradient id="ev-gold" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#f3dc9c" /><stop offset=".45" stopColor="#c99e4f" /><stop offset=".7" stopColor="#e8cc85" /><stop offset="1" stopColor="#a47a35" />
          </linearGradient>
          {[['#b2b8a3', '#8d977f'], ['#a3ab93', '#7f8a71'], ['#bcc0ae', '#98a08a']].map(([l, d], i) => (
            <linearGradient key={i} id={`ev-leaf-${i}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor={l} /><stop offset="1" stopColor={d} />
            </linearGradient>
          ))}
          <linearGradient id="ev-pocket-fill" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#fbf8f1" /><stop offset=".4" stopColor="#f8f4ec" /><stop offset="1" stopColor="#ede5d6" />
          </linearGradient>
          <clipPath id="ev-pocket-clip"><path d="M0 0L68 47L136 0V100H0Z" /></clipPath>
          <filter id="ev-paper-noise" x="0" y="0" width="100%" height="100%">
            <feTurbulence type="fractalNoise" baseFrequency="1.4" numOctaves="2" stitchTiles="stitch" />
            <feColorMatrix values="0 0 0 0 .45  0 0 0 0 .38  0 0 0 0 .26  0 0 0 .22 0" />
          </filter>
          <linearGradient id="ev-ribbon" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#b48f55" /><stop offset=".35" stopColor="#ecd3a0" /><stop offset=".55" stopColor="#c9a466" /><stop offset=".8" stopColor="#f1ddb0" /><stop offset="1" stopColor="#a8834a" />
          </linearGradient>
        </defs>
      </svg>

      <div className="ev-sheet" style={{clipPath: clips.sheet}} aria-hidden />
      <div className="ev-light" aria-hidden />
      <Sprig className="ev-sprig ev-sprig-top" p={TOP_SPRIG} leaves={12} size={27} seed={3} />
      <Sprig className="ev-sprig ev-sprig-bottom" p={BOTTOM_SPRIG} leaves={11} size={27} seed={8} />
      <svg className="ev-ribbon" viewBox="0 0 320 320" aria-hidden>
        <path d="M340 140C250 150 190 200 214 250C236 296 150 318 40 350" fill="none" stroke="url(#ev-ribbon)" strokeWidth="30" />
        <path d="M340 140C250 150 190 200 214 250C236 296 150 318 40 350" fill="none" stroke="#fff6df" strokeOpacity=".45" strokeWidth="5" strokeDasharray="60 140 40 400" />
        <path d="M200 350C220 300 285 270 340 282" fill="none" stroke="url(#ev-ribbon)" strokeWidth="26" />
      </svg>

      <div className="ev-scene">
        <p className="ev-invited">You are invited</p>
        <button type="button" className="ev" onClick={go} disabled={phase !== 'idle'} aria-label="Open the wedding invitation">
          <div className="ev-body">
            <div className="ev-card" style={{clipPath: clips.card}}>
              <div className="ev-card-in">
                {w.bismillah && <div className="ev-card-ar" lang="ar">بسم الله الرحمن الرحيم</div>}
                <div className="ev-card-names">{w.groom} &amp; {w.bride}’s</div>
                <div className="ev-card-line">new beginning</div>
              </div>
            </div>
            <div className="ev-shell">
              <div className="ev-back" />
              <div className="ev-pocket">
                <svg viewBox="0 0 136 100" preserveAspectRatio="none" aria-hidden>
                  <path d="M0 0L68 47L136 0V100H0Z" fill="url(#ev-pocket-fill)" />
                  <rect width="136" height="100" filter="url(#ev-paper-noise)" clipPath="url(#ev-pocket-clip)" opacity=".5" />
                  <path d="M0 0L68 47L136 0" fill="none" stroke="#d9cfbd" strokeWidth=".45" vectorEffect="non-scaling-stroke" />
                  <path d="M3 99L46 60H90L133 99" fill="none" stroke="#e2d9c8" strokeWidth=".45" vectorEffect="non-scaling-stroke" />
                </svg>
              </div>
              <div className="ev-flap-shadow" style={{clipPath: clips.flap}} />
              <div className="ev-flap">
                <div className="ev-flap-out" style={{clipPath: clips.flap}} />
                <div className="ev-flap-in" style={{clipPath: clips.flap}} />
              </div>
            </div>
            <div className="ev-seal">
              <span className="ev-seal-half l"><Seal /></span>
              <span className="ev-seal-half r"><Seal /></span>
            </div>
          </div>
        </button>
        <p className="ev-hint">Tap the seal to open</p>
      </div>
    </motion.div>
  )
}