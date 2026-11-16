import {Component, useEffect, useMemo, useRef, useState} from 'react'
import {AnimatePresence, motion, useScroll, useSpring} from 'framer-motion'
import {makeSwarm} from './swarm'
import Rings from './Rings'
import {wedding as w} from './config'

const ease = [0.22, 1, 0.36, 1]

// If the 3D rings fail to load (slow network, blocked CDN), hide them instead of blanking the whole page.
class SafeBox extends Component {
  state = {failed: false}
  static getDerivedStateFromError() { return {failed: true} }
  render() { return this.state.failed ? null : this.props.children }
}
const target = new Date(`${w.date}T${w.time24 || '00:00'}:00${w.offset}`)
const fmt = (o) => new Intl.DateTimeFormat('en-GB', {timeZone: w.timezone, ...o}).format(target)
const full = `${w.groom} & ${w.bride}`
const STAR_PARTICLES = Array.from({length: 42}, (_, i) => ({
  left: `${(i * 47) % 100}%`,
  top: `${(i * 71) % 100}%`,
  '--star-size': `${1 + (i % 3) * 0.6}px`,
  '--star-duration': `${9 + (i % 7) * 1.5}s`,
  '--star-delay': `${-((i * 3) % 18)}s`,
  '--star-drift': `${i % 2 ? 75 : -75}px`
}))

const shuffle = (items) => {
  const shuffled = [...items]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

const Reveal = ({children, delay = 0, className}) => (
  <motion.div className={className} initial={{opacity: 0, y: 40, filter: 'blur(6px)'}}
    whileInView={{opacity: 1, y: 0, filter: 'blur(0px)'}} viewport={{once: true, margin: '-80px'}}
    transition={{duration: 1, delay, ease}}>{children}</motion.div>
)

const Letters = ({text, delay = 0.6}) => (
  <span aria-label={text}>
    {[...text].map((c, i) => (
      <motion.span key={i} aria-hidden initial={{opacity: 0, y: '70%'}} animate={{opacity: 1, y: 0}}
        transition={{delay: delay + i * 0.05, duration: 0.9, ease}} style={{display: 'inline-block', whiteSpace: 'pre'}}>{c}</motion.span>
    ))}
  </span>
)

function Envelope({onStart, onDone}) {
  const [opening, setOpening] = useState(false)
  const dust = useMemo(() => Array.from({length: 26}, () => ({left: Math.random() * 100 + '%', '--s': 2 + Math.random() * 3 + 'px', '--d': 7 + Math.random() * 8 + 's', '--dl': -Math.random() * 12 + 's', '--dx': Math.random() * 60 - 30 + 'px'})), [])
  const go = () => {
    if (opening) return
    setOpening(true); onStart()
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches
    setTimeout(onDone, reduce ? 250 : 2600)
  }
  const short = `${fmt({day: '2-digit'})} · ${fmt({month: '2-digit'})} · ${fmt({year: 'numeric'})}`
  return (
    <motion.div id="intro" exit={{opacity: 0, scale: 1.04}} transition={{duration: 1.1}}>
      <div className="dust" aria-hidden>{dust.map((d, i) => <i key={i} style={d} />)}</div>
      <div className="env-scene">
        <motion.p className="invited" initial={{opacity: 0, y: -10}} animate={{opacity: opening ? 0 : 1, y: 0}} transition={{duration: 1.2, delay: 0.2}}>You are invited</motion.p>
        <motion.div initial={{opacity: 0, y: 40, scale: 0.94}} animate={{opacity: 1, y: 0, scale: 1}} transition={{duration: 1.3, ease}}>
          <div className={`envelope-wrap ${opening ? 'opening' : ''}`} role="button" tabIndex={0} aria-label="Open the wedding invitation"
            onClick={go} onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), go())}>
            <div className="envelope">
              <div className="env-back" />
              <div className="env-letter"><div className="letter-inner">
                {w.bismillah && <div className="letter-ar">بسم الله الرحمن الرحيم</div>}
                <div className="letter-monogram">{w.groom[0]} <em>&amp;</em> {w.bride[0]}</div>
                <div className="letter-ornament">✦ ✦ ✦</div>
                <div className="letter-names">{full}</div>
                <div className="letter-date">{short}</div>
              </div></div>
              <div className="env-front" />
              <div className="env-foil"><span>The Wedding of</span><b>{full}</b></div>
              <div className="env-flap" />
              <div className="env-seal"><span>{w.groom[0]}<em>&amp;</em>{w.bride[0]}</span></div>
            </div>
          </div>
        </motion.div>
        <motion.p className="touch-hint" initial={{opacity: 0}} animate={{opacity: opening ? 0 : 1}} transition={{delay: 1}}>Touch the seal to open</motion.p>
      </div>
    </motion.div>
  )
}

