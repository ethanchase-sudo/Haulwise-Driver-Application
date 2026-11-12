// core.jsx — icons, shared store, primitives
const { useState, useEffect, useRef, useContext, createContext, useMemo } = React;

/* ───────── Icons (stroke, 24 grid) ───────── */
const ICON_PATHS = {
  bell: <><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></>,
  home: <><path d="M3 10.5 12 3l9 7.5"/><path d="M5 9.5V20a1 1 0 0 0 1 1h4v-6h4v6h4a1 1 0 0 0 1-1V9.5"/></>,
  logs: <><rect x="4" y="3" width="16" height="18" rx="2"/><path d="M8 8h8M8 12h8M8 16h5"/></>,
  route: <><circle cx="6" cy="19" r="2.5"/><circle cx="18" cy="5" r="2.5"/><path d="M8.5 19H17a3.5 3.5 0 0 0 0-7H7a3.5 3.5 0 0 1 0-7h8.5"/></>,
  truck: <><path d="M2 6h11v11H2z"/><path d="M13 9h4.5L21 12.5V17h-8"/><circle cx="6.5" cy="17.5" r="2"/><circle cx="17" cy="17.5" r="2"/></>,
  user: <><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/></>,
  clipboard: <><rect x="5" y="4" width="14" height="17" rx="2"/><path d="M9 4V3h6v1"/><path d="m9 13 2 2 4-4"/></>,
  folder: <><path d="M3 6.5A1.5 1.5 0 0 1 4.5 5H9l2 2.5h8.5A1.5 1.5 0 0 1 21 9v9.5a1.5 1.5 0 0 1-1.5 1.5h-15A1.5 1.5 0 0 1 3 18.5z"/></>,
  alert: <><path d="M10.3 3.9 2.4 17.5A2 2 0 0 0 4.1 20.5h15.8a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z"/><path d="M12 9v4M12 17h.01"/></>,
  chevR: <path d="m9 6 6 6-6 6"/>,
  chevL: <path d="m15 6-6 6 6 6"/>,
  chevD: <path d="m6 9 6 6 6-6"/>,
  x: <path d="M6 6l12 12M18 6 6 18"/>,
  check: <path d="m5 12.5 4.5 4.5L19 7.5"/>,
  moon: <path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z"/>,
  wheel: <><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="2.2"/><path d="M12 14.2V21M9.9 11.4 3.3 9.5M14.1 11.4l6.6-1.9"/></>,
  hardhat: <><path d="M3 18h18"/><path d="M5 18v-3a7 7 0 0 1 14 0v3"/><path d="M10 8V5h4v3"/></>,
  power: <><path d="M12 3v8"/><path d="M6.4 7.4a8 8 0 1 0 11.2 0"/></>,
  pin: <><path d="M12 21s-7-6.2-7-12a7 7 0 0 1 14 0c0 5.8-7 12-7 12z"/><circle cx="12" cy="9" r="2.5"/></>,
  nav: <path d="M3 11 21 3l-8 18-2-8z"/>,
  gps: <><circle cx="12" cy="12" r="7"/><circle cx="12" cy="12" r="2.5"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3"/></>,
  link: <><path d="M10 14a4.5 4.5 0 0 0 6.4 0l3-3a4.5 4.5 0 0 0-6.4-6.4l-1 1"/><path d="M14 10a4.5 4.5 0 0 0-6.4 0l-3 3a4.5 4.5 0 0 0 6.4 6.4l1-1"/></>,
  engine: <><path d="M4 10h3l2-3h5v3h3l2 2v5h-2v2h-3l-2-2H7v-2H4z"/><path d="M2 12v4"/></>,
  upload: <><path d="M12 15V4M7.5 8.5 12 4l4.5 4.5"/><path d="M4 15v4a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-4"/></>,
  camera: <><path d="M3 8.5A1.5 1.5 0 0 1 4.5 7h2.8L9 4.5h6L16.7 7h2.8A1.5 1.5 0 0 1 21 8.5v10a1.5 1.5 0 0 1-1.5 1.5h-15A1.5 1.5 0 0 1 3 18.5z"/><circle cx="12" cy="13" r="3.5"/></>,
  image: <><rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="9" cy="10" r="2"/><path d="m21 16-5-5-9 9"/></>,
  file: <><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5"/></>,
  clock: <><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></>,
  fuel: <><path d="M4 21V5a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v16"/><path d="M3 21h12M4 10h10"/><path d="M14 8h2a2 2 0 0 1 2 2v6a1.5 1.5 0 0 0 3 0V8l-3-3"/></>,
  receipt: <><path d="M5 3h14v18l-2.5-1.5L14 21l-2-1.5L10 21l-2.5-1.5L5 21z"/><path d="M9 8h6M9 12h6"/></>,
  shield: <><path d="M12 3 4 6v6c0 5 3.5 8 8 9 4.5-1 8-4 8-9V6z"/><path d="m9 12 2 2 4-4"/></>,
  cal: <><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/></>,
  phone: <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z"/>,
  pen: <><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"/></>,
  info: <><circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/></>,
  wrench: <path d="M14.7 6.3a4 4 0 0 0 5 5L21 13l-8 8-3-3 1.3-1.3a4 4 0 0 0-5-5L3 10l3-3 1.3 1.3a4 4 0 0 0 5-5L13 2"/>,
  disc: <><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="3"/></>,
  sun: <><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></>,
  mirror: <><rect x="5" y="4" width="14" height="10" rx="3"/><path d="M12 14v6M8 20h8"/></>,
  hitch: <><circle cx="12" cy="8" r="4"/><path d="M12 12v8M7 20h10"/></>,
  stop: <><circle cx="12" cy="12" r="9"/><path d="M8 12h8"/></>,
  box: <><path d="M3 7.5 12 3l9 4.5v9L12 21l-9-4.5z"/><path d="M3 7.5 12 12l9-4.5M12 12v9"/></>,
  scale: <><path d="M12 3v18M5 7h14M7 21h10"/><path d="m5 7-3 7a3 3 0 0 0 6 0zM19 7l-3 7a3 3 0 0 0 6 0z"/></>,
  refresh: <><path d="M20 11a8 8 0 0 0-14.5-4.5L3 9"/><path d="M3 4v5h5"/><path d="M4 13a8 8 0 0 0 14.5 4.5L21 15"/><path d="M21 20v-5h-5"/></>,
  signal: <><path d="M4 20v-3M9 20v-7M14 20V9M19 20V4"/></>,
  plus: <path d="M12 5v14M5 12h14"/>,
  history: <><path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5"/><path d="M12 7v5l3 2"/></>,
  msg: <path d="M4 5h16v11H8l-4 4z"/>,
  logout: <><path d="M15 4h4v16h-4"/><path d="M10 8l-4 4 4 4M6 12h10"/></>,
  gear: <><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/></>,
};
function Icon({ n, s = 20, w = 1.8, c = 'currentColor', style }) {
  return (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth={w}
      strokeLinecap="round" strokeLinejoin="round" style={{ flex: 'none', display: 'block', ...style }}>
      {ICON_PATHS[n]}
    </svg>
  );
}

