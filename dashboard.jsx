// dashboard.jsx — Screen 1: Driver Dashboard & ELD Overview

const HOS = {
  drive: { label: 'Driving', rem: 7 * 60 + 24, limit: 11 * 60, c: '#2F6BFF', rule: '11-hour driving limit' },
  duty:  { label: 'On-Duty', rem: 9 * 60 + 15, limit: 14 * 60, c: '#0E9F9A', rule: 'On-duty time available' },
  shift: { label: '14-hr Shift', rem: 10 * 60 + 30, limit: 14 * 60, c: '#7A5AF8', rule: '14-hour driving window' },
  cycle: { label: '70-hr Cycle', rem: 42 * 60 + 18, limit: 70 * 60, c: '#F08C1A', rule: '70 hours / 8 days' },
};
const hosColor = (rem, limit) => (rem / limit < 0.12 ? '#E5484D' : rem / limit < 0.3 ? '#F08C1A' : null);

function Header({ children, tall }) {
  return <div className={'hdr' + (tall ? ' tall' : '')}>{children}</div>;
}

function BrandRow({ onBell, title }) {
  return (
    <div className="brand-row">
      {title ? <div style={{ fontSize: 22, fontWeight: 600, letterSpacing: '-.02em' }}>{title}</div> :
        <div className="brand"><div className="brand-mark"><i /></div>Haulwise<small>ELD</small></div>}
      <button className="icon-btn" onClick={onBell} aria-label="Notifications">
        <Icon n="bell" s={19} c="#E3EAF7" /><span className="dot" />
      </button>
    </div>
  );
}

function DriverRow({ onProfile, compact }) {
  const { duty } = useStore();
  const D = DUTY[duty];
  return (
    <div className="driver-row">
      <button className="avatar tap" onClick={onProfile}>MA<span className="on" style={{ background: D.c }} /></button>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div className="driver-name">Michael Anderson</div>
        <div className="driver-meta"><Icon n="truck" s={13} c="#8FA3C8" /><span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>Truck #2048 · Freightliner Cascadia</span></div>
      </div>
      {!compact && (
        <span className="pill" style={{ background: D.c + '26', color: D.c === '#64748B' ? '#B9C5D8' : D.c === '#0E9F9A' ? '#3DD6CF' : D.c === '#7A5AF8' ? '#B4A2FF' : '#7FA6FF', border: '1px solid ' + D.c + '55' }}>
          <span className="pd" />{D.short}
        </span>
      )}
    </div>
  );
}

function HosCard({ onOpen }) {
  const { duty } = useStore();
  const d = HOS.drive;
  const rows = ['duty', 'shift', 'cycle'];
  return (
    <div className="card">
      <div className="card-h">
        <div>
          <div className="card-t">Hours of Service</div>
          <div className="card-s">US Property · 70hr / 8-day</div>
        </div>
        <button className="link" onClick={() => onOpen('drive')}>Details<Icon n="chevR" s={14} w={2.2} /></button>
      </div>
      <div className="hos-top">
        <button className="tap" onClick={() => onOpen('drive')} style={{ borderRadius: '50%' }}>
          <Ring pct={d.rem / d.limit} color={d.c}>
            <div className="eyebrow" style={{ fontSize: 9.5, marginBottom: 3, color: d.c }}>Drive left</div>
            <div className="ring-num">07<small>h</small>24<small>m</small></div>
            <div className="ring-lbl">of 11h limit</div>
          </Ring>
        </button>
        <div className="hos-rows">
          {rows.map((k) => {
            const h = HOS[k]; const warn = hosColor(h.rem, h.limit);
            return (
              <button key={k} className="hrow tap" onClick={() => onOpen(k)}>
                <div className="hrow-t"><span>{h.label}</span><b>{fmtDur(h.rem)}</b></div>
                <div className="bar"><i style={{ width: (h.rem / h.limit) * 100 + '%', background: warn || h.c }} /></div>
              </button>
            );
          })}
        </div>
      </div>
      <div className="hos-foot">
        <button className="chip tap" onClick={() => onOpen('break')}>
          <Icon n="clock" s={16} c="#F08C1A" />
          <div>Break due in<b>04h 24m</b></div>
        </button>
        <button className="chip tap" onClick={() => onOpen('cycle')}>
          <Icon n="refresh" s={16} c="#14A86B" />
          <div>Hours gained at 12 AM<b>+ 08h 45m</b></div>
        </button>
      </div>
      {duty === 'D' && (
        <div style={{ marginTop: 10, display: 'flex', alignItems: 'center', gap: 8, fontSize: 11.5, color: '#2F6BFF', fontWeight: 500 }}>
          <span className="pulse" style={{ background: '#2F6BFF', animation: 'none' }} /> Driving clock is running
        </div>
      )}
    </div>
  );
}