// function Envelope({onStart, onDone}) {
//   const [opening, setOpening] = useState(false)
//   const dust = useMemo(() => Array.from({length: 26}, () => ({left: Math.random() * 100 + '%', '--s': 2 + Math.random() * 3 + 'px', '--d': 7 + Math.random() * 8 + 's', '--dl': -Math.random() * 12 + 's', '--dx': Math.random() * 60 - 30 + 'px'})), [])
//   const go = () => {
//     if (opening) return
//     setOpening(true); onStart()
//     const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches
//     setTimeout(onDone, reduce ? 250 : 2600)
//   }
//   const short = `${fmt({day: '2-digit'})} · ${fmt({month: '2-digit'})} · ${fmt({year: 'numeric'})}`
//   return (
//     <motion.div id="intro" exit={{opacity: 0, scale: 1.04}} transition={{duration: 1.1}}>
//       <div className="dust" aria-hidden>{dust.map((d, i) => <i key={i} style={d} />)}</div>
//       <div className="env-scene">
//         <motion.p className="invited" initial={{opacity: 0, y: -10}} animate={{opacity: opening ? 0 : 1, y: 0}} transition={{duration: 1.2, delay: 0.2}}>You are invited</motion.p>
//         <motion.div initial={{opacity: 0, y: 40, scale: 0.94}} animate={{opacity: 1, y: 0, scale: 1}} transition={{duration: 1.3, ease}}>
//           <div className={`envelope-wrap ${opening ? 'opening' : ''}`} role="button" tabIndex={0} aria-label="Open the wedding invitation"
//             onClick={go} onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), go())}>
//             <div className="envelope">
//               <div className="env-back" />
//               <div className="env-letter"><div className="letter-inner">
//                 {w.bismillah && <div className="letter-ar">بسم الله الرحمن الرحيم</div>}
//                 <div className="letter-monogram">{w.groom[0]} <em>&amp;</em> {w.bride[0]}</div>
//                 <div className="letter-ornament">✦ ✦ ✦</div>
//                 <div className="letter-names">{full}</div>
//                 <div className="letter-date">{short}</div>
//               </div></div>
//               <div className="env-front" />
//               <div className="env-foil"><span>The Wedding of</span><b>{full}</b></div>
//               <div className="env-flap" />
//               <div className="env-seal"><span>{w.groom[0]}<em>&amp;</em>{w.bride[0]}</span></div>
//             </div>
//           </div>
//         </motion.div>
//         <motion.p className="touch-hint" initial={{opacity: 0}} animate={{opacity: opening ? 0 : 1}} transition={{delay: 1}}>Touch the seal to open</motion.p>
//       </div>
//     </motion.div>
//   )
// }

// Realistic butterfly colours: [light, mid, deep] wing tones. Blue by default; add or change rows freely.
// Realistic butterfly colours: [light, mid, deep] wing tones. Blue by default; add or change rows freely.
const PAL = [['#8fe3ff', '#2aa6f0', '#0b55b8'], ['#a9d8ff', '#4a8ff2', '#1b3fa8'], ['#7fe0f0', '#1fa0d8', '#0a5f9e']]
const VAR = [0, 1, 0, 2, 0, 1, 2]
const SPARKS = Array.from({length: 20}, (_, i) => { const a = (i / 20) * Math.PI * 2, d = 90 + (i % 3) * 45; return {'--dx': Math.cos(a) * d + 'px', '--dy': Math.sin(a) * d * 0.8 + 'px', '--sd': (i % 5) * 0.06 + 's'} })