/* ───────── Duty statuses ───────── */
const DUTY = {
  OFF: { code: 'OFF', name: 'Off Duty', short: 'Off Duty', icon: 'power', c: '#64748B', soft: '#EEF1F5' },
  SB:  { code: 'SB',  name: 'Sleeper Berth', short: 'Sleeper', icon: 'moon', c: '#7A5AF8', soft: '#EFEBFE' },
  D:   { code: 'D',   name: 'Driving', short: 'Driving', icon: 'wheel', c: '#2F6BFF', soft: '#E8EFFF' },
  ON:  { code: 'ON',  name: 'On Duty (Not Driving)', short: 'On Duty', icon: 'hardhat', c: '#0E9F9A', soft: '#E0F5F4' },
};
const DUTY_ORDER = ['OFF', 'SB', 'D', 'ON'];

/* ───────── time helpers (minutes since midnight) ───────── */
const NOW_MIN = 9 * 60 + 21; // 9:21 AM (illustrative "now")
const fmtClock = (m) => {
  const h = Math.floor(m / 60) % 24, mm = m % 60;
  const ap = h >= 12 ? 'PM' : 'AM'; const h12 = ((h + 11) % 12) + 1;
  return `${h12}:${String(mm).padStart(2, '0')} ${ap}`;
};
const fmt24 = (m) => `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`;
const fmtDur = (m) => `${String(Math.floor(m / 60)).padStart(2, '0')}h ${String(m % 60).padStart(2, '0')}m`;