function DutyCard({ onRequest }) {
  const { duty, log } = useStore();
  const since = log[log.length - 1].s;
  return (
    <div className="card">
      <div className="card-h">
        <div>
          <div className="card-t">Duty Status</div>
          <div className="card-s">Current: <b style={{ color: DUTY[duty].c, fontWeight: 600 }}>{DUTY[duty].short}</b> · since {fmtClock(since)}</div>
        </div>
      </div>
      <div className="duty-grid">
        {DUTY_ORDER.map((k) => {
          const D = DUTY[k]; const sel = duty === k;
          return (
            <button key={k} className={'duty tap' + (sel ? ' sel' : '')} onClick={() => onRequest(k)}
              style={sel ? { borderColor: D.c, background: D.soft, '--c': D.c + '80' } : {}}>
              <div className="di" style={{ background: sel ? D.c : D.soft, color: sel ? '#fff' : D.c }}><Icon n={D.icon} s={18} /></div>
              <div style={{ minWidth: 0 }}>
                <div className="dc">{D.code}</div>
                <div className="dn">{k === 'ON' ? <>On Duty<span style={{ display: 'block', fontSize: 10.5, fontWeight: 500, color: 'var(--ink-3)' }}>Not Driving</span></> : D.name}</div>
              </div>
              {sel && <span className="chk" style={{ background: D.c }}><Icon n="check" s={10} w={3} /></span>}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* stylised map */
function MiniMap({ height = 196, big }) {
  return (
    <div className="map" style={{ height }}>
      <svg viewBox="0 0 360 200" preserveAspectRatio="xMidYMid slice" width="100%" height="100%">
        <rect width="360" height="200" fill="#E8EDF4" />
        {/* parks / water */}
        <path d="M-10 150 Q60 130 110 160 T220 175 L220 210 L-10 210Z" fill="#D7E9DE" />
        <path d="M250 -10 Q270 40 320 52 T380 60 L380 -10Z" fill="#CFE0F3" />
        <ellipse cx="300" cy="150" rx="40" ry="22" fill="#D7E9DE" />
        {/* minor roads */}
        <g stroke="#fff" strokeWidth="4" fill="none" strokeLinecap="round">
          <path d="M0 40 L360 70" /><path d="M0 110 L360 95" /><path d="M60 0 L90 200" />
          <path d="M170 0 L160 200" /><path d="M260 0 L280 200" /><path d="M0 175 L360 160" />
        </g>
        <g stroke="#F4F6FA" strokeWidth="2" fill="none">
          <path d="M0 75 L360 85" /><path d="M120 0 L125 200" /><path d="M215 0 L225 200" /><path d="M320 0 L330 200" /><path d="M0 140 L360 128" />
        </g>
        {/* interstate */}
        <path d="M-10 168 C60 160 80 120 140 112 S240 88 280 60 S340 22 380 14" stroke="#FFFFFF" strokeWidth="11" fill="none" strokeLinecap="round" />
        <path d="M-10 168 C60 160 80 120 140 112 S240 88 280 60 S340 22 380 14" stroke="#F9D57A" strokeWidth="6" fill="none" strokeLinecap="round" />
        {/* completed */}
        <path d="M20 164 C60 160 80 120 140 112" stroke="#8FA3C8" strokeWidth="5" fill="none" strokeLinecap="round" />
        {/* route ahead */}
        <path d="M140 112 S240 88 280 60 S320 32 334 26" stroke="#2F6BFF" strokeWidth="5.5" fill="none" strokeLinecap="round" />
        <path d="M140 112 S240 88 280 60 S320 32 334 26" stroke="#fff" strokeWidth="1.5" fill="none" strokeDasharray="2 7" strokeLinecap="round" />
        {/* shield */}
        <g transform="translate(205 84)">
          <rect x="-12" y="-8" width="24" height="16" rx="4" fill="#1A4FB8" stroke="#fff" strokeWidth="1.5" />
          <text x="0" y="4" textAnchor="middle" fontSize="9" fontWeight="700" fill="#fff" fontFamily="Geist Mono, monospace">I-30</text>
        </g>
        {/* origin */}
        <circle cx="20" cy="164" r="5" fill="#fff" stroke="#8FA3C8" strokeWidth="3" />
        {/* destination */}
        <g transform="translate(334 26)">
          <circle r="11" fill="#0C1A33" opacity=".12" />
          <circle r="6.5" fill="#0C1A33" stroke="#fff" strokeWidth="2.5" />
        </g>
        {/* truck */}
        <g transform="translate(140 112)">
          <circle r="22" fill="#2F6BFF" opacity=".14" />
          <circle r="13" fill="#2F6BFF" stroke="#fff" strokeWidth="3" />
          <path d="M-4 4 L0 -6 L4 4 L0 1.5Z" fill="#fff" transform="rotate(62)" />
        </g>
      </svg>
      <div className="map-chip" style={{ left: 10, top: 10 }}><span className="gps-live"><span className="pulse" />GPS Live</span><span style={{ color: 'var(--ink-3)', marginLeft: 6 }}>±4 m</span></div>
      <div className="map-chip" style={{ right: 10, top: 40, display: 'flex', alignItems: 'center', gap: 6 }}>
        <Icon n="pin" s={13} c="#0C1A33" /><div><b style={{ fontWeight: 600 }}>Memphis, TN</b></div>
      </div>
      <div className="map-chip" style={{ left: 10, bottom: 10, display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{ width: 22, height: 22, borderRadius: 7, background: '#2F6BFF', display: 'grid', placeItems: 'center' }}><Icon n="nav" s={12} c="#fff" w={2.2} /></div>
        <div><div style={{ fontWeight: 600 }}>I-30 E · Mt Pleasant, TX</div><div style={{ color: 'var(--ink-3)', fontSize: 10.5 }}>Updated just now · 0 mph</div></div>
      </div>
    </div>
  );
}

function TripCard({ onOpen }) {
  return (
    <div className="card">
      <div className="card-h">
        <div>
          <div className="card-t">Live Trip <span className="mono" style={{ fontSize: 11, color: 'var(--ink-3)', fontWeight: 500 }}>TRP-2048</span></div>
          <div className="card-s">Dallas, TX → Memphis, TN</div>
        </div>
        <button className="link" onClick={onOpen}>Open<Icon n="chevR" s={14} w={2.2} /></button>
      </div>
      <button className="tap" style={{ display: 'block', width: '100%' }} onClick={onOpen}><MiniMap /></button>
      <div className="trip-stats">
        <div><div className="ts-v">3:42 PM</div><div className="ts-l">ETA (CST)</div></div>
        <div><div className="ts-v">338 mi</div><div className="ts-l">Remaining</div></div>
        <div><div className="ts-v" style={{ color: 'var(--green)' }}>On time</div><div className="ts-l">Appt 4:30 PM</div></div>
      </div>
    </div>
  );
}

function QuickActions({ onAction }) {
  const items = [
    { k: 'logs', n: 'logs', l: 'View ELD Logs', c: '#2F6BFF', b: '#E8EFFF' },
    { k: 'inspect', n: 'clipboard', l: 'Vehicle Inspection', c: '#14A86B', b: '#E3F6EE' },
    { k: 'docs', n: 'folder', l: 'My Documents', c: '#7A5AF8', b: '#EFEBFE' },
    { k: 'report', n: 'alert', l: 'Report ELD Issue', c: '#E5484D', b: '#FDE8E9' },
  ];
  return (
    <div>
      <div className="eyebrow" style={{ margin: '4px 4px 10px' }}>Quick actions</div>
      <div className="qa-grid">
        {items.map((it) => (
          <button key={it.k} className="qa tap" onClick={() => onAction(it.k)}>
            <div className="qi" style={{ background: it.b, color: it.c }}><Icon n={it.n} s={20} /></div>
            {it.l}
          </button>
        ))}
      </div>
    </div>
  );
}

function AlertStrip({ onOpen }) {
  const { preTripDone } = useStore();
  if (preTripDone) return null;
  return (
    <button className="card tap" onClick={onOpen} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 12, background: '#FFF8EC', borderColor: '#F7DDB4', textAlign: 'left' }}>
      <div style={{ width: 36, height: 36, borderRadius: 11, background: '#FDE6C4', color: '#C86E05', display: 'grid', placeItems: 'center', flex: 'none' }}><Icon n="clipboard" s={18} /></div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: '#7A4B0F' }}>Pre-trip DVIR not submitted</div>
        <div style={{ fontSize: 11.5, color: '#9A6A2B' }}>Complete before your next driving period</div>
      </div>
      <Icon n="chevR" s={16} c="#C86E05" />
    </button>
  );
}

function DashboardScreen({ open }) {
  return (
    <>
      <Header tall>
        <BrandRow onBell={() => open('notif')} />
        <DriverRow onProfile={() => open('profile')} />
      </Header>
      <div className="body lift">
        <HosCard onOpen={(k) => open('hos', k)} />
        <AlertStrip onOpen={() => open('inspect')} />
        <DutyCard onRequest={(k) => open('duty', k)} />
        <TripCard onOpen={() => open('trip')} />
        <QuickActions onAction={(k) => open(k)} />
        <div style={{ fontSize: 10.5, color: 'var(--ink-3)', textAlign: 'center', lineHeight: 1.5, padding: '4px 12px 0' }}>
          Concept prototype · illustrative data · not an FMCSA-registered ELD
        </div>
      </div>
    </>
  );
}

Object.assign(window, { HOS, Header, BrandRow, DriverRow, DashboardScreen, MiniMap });