function ButterflyDate() {
  const classic = w.butterflyStyle === 'classic'
  const box = useRef(), timers = useRef([])
  const [bugs, setBugs] = useState([])
  const [phase, setPhase] = useState('idle') // idle -> gathered -> scattering
  const [revealed, setRevealed] = useState(false)
  useEffect(() => {
    const {clientWidth: cw, clientHeight: ch} = box.current
    setBugs(makeSwarm(cw || 440, ch || 340, classic ? (innerWidth < 700 ? 260 : 380) : (innerWidth < 700 ? 110 : 165), classic))
    const id = requestAnimationFrame(() => requestAnimationFrame(() => setPhase('gathered')))
    return () => { cancelAnimationFrame(id); timers.current.forEach(clearTimeout) }
  }, [])
  const scatter = () => {
    if (phase === 'scattering' || revealed) return
    setPhase('scattering')
    const revealDelay = matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 800
    timers.current.push(setTimeout(() => setRevealed(true), revealDelay), setTimeout(() => setBugs([]), 2900))
  }
  return (
    <div className={`stage ${classic ? 'classic' : ''} ${phase === 'scattering' ? 'done' : ''}`} role="button" tabIndex={0} aria-label="Touch the butterflies to reveal the wedding date"
      onClick={scatter} onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), scatter())}>
      <div className="cloud" ref={box}>
        <div className="swarm" aria-hidden>
          <svg width="0" height="0" style={{position: 'absolute'}}><defs>
            {PAL.map((p, k) => (
              <radialGradient key={k} id={`wg${k}`} cx="0.95" cy="0.45" r="1" gradientUnits="objectBoundingBox">
                <stop offset="0" stopColor={p[0]} /><stop offset=".45" stopColor={p[1]} /><stop offset="1" stopColor={p[2]} />
              </radialGradient>
            ))}
            {PAL.map((p, k) => (
              <g key={k} id={`wing${k}`}>
                {/* forewing + hindwing with a black rim, black veins and white edge spots */}
                <path d="M29 17C24 9 14 3 4.5 3.8 1.2 4.2.6 7 2 9.6 3.8 14 6 19 9 22.8 14 25 22 24 29 21Z" fill={`url(#wg${k})`} stroke="#10141c" strokeWidth="2.2" strokeLinejoin="round" />
                <path d="M29 22C22 23.6 14.5 26 10.4 30.8 7.4 35.6 8.8 41.8 13.8 43 18.8 44.2 24 39.4 26.8 33.4 28.4 29.4 29 25.6 29 22Z" fill={`url(#wg${k})`} stroke="#10141c" strokeWidth="2.2" strokeLinejoin="round" />
                <path d="M29 18 7 6.2M29 19 4.4 10.4M28.4 20 5.6 14.6M27.6 21 8.4 19.6M22 21.4 13 9M29 23 12.2 32.4M29 24.4 11.4 38M28.4 26.4 16.4 41.8M28 28.6 22 40" stroke="#10141c" strokeWidth=".75" strokeLinecap="round" fill="none" />
                <g fill="#fff">
                  <circle cx="5.2" cy="6.2" r=".7" /><circle cx="3.4" cy="9" r=".6" /><circle cx="4.6" cy="12.4" r=".6" /><circle cx="6.2" cy="15.8" r=".6" /><circle cx="7.8" cy="19.4" r=".6" />
                  <circle cx="9.4" cy="4.6" r=".6" /><circle cx="13.6" cy="4.2" r=".55" /><circle cx="18" cy="5.6" r=".5" />
                  <circle cx="10.6" cy="34" r=".6" /><circle cx="10.8" cy="38.2" r=".6" /><circle cx="13.2" cy="41.6" r=".6" /><circle cx="17" cy="42.2" r=".55" /><circle cx="21" cy="40" r=".55" />
                </g>
              </g>
            ))}
          </defs></svg>
          {bugs.map((st, i) => (
            <div key={i} className={`bfly ${phase === 'gathered' ? 'gathered' : phase === 'scattering' ? 'scattering' : ''}`} style={st}>
              {classic ? <><span className="wing l" /><span className="wing r" /><span className="body" /></> : (
              <svg viewBox="0 0 60 48" width="40" height="32">
                <g className="wl"><use href={`#wing${VAR[i % 7]}`} /></g>
                <g transform="translate(60 0) scale(-1 1)"><g className="wl"><use href={`#wing${VAR[i % 7]}`} /></g></g>
                <ellipse cx="30" cy="19.6" rx="1.7" ry="3.8" fill="#151a24" /><ellipse cx="30" cy="30.5" rx="1.3" ry="8.2" fill="#151a24" />
                <circle cx="30" cy="14.6" r="1.6" fill="#151a24" />
                <path d="M29.4 13.4C28 9 26.4 6 24.6 4.6M30.6 13.4C32 9 33.6 6 35.4 4.6" stroke="#151a24" strokeWidth=".6" fill="none" strokeLinecap="round" />
                <circle cx="24.5" cy="4.5" r=".8" fill="#151a24" /><circle cx="35.5" cy="4.5" r=".8" fill="#151a24" />
              </svg>
              )}
            </div>
          ))}
        </div>
        {phase === 'scattering' && <div className="sparks" aria-hidden>{SPARKS.map((sp, i) => <i key={i} style={sp} />)}</div>}
        <motion.div className={`hero-date ${revealed ? 'revealed' : ''}`} animate={revealed ? {opacity: 1, filter: 'blur(0px)', scale: 1, y: 0} : {opacity: 0, filter: 'blur(14px)', scale: 0.82, y: 10}} transition={{duration: 1.2, ease}}>
          <span className="dline"><i />✦<i /></span>
          <span className="dow">{fmt({weekday: 'long'})}</span>
          <span className="dmain">{fmt({day: 'numeric', month: 'long', year: 'numeric'})}</span>
          <span className="dline"><i />✦<i /></span>
        </motion.div>
      </div>
      <p className={`hint ${phase === 'scattering' ? 'hide' : ''}`}>✦ Touch the butterflies ✦</p>
    </div>
  )
}