/* Base log for today — illustrative */
const BASE_LOG = [
  { s: 0, e: 300, st: 'SB', loc: 'Love\'s Travel Stop, Dallas, TX', note: '' },
  { s: 300, e: 330, st: 'OFF', loc: 'Love\'s Travel Stop, Dallas, TX', note: '' },
  { s: 330, e: 345, st: 'ON', loc: 'DFW Distribution Ctr, Dallas, TX', note: 'Pre-trip inspection' },
  { s: 345, e: 420, st: 'ON', loc: 'DFW Distribution Ctr, Dallas, TX', note: 'Loading · BOL 88412' },
  { s: 420, e: 552, st: 'D', loc: 'I-30 E, Dallas, TX', note: '' },
  { s: 552, e: 566, st: 'ON', loc: 'Pilot #412, Mt Pleasant, TX', note: 'Fuel' },
];

/* ───────── Store ───────── */
const StoreCtx = createContext(null);
function StoreProvider({ children }) {
  const [duty, setDutyRaw] = useState('ON');
  const [log, setLog] = useState(BASE_LOG);
  const [certified, setCertified] = useState(false);
  const [inspections, setInspections] = useState([
    { id: 'DVIR-1107', type: 'Post-trip', when: 'Nov 12 · 7:48 PM', result: 'No defects', ok: true },
    { id: 'DVIR-1102', type: 'Pre-trip', when: 'Nov 12 · 5:10 AM', result: 'No defects', ok: true },
    { id: 'DVIR-1096', type: 'Post-trip', when: 'Nov 11 · 6:22 PM', result: 'Defect · L marker lamp (repaired)', ok: false },
  ]);
  const [preTripDone, setPreTripDone] = useState(false);
  const [docs, setDocs] = useState({ bol: null, fuel: null, delivery: null, vehicle: { name: 'Registration_2048.pdf', at: 'Oct 02' } });
  const [tickets, setTickets] = useState([]);
  const [minute, setMinute] = useState(NOW_MIN);
  // demo clock: 1 simulated minute every 2s so new duty segments visibly grow
  useEffect(() => { const id = setInterval(() => setMinute((m) => Math.min(m + 1, 1439)), 2000); return () => clearInterval(id); }, []);

  const setDuty = (st) => {
    if (st === duty) return;
    const t = minute;
    setLog((L) => {
      const prev = L[L.length - 1];
      const next = L.slice(0, -1).concat([{ ...prev, e: t }]);
      next.push({ s: t, e: t, st, loc: 'Pilot #412, Mt Pleasant, TX', note: 'Driver status change' });
      return next;
    });
    setDutyRaw(st);
  };
  // the live (current) segment always ends at "now"
  const liveLog = log.map((x, i) => (i === log.length - 1 ? { ...x, e: Math.max(x.e, minute) } : x));
  const totals = useMemo(() => {
    const t = { OFF: 0, SB: 0, D: 0, ON: 0 };
    liveLog.forEach((x) => (t[x.st] += x.e - x.s));
    return t;
  }, [liveLog]);

  const value = { duty, setDuty, log: liveLog, totals, certified, setCertified, inspections, setInspections,
    preTripDone, setPreTripDone, docs, setDocs, tickets, setTickets, minute };
  return <StoreCtx.Provider value={value}>{children}</StoreCtx.Provider>;
}
const useStore = () => useContext(StoreCtx);

