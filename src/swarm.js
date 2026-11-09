// Butterfly heart swarm, ported from the original banner animation.
const HALF_W = 1.15, HALF_H = 1.15, CENTER_Y = -0.25, EX_RX = 0.72, EX_RY = 0.28
const heartInside = (x, y) => Math.pow(x * x + y * y - 1, 3) - x * x * y * y * y < 0
function heartEdgeRadius(a) {
  const c = Math.cos(a), s = Math.sin(a)
  let lo = 0, hi = 2
  for (let i = 0; i < 20; i++) { const m = (lo + hi) / 2; heartInside(c * m, s * m) ? (lo = m) : (hi = m) }
  return lo
}
function heartSample() {
  for (let i = 0; i < 300; i++) {
    let x, y
    if (Math.random() < 0.58) {
      const a = Math.random() * Math.PI * 2, r = heartEdgeRadius(a) * (0.82 + Math.random() * 0.18)
      x = Math.cos(a) * r; y = Math.sin(a) * r
    } else {
      x = (Math.random() * 2 - 1) * HALF_W; y = (Math.random() * 2 - 1) * HALF_H + CENTER_Y
      if (!heartInside(x, y - CENTER_Y)) continue
    }
    const d2 = (x / EX_RX) ** 2 + ((y - CENTER_Y) / EX_RY) ** 2   // keep a hole in the middle for the date
    if (d2 < 1) { if (d2 < 0.5) continue; if (Math.random() > d2) continue }
    return {x, y}
  }
  return {x: 1, y: 0.4}
}
const f = (n, u = '') => n.toFixed(1) + u
export function makeSwarm(CW, CH, total, classic = true) {
  const k = classic ? 0.48 : 0.42
  const SCALE = Math.min((CW * k) / HALF_W, (CH * k) / HALF_H)
  return Array.from({length: total}, () => {
    const p = heartSample()
    const x = p.x * SCALE + (Math.random() - 0.5) * 4, y = -(p.y - CENTER_Y) * SCALE + (Math.random() - 0.5) * 4
    const ia = Math.random() * Math.PI * 2, id = 280 + Math.random() * 520
    const fd = 1.8 + Math.random() * 1.6
    const base = Math.abs(x) < 1 && Math.abs(y) < 1 ? Math.random() * Math.PI * 2 : Math.atan2(y, x)
    const sA = base + (Math.random() - 0.5) * 1.1, sD = 420 + Math.random() * 880
    return {
      '--x': f(x, 'px'), '--y': f(y, 'px'),
      '--xi': f(Math.cos(ia) * id, 'px'), '--yi': f(Math.sin(ia) * id, 'px'),
      '--sc': (classic ? 0.55 + Math.random() * 0.75 : 0.75 + Math.random() * 0.45).toFixed(2),
      '--fd': fd.toFixed(2) + 's', '--fdel': (-Math.random() * fd).toFixed(2) + 's',
      '--sx': f(Math.cos(sA) * sD, 'px'), '--sy': f(Math.sin(sA) * sD * 0.85 - 200, 'px'),
      '--sd': (Math.random() * 0.55).toFixed(2) + 's', '--rot': f((Math.random() - 0.5) * 90, 'deg'),
      '--in': (Math.random() * 0.7).toFixed(2) + 's',
      '--wing-bg': Math.random() > 0.55
        ? 'radial-gradient(ellipse at 40% 45%,#fbeec6 0%,#e0c78a 40%,#ad8548 75%,#6b4d1e 100%)'
        : 'radial-gradient(ellipse at 40% 45%,#f7e2b6 0%,#d9b876 40%,#a17d3c 75%,#5c451c 100%)'
    }
  })
}