function Countdown() {
  const calc = () => { const ms = Math.max(0, target - Date.now()); return [ms / 864e5, (ms / 36e5) % 24, (ms / 6e4) % 60, (ms / 1e3) % 60].map(Math.floor) }
  const [t, setT] = useState(calc)
  useEffect(() => { const id = setInterval(() => setT(calc()), 1000); return () => clearInterval(id) }, [])
  if (target - Date.now() <= 0) return <p className="today">Today is the day ✧</p>
  return (
    <div className="count">
      {['Days', 'Hours', 'Minutes', 'Seconds'].map((l, i) => (
        <div key={l}>
          <AnimatePresence mode="popLayout"><motion.strong key={t[i]} initial={{y: -16, opacity: 0}} animate={{y: 0, opacity: 1}} exit={{y: 16, opacity: 0}} transition={{duration: 0.35}}>{String(t[i]).padStart(2, '0')}</motion.strong></AnimatePresence>
          <span>{l}</span>
        </div>
      ))}
    </div>
  )
}

const un = (id, wd) => id.startsWith('/') ? id : `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${wd}&q=85`

function Gallery() {
  const g = w.gallery, albums = g.albums
  const [tab, setTab] = useState(0), [view, setView] = useState(null)
  const albumsPhotos = useMemo(() => [
    w.photos.map(([id, cap, tall]) => ({s: un(id, 900), b: un(id, 1400), cap, tall})),
    shuffle(w.weddingPhotos.map(([id, cap]) => ({s: un(id, 900), b: un(id, 1400), cap}))).slice(0, 6)
  ], [])
  const album = albums[tab], items = albumsPhotos[tab] || [], shown = items.slice(0, 9)
  useEffect(() => setView(null), [tab])
  useEffect(() => {
    const k = (e) => {
      if (view === null) return
      if (e.key === 'Escape') setView(null)
      if (e.key === 'ArrowRight') setView((v) => (v + 1) % items.length)
      if (e.key === 'ArrowLeft') setView((v) => (v - 1 + items.length) % items.length)
    }
    addEventListener('keydown', k); return () => removeEventListener('keydown', k)
  }, [view, items])
  const step = (d) => (e) => { e.stopPropagation(); setView((v) => (v + d + items.length) % items.length) }
  return (
    <section className="sec" id="gallery">
      <Reveal><p className="small">A few moments to cherish</p><h2>Our little <em>gallery</em></h2></Reveal>
      {albums.length > 1 && <div className="tabs">{albums.map((a, i) => <button key={a.label} className={i === tab ? 'sel' : ''} onClick={() => setTab(i)}>{a.label}</button>)}</div>}
      <AnimatePresence mode="wait">
        <motion.div key={tab} initial={{opacity: 0}} animate={{opacity: 1}} exit={{opacity: 0}} transition={{duration: 0.4}}>
          {!items.length ? <p className="copy">{album.empty}</p> : tab === 1 ? (
            <div className="gallery-marquee" aria-label="Wedding day photo slider">
              <div className="gallery-track">
                {[false, true].map((clone) => (
                  <div className="gallery-group" key={String(clone)} aria-hidden={clone || undefined}>
                    {items.map((photo, i) => (
                      <button key={`${clone}-${photo.s}`} type="button" className="gallery-photo" onClick={() => !clone && setView(i)}
                        tabIndex={clone ? -1 : 0} aria-label={`Open ${photo.cap}`}>
                        <img src={photo.s} alt={photo.cap || 'Wedding photo'} loading="lazy" referrerPolicy="no-referrer" />
                        {photo.cap && <span>{photo.cap}</span>}
                      </button>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="grid">
              {shown.map((p, i) => (
                <motion.button key={p.s} className={`ph ${p.tall ? 'tall' : ''}`} onClick={() => setView(i)} aria-label="Open photo"
                  initial={{opacity: 0, scale: 0.92}} whileInView={{opacity: 1, scale: 1}} viewport={{once: true}} transition={{duration: 0.9, delay: (i % 3) * 0.12, ease}} whileHover={{y: -6}}>
                  <img src={p.s} alt={p.cap || 'Wedding photo'} loading="lazy" referrerPolicy="no-referrer" />{p.cap && <span>{p.cap}</span>}
                </motion.button>
              ))}
            </div>
          )}
        </motion.div>
      </AnimatePresence>
      <div className="btns gal-btns">
        {album.albumUrl && <a className="btn" href={album.albumUrl} target="_blank" rel="noreferrer">Open full album ↗</a>}
      </div>
      <AnimatePresence>{view !== null && items?.[view] && (
        <motion.div className="lb" onClick={() => setView(null)} initial={{opacity: 0}} animate={{opacity: 1}} exit={{opacity: 0}}>
          <motion.img key={view} src={items[view].b} alt="" referrerPolicy="no-referrer" initial={{opacity: 0, scale: 0.96}} animate={{opacity: 1, scale: 1}} />
          <button aria-label="Close">×</button>
          {items.length > 1 && <><button className="arr l" onClick={step(-1)} aria-label="Previous">‹</button><button className="arr r" onClick={step(1)} aria-label="Next">›</button></>}
        </motion.div>
      )}</AnimatePresence>
    </section>
  )
}

function Details() {
  const addCal = () => {
    const u = (d) => d.toISOString().replace(/[-:]|\.\d{3}/g, '')
    const day = w.date.replace(/-/g, ''), next = new Date(Date.UTC(...w.date.split('-').map((n, i) => (i === 1 ? n - 1 : +n))) + 864e5).toISOString().slice(0, 10).replace(/-/g, '')
    const when = w.time24 ? `DTSTART:${u(target)}\nDTEND:${u(new Date(+target + 3 * 36e5))}` : `DTSTART;VALUE=DATE:${day}\nDTEND;VALUE=DATE:${next}`
    const ics = `BEGIN:VCALENDAR\nVERSION:2.0\nBEGIN:VEVENT\nSUMMARY:Wedding of ${full}\n${when}\nLOCATION:${w.venue}, ${w.address.join(', ')}\nEND:VEVENT\nEND:VCALENDAR`
    const link = Object.assign(document.createElement('a'), {href: URL.createObjectURL(new Blob([ics], {type: 'text/calendar'})), download: 'wedding.ics'})
    link.click()
  }
  return (
    <section className="sec" id="details">
      <Reveal><p className="small">The blessed day</p><h2>Details of <em>the day</em></h2></Reveal>
      <Reveal className="card" delay={0.1}>
        <span className="orn">✦</span>
        <p className="small">{w.event.kind}</p><h3>{w.event.title}</h3>
        <div className="meta">
          <div><small>Date</small><b>{fmt({weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'})}</b></div>
          <div><small>Time</small><b>{w.timeLabel}</b></div>
          <div><small>Venue</small><b>{w.venue}</b><span>{w.address.join(', ')}</span></div>
        </div>
        <p className="copy">{w.event.blurb}</p>
        <div className="btns"><a className="btn" href={w.mapsUrl} target="_blank" rel="noreferrer">View location ↗</a><button className="btn" onClick={addCal}>Add to calendar</button></div>
      </Reveal>
    </section>
  )
}

function Families() {
  const f = [w.families?.groom, w.families?.bride]
  if (!f.every((x) => x?.parents)) return null
  return (
    <section className="sec">
      <Reveal><p className="small">With love</p><h2>The <em>families</em></h2></Reveal>
      <div className="fam">{[[f[0], w.groom], [f[1], w.bride]].map(([x, n], i) => (
        <Reveal key={n} delay={i * 0.15}><p className="small">{x.label}</p><h3>{n}</h3><p className="copy">{x.parents}</p></Reveal>
      ))}</div>
    </section>
  )
}

export default function App() {
  const [open, setOpen] = useState(false)
  const [exitIntro, setExitIntro] = useState(false)
  const [sound, setSound] = useState(false)
  const [audioError, setAudioError] = useState(false)
  const [showMusic, setShowMusic] = useState(false)
  useEffect(() => {   // bring the music button in after the landing page has settled, so it glides in once instead of stuttering
    if (!open) return
    const id = setTimeout(() => setShowMusic(true), 1200)
    return () => clearTimeout(id)
  }, [open])
  const audio = useRef(), rings = useRef()
  const {scrollYProgress: page} = useScroll()
  const bar = useSpring(page, {stiffness: 120, damping: 30})
  const {scrollYProgress: rp} = useScroll({target: rings, offset: ['start end', 'center center']})
  const ringProgress = useSpring(rp, {stiffness: 60, damping: 20})
  useEffect(() => { document.body.style.overflow = open ? '' : 'hidden' }, [open])
  const startMusic = async () => {
    if (!w.musicUrl) return
    try {
      await audio.current.play()
      setAudioError(false)
    } catch (error) {
      console.error('Unable to play the wedding music.', error)
      setAudioError(true)
    }
  }
  const toggle = async () => {
    if (!w.musicUrl || !audio.current) return
    if (!audio.current.paused) {
      audio.current.pause()
      return
    }
    try {
      await audio.current.play()
      setAudioError(false)
    } catch (error) {
      console.error('Unable to play the wedding music.', error)
      setAudioError(true)
    }
  }
  return (
    <>
      <div className="starfield" aria-hidden>{STAR_PARTICLES.map((star, i) => <i key={i} style={star} />)}</div>
      <div className="grain" aria-hidden />
      <AnimatePresence
        onExitComplete={() => {
          if (exitIntro) {
            setOpen(true)
            scrollTo({top: 0, left: 0})
          }
        }}
      >
        {!exitIntro && <Envelope onStart={startMusic} onDone={() => setExitIntro(true)} />}
      </AnimatePresence>
      {open && (
        <main>
          <motion.div className="bar" style={{scaleX: bar}} />
          <header className="nav">
            <span className="mono">{w.groom[0]} &amp; {w.bride[0]}</span>
          </header>

          <header className="hero">
            <div className="hero-in">
              {w.bismillah && <Reveal><p className="ar">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</p></Reveal>}
              <Reveal delay={0.15}><p className="small">The wedding of</p></Reveal>
              <Reveal delay={0.3}><h1 className="hname">{w.groom} <em>&amp;</em> {w.bride}</h1></Reveal>
              <Reveal delay={0.45}><p className="copy">Together with our families, we invite you to celebrate the beginning of our beautiful journey together.</p></Reveal>
            </div>
            <motion.span className="cue" animate={{y: [0, 8, 0]}} transition={{repeat: Infinity, duration: 2.4}}>Scroll ↓</motion.span>
          </header>

          {w.verse && (
            <section className="sec"><Reveal>
              <p className="ar big">{w.verse.ar}</p><div className="rule" />
              <p className="copy wide">“{w.verse.en}”</p><p className="small">{w.verse.ref}</p>
            </Reveal></section>
          )}

          <section className="sec"><Reveal><p className="small">A date to keep close</p><h2>Our <em>day</em></h2><p className="copy">A little magic is waiting for you</p></Reveal><ButterflyDate /></section>

          <section className="sec" ref={rings}>
            <Reveal><p className="small">The day we&apos;ve been waiting for</p><h2>Awaiting our <em>union</em></h2></Reveal>
            <SafeBox><div className="ring3d"><Rings progress={ringProgress} /></div></SafeBox>
            <Countdown />
          </section>

          <Details />
          <Families />
          <Gallery />

          <section className="sec"><Reveal>
            <p className="small">All our love</p><h2>Celebrate <em>with us</em></h2>
            <p className="copy">Your presence and your duas will make our day even more special.</p>
            {w.dua && <><div className="rule" /><p className="ar">{w.dua.ar}</p><p className="copy">“{w.dua.en}”</p></>}
            <p className="sign">{full}</p>
          </Reveal></section>
          <footer>With love ✳ Kozhikode · {fmt({year: 'numeric'})}</footer>
        </main>
      )}
      {w.musicUrl && (
        <motion.button
          type="button"
          className={`music-control ${sound ? 'is-playing' : ''}`}
          onClick={toggle}
          aria-label={sound ? 'Mute music' : 'Play music'}
          aria-pressed={sound}
          aria-describedby={showMusic && audioError ? 'music-error' : undefined}
          aria-hidden={!showMusic}
          tabIndex={showMusic ? 0 : -1}
          disabled={!showMusic}
          initial={false}
          style={{pointerEvents: showMusic ? 'auto' : 'none'}}
          animate={showMusic ? {opacity: 1, scale: 1} : {opacity: 0, scale: 0.85}}
          transition={{opacity: {duration: 0.8, ease: 'easeOut'}, scale: {type: 'spring', stiffness: 170, damping: 22, mass: 0.9}}}
          whileHover={showMusic ? {scale: 1.06} : undefined}
          whileTap={showMusic ? {scale: 0.94} : undefined}
        >
          <span className="music-disc" aria-hidden="true">
            {sound
              ? <span className="eq"><i /><i /><i /><i /></span>
              : <svg viewBox="0 0 32 32" focusable="false"><path className="music-note" d="M5 12.5v7h5l7 5.5V7l-7 5.5H5Z" /><path className="music-muted" d="m21 13 6 6m0-6-6 6" /></svg>}
          </span>
        </motion.button>
      )}
      {showMusic && audioError && <span id="music-error" className="music-error" role="status">Music could not be played.</span>}
      <audio
        ref={audio}
        loop
        src={w.musicUrl || undefined}
        onPlay={() => { setSound(true); setAudioError(false) }}
        onPause={() => setSound(false)}
      />
    </>
  )
}