/* ───────── Ring ───────── */
function Ring({ size = 132, stroke = 12, pct, color, track = '#EEF1F6', children }) {
  const r = (size - stroke) / 2, C = 2 * Math.PI * r;
  return (
    <div className="ring-wrap" style={{ width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={size / 2} cy={size / 2} r={r} stroke={track} strokeWidth={stroke} fill="none" />
        <circle cx={size / 2} cy={size / 2} r={r} stroke={color} strokeWidth={stroke} fill="none"
          strokeDasharray={C} strokeDashoffset={C * (1 - pct)} strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset .8s cubic-bezier(.2,.8,.2,1)' }} />
      </svg>
      <div className="rc">{children}</div>
    </div>
  );
}

/* ───────── Status bar ───────── */
function StatusBar({ dark = true }) {
  const c = dark ? '#fff' : '#0C1A33';
  return (
    <div className="sbar" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '19px 30px 0 40px', color: c }}>
      <span style={{ fontWeight: 600, fontSize: 16, letterSpacing: '-.01em' }}>9:21</span>
      <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
        <svg width="18" height="12" viewBox="0 0 19 12"><rect x="0" y="7.5" width="3.2" height="4.5" rx="0.7" fill={c}/><rect x="4.8" y="5" width="3.2" height="7" rx="0.7" fill={c}/><rect x="9.6" y="2.5" width="3.2" height="9.5" rx="0.7" fill={c}/><rect x="14.4" y="0" width="3.2" height="12" rx="0.7" fill={c}/></svg>
        <svg width="16" height="12" viewBox="0 0 17 12"><path d="M8.5 3.2C10.8 3.2 12.9 4.1 14.4 5.6L15.5 4.5C13.7 2.7 11.2 1.5 8.5 1.5C5.8 1.5 3.3 2.7 1.5 4.5L2.6 5.6C4.1 4.1 6.2 3.2 8.5 3.2Z" fill={c}/><path d="M8.5 6.8C9.9 6.8 11.1 7.3 12 8.2L13.1 7.1C11.8 5.9 10.2 5.1 8.5 5.1C6.8 5.1 5.2 5.9 3.9 7.1L5 8.2C5.9 7.3 7.1 6.8 8.5 6.8Z" fill={c}/><circle cx="8.5" cy="10.5" r="1.5" fill={c}/></svg>
        <svg width="26" height="13" viewBox="0 0 27 13"><rect x="0.5" y="0.5" width="23" height="12" rx="3.5" stroke={c} strokeOpacity="0.4" fill="none"/><rect x="2" y="2" width="16" height="9" rx="2" fill={c}/><path d="M25 4.5V8.5C25.8 8.2 26.5 7.2 26.5 6.5C26.5 5.8 25.8 4.8 25 4.5Z" fill={c} fillOpacity="0.4"/></svg>
      </div>
    </div>
  );
}

/* ───────── Sheet ───────── */
function Sheet({ open, onClose, title, sub, full, footer, children, icon }) {
  const [mounted, setMounted] = useState(open);
  const [shown, setShown] = useState(false);
  useEffect(() => {
    if (open) { setMounted(true); requestAnimationFrame(() => requestAnimationFrame(() => setShown(true))); }
    else { setShown(false); const t = setTimeout(() => setMounted(false), 340); return () => clearTimeout(t); }
  }, [open]);
  if (!mounted) return null;
  return (
    <>
      <div className={'scrim' + (shown ? ' in' : '')} onClick={onClose} />
      <div className={'sheet' + (shown ? ' in' : '') + (full ? ' full' : '')}>
        <div className="sheet-grab" />
        <div className="sheet-h">
          {icon}
          <div style={{ flex: 1 }}>
            <h3>{title}</h3>
            {sub && <div className="sub">{sub}</div>}
          </div>
          <button className="x tap" onClick={onClose} aria-label="Close"><Icon n="x" s={16} /></button>
        </div>
        <div className="sheet-b" style={{ flex: 1 }}>{children}</div>
        {footer}
      </div>
    </>
  );
}

function SheetIcon({ n, c = '#2F6BFF', bg = '#E8EFFF' }) {
  return <div style={{ width: 40, height: 40, borderRadius: 12, background: bg, color: c, display: 'grid', placeItems: 'center', flex: 'none' }}><Icon n={n} s={20} /></div>;
}

function Disclaimer({ children }) {
  return (
    <div className="disclaim">
      <Icon n="info" s={15} style={{ marginTop: 1 }} />
      <div>{children || <>Prototype data shown for illustration only. Values are not verified HOS calculations, and this concept is not an FMCSA‑registered ELD.</>}</div>
    </div>
  );
}

function Success({ title, children, id }) {
  return (
    <div className="success">
      <div className="big"><div><Icon n="check" s={28} w={2.6} /></div></div>
      <h4>{title}</h4>
      <p>{children}</p>
      {id && <div className="mono" style={{ marginTop: 12, fontSize: 12, padding: '6px 10px', borderRadius: 8, background: '#fff', border: '1px solid var(--line)', color: 'var(--ink-2)' }}>{id}</div>}
    </div>
  );
}

/* ───────── RODS graph (FMCSA-style 24h grid) ───────── */
function RodsGraph({ log, height = 132, compact = false }) {
  const W = 1000, rowH = 100 / 4;
  const labelW = compact ? 0 : 0;
  const rowOf = { OFF: 0, SB: 1, D: 2, ON: 3 };
  const x = (m) => (m / 1440) * W;
  const y = (st) => (rowOf[st] + 0.5) * rowH;
  let d = '';
  log.forEach((seg, i) => {
    const yy = y(seg.st);
    if (i === 0) d += `M${x(seg.s)},${yy}`;
    else d += `L${x(seg.s)},${yy}`;
    d += `L${x(seg.e)},${yy}`;
  });
  const last = log[log.length - 1];
  return (
    <div style={{ display: 'flex', gap: 6 }}>
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-around', height, paddingTop: 0 }}>
        {DUTY_ORDER.map((k) => (
          <div key={k} className="mono" style={{ fontSize: 9.5, fontWeight: 600, color: DUTY[k].c, width: 24, letterSpacing: '.03em' }}>{k}</div>
        ))}
      </div>
      <div style={{ flex: 1, position: 'relative' }}>
        <svg viewBox={`0 0 ${W} 100`} preserveAspectRatio="none" style={{ width: '100%', height, display: 'block', borderRadius: 8, background: '#FAFBFD', border: '1px solid var(--line)' }}>
          {[1, 2, 3].map((r) => <line key={r} x1="0" x2={W} y1={r * rowH} y2={r * rowH} stroke="#E4E8F0" strokeWidth="1" vectorEffect="non-scaling-stroke" />)}
          {Array.from({ length: 23 }).map((_, h) => (
            <line key={h} x1={x((h + 1) * 60)} x2={x((h + 1) * 60)} y1="0" y2="100" stroke={(h + 1) % 6 === 0 ? '#D5DCE7' : '#EEF1F6'} strokeWidth="1" vectorEffect="non-scaling-stroke" />
          ))}
          {/* future region */}
          <rect x={x(last.e)} y="0" width={W - x(last.e)} height="100" fill="url(#hatch)" opacity=".6" />
          <defs>
            <pattern id="hatch" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
              <line x1="0" y1="0" x2="0" y2="8" stroke="#E4E8F0" strokeWidth="3" />
            </pattern>
          </defs>
          {log.map((seg, i) => (
            <rect key={i} x={x(seg.s)} y={rowOf[seg.st] * rowH + 4} width={Math.max(0, x(seg.e) - x(seg.s))} height={rowH - 8} fill={DUTY[seg.st].c} opacity=".14" />
          ))}
          <path d={d} fill="none" stroke="#0C1A33" strokeWidth="2.2" vectorEffect="non-scaling-stroke" strokeLinejoin="round" />
          <line x1={x(last.e)} x2={x(last.e)} y1="0" y2="100" stroke="#2F6BFF" strokeWidth="1.5" strokeDasharray="3 3" vectorEffect="non-scaling-stroke" />
        </svg>
        <div style={{ position: 'absolute', left: `${(last.e / 1440) * 100}%`, top: y(last.st) / 100 * height, width: 10, height: 10, marginLeft: -5, marginTop: -5, borderRadius: '50%', background: '#2F6BFF', boxShadow: '0 0 0 3px rgba(47,107,255,.25)' }} />
        <div className="mono" style={{ display: 'flex', justifyContent: 'space-between', fontSize: 9.5, color: 'var(--ink-3)', marginTop: 5 }}>
          <span>M</span><span>6</span><span>N</span><span>18</span><span>M</span>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { Icon, DUTY, DUTY_ORDER, NOW_MIN, fmtClock, fmt24, fmtDur, StoreProvider, useStore,
  Ring, StatusBar, Sheet, SheetIcon, Disclaimer, Success, RodsGraph });
