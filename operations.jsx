// operations.jsx — Screen 2: ELD Logs, Inspection, Trip, Docs, Diagnostics

const DATES = [
  { w: 'Fri', d: 7, m: 'ok' }, { w: 'Sat', d: 8, m: 'ok' }, { w: 'Sun', d: 9, m: 'off' }, { w: 'Mon', d: 10, m: 'ok' },
  { w: 'Tue', d: 11, m: 'ok' }, { w: 'Wed', d: 12, m: 'ok' }, { w: 'Thu', d: 13, m: 'today' },
];

function DateStrip({ sel, setSel }) {
  return (
    <div className="date-strip">
      {DATES.map((x) => (
        <button key={x.d} className={'date tap' + (sel === x.d ? ' on' : '')} onClick={() => setSel(x.d)}>
          <span className="dw">{x.w}</span>
          <span className="dd">{x.d}</span>
          <span className="dm" style={{ background: x.m === 'today' ? (sel === x.d ? '#fff' : '#F08C1A') : x.m === 'off' ? 'transparent' : (sel === x.d ? '#fff' : '#14A86B') }} />
        </button>
      ))}
    </div>
  );
}

// Past days: simple illustrative log
function pastLog(day) {
  const seed = day % 3;
  const a = [
    [{ s: 0, e: 330, st: 'SB' }, { s: 330, e: 360, st: 'ON' }, { s: 360, e: 690, st: 'D' }, { s: 690, e: 720, st: 'OFF' }, { s: 720, e: 960, st: 'D' }, { s: 960, e: 1000, st: 'ON' }, { s: 1000, e: 1440, st: 'OFF' }],
    [{ s: 0, e: 300, st: 'OFF' }, { s: 300, e: 345, st: 'ON' }, { s: 345, e: 600, st: 'D' }, { s: 600, e: 640, st: 'ON' }, { s: 640, e: 900, st: 'D' }, { s: 900, e: 930, st: 'ON' }, { s: 930, e: 1440, st: 'SB' }],
    [{ s: 0, e: 400, st: 'SB' }, { s: 400, e: 430, st: 'ON' }, { s: 430, e: 760, st: 'D' }, { s: 760, e: 800, st: 'OFF' }, { s: 800, e: 1010, st: 'D' }, { s: 1010, e: 1050, st: 'ON' }, { s: 1050, e: 1440, st: 'OFF' }],
  ][seed];
  return a;
}
const sumLog = (L) => { const t = { OFF: 0, SB: 0, D: 0, ON: 0 }; L.forEach((x) => (t[x.st] += x.e - x.s)); return t; };

function LogsCard({ day, open }) {
  const { log, totals, certified } = useStore();
  const isToday = day === 13;
  const L = isToday ? log : pastLog(day);
  const T = isToday ? totals : sumLog(L);
  const certOk = isToday ? certified : day !== 9 || true;
  return (
    <div className="card">
      <div className="card-h">
        <div>
          <div className="card-t">ELD Logs · RODS</div>
          <div className="card-s">{isToday ? 'Thu, Nov 13 · in progress' : `Nov ${day}, 2026`}</div>
        </div>
        <button className="link" onClick={() => open('logs', day)}>Timeline<Icon n="chevR" s={14} w={2.2} /></button>
      </div>
      <button className="tap" style={{ width: '100%', display: 'block' }} onClick={() => open('logs', day)}>
        <RodsGraph log={L} height={112} />
      </button>
      <div className="sum-grid">
        {DUTY_ORDER.map((k) => (
          <div key={k} className="sum">
            <div className="sv">{fmtDur(T[k]).replace('h ', ':').replace('m', '')}</div>
            <div className="sl"><i style={{ background: DUTY[k].c }} />{DUTY[k].short}</div>
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
        <div style={{ flex: 1, padding: '9px 11px', borderRadius: 12, border: '1px solid var(--line)' }}>
          <div style={{ fontSize: 11, color: 'var(--ink-3)' }}>Total driving</div>
          <div className="mono" style={{ fontSize: 16, fontWeight: 600, color: 'var(--blue)' }}>{fmtDur(T.D)}</div>
        </div>
        <div style={{ flex: 1, padding: '9px 11px', borderRadius: 12, border: '1px solid var(--line)' }}>
          <div style={{ fontSize: 11, color: 'var(--ink-3)' }}>Total on-duty</div>
          <div className="mono" style={{ fontSize: 16, fontWeight: 600 }}>{fmtDur(T.D + T.ON)}</div>
        </div>
      </div>
      <div className="cert" style={{ background: certOk ? 'var(--green-soft)' : 'var(--orange-soft)' }}>
        <Icon n={certOk ? 'shield' : 'pen'} s={18} c={certOk ? '#14A86B' : '#C86E05'} />
        <div style={{ flex: 1, fontSize: 12.5 }}>
          <b style={{ fontWeight: 600, color: certOk ? '#0B7A4C' : '#7A4B0F' }}>{certOk ? 'Logs certified' : 'Not yet certified'}</b>
          <div style={{ fontSize: 11.5, color: certOk ? '#3E8F6B' : '#9A6A2B' }}>{certOk ? (isToday ? 'Signed today · M. Anderson' : `Signed Nov ${day} · M. Anderson`) : '1 day pending · certify at end of shift'}</div>
        </div>
      </div>
      <button className="btn primary" onClick={() => open('certify', day)}><Icon n="pen" s={17} />Review &amp; Certify Logs</button>
    </div>
  );
}

function DvirCard({ open }) {
  const { inspections, preTripDone } = useStore();
  const last = inspections[0];
  const hasDefect = !last.ok;
  return (
    <div className="card">
      <div className="card-h">
        <div>
          <div className="card-t">Vehicle Inspection · DVIR</div>
          <div className="card-s">Truck #2048 · Trailer #TR-5531</div>
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
        {[
          { l: 'Pre-trip', st: preTripDone ? 'Completed' : 'Due now', c: preTripDone ? '#14A86B' : '#F08C1A', ic: preTripDone ? 'check' : 'clock' },
          { l: 'Post-trip', st: 'End of shift', c: '#64748B', ic: 'clock' },
        ].map((x) => (
          <button key={x.l} className="tap" onClick={() => open('inspect')} style={{ padding: 11, borderRadius: 14, border: '1px solid var(--line)', textAlign: 'left' }}>
            <div style={{ fontSize: 11, color: 'var(--ink-3)' }}>{x.l}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 4, fontSize: 13, fontWeight: 600, color: x.c }}>
              <Icon n={x.ic} s={14} w={2.2} />{x.st}
            </div>
          </button>
        ))}
      </div>
      <div style={{ marginTop: 6 }}>
        <div className="kv"><span>Vehicle condition</span><b style={{ color: hasDefect ? 'var(--red)' : 'var(--green)', display: 'flex', alignItems: 'center', gap: 6 }}><span style={{ width: 7, height: 7, borderRadius: '50%', background: 'currentColor' }} />{hasDefect ? 'Defect reported' : 'Satisfactory'}</b></div>
        <div className="kv"><span>Open defects</span><b>{hasDefect ? '1 · awaiting mechanic' : 'None'}</b></div>
        <button className="kv tap" style={{ width: '100%' }} onClick={() => open('history')}><span>Inspection history</span><b style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'var(--blue)' }}>{inspections.length} reports<Icon n="chevR" s={14} w={2.2} /></b></button>
      </div>
      <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
        <button className="btn line" style={{ width: 'auto', padding: '0 14px' }} onClick={() => open('defect')}><Icon n="alert" s={16} c="#E5484D" />Defect</button>
        <button className="btn dark" style={{ flex: 1 }} onClick={() => open('inspect')}><Icon n="clipboard" s={17} />Start Inspection</button>
      </div>
    </div>
  );
}

function ActiveTripCard({ open }) {
  return (
    <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
      <div style={{ position: 'relative', height: 108, background: '#0A1730' }}>
        <img src="assets/truck2.jpg" alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: '50% 62%', opacity: .9 }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg,rgba(6,14,31,.1),rgba(6,14,31,.75))' }} />
        <div style={{ position: 'absolute', left: 16, bottom: 12, right: 16, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', color: '#fff' }}>
          <div>
            <div className="eyebrow" style={{ color: '#C9D4EA' }}>Active trip</div>
            <div className="mono" style={{ fontSize: 18, fontWeight: 600 }}>TRP-2048</div>
          </div>
          <span className="pill" style={{ background: 'rgba(20,168,107,.9)', color: '#fff' }}><span className="pd" />In Transit</span>
        </div>
      </div>
      <div style={{ padding: 16 }}>
        <div style={{ display: 'flex', gap: 12 }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 4 }}>
            <span style={{ width: 10, height: 10, borderRadius: '50%', border: '2.5px solid #8FA3C8' }} />
            <span style={{ width: 2, flex: 1, background: 'linear-gradient(#8FA3C8,#2F6BFF)', margin: '3px 0' }} />
            <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#2F6BFF' }} />
          </div>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div>
              <div style={{ fontSize: 11, color: 'var(--ink-3)' }}>Pickup · Nov 13, 5:45 AM</div>
              <div style={{ fontSize: 13.5, fontWeight: 600 }}>DFW Distribution Center</div>
              <div style={{ fontSize: 12, color: 'var(--ink-2)' }}>Dallas, TX 75212</div>
            </div>
            <div>
              <div style={{ fontSize: 11, color: 'var(--ink-3)' }}>Delivery · Appt 4:30 PM CST</div>
              <div style={{ fontSize: 13.5, fontWeight: 600 }}>Mid-South Cold Storage</div>
              <div style={{ fontSize: 12, color: 'var(--ink-2)' }}>Memphis, TN 38118</div>
            </div>
          </div>
        </div>
        <div style={{ marginTop: 14 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11.5, color: 'var(--ink-2)', marginBottom: 6 }}>
            <span><b className="mono" style={{ color: 'var(--ink)' }}>114</b> of 452 mi</span><span>25% complete</span>
          </div>
          <div className="progress-line"><i style={{ width: '25%' }} /></div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginTop: 12 }}>
          <div className="sum"><div className="sl">Assigned truck</div><div style={{ fontSize: 12.5, fontWeight: 600, marginTop: 2 }}>#2048 · Cascadia</div></div>
          <div className="sum"><div className="sl">Est. arrival</div><div className="mono" style={{ fontSize: 13, fontWeight: 600, marginTop: 2 }}>3:42 PM CST</div></div>
        </div>
        <button className="btn ghost" style={{ marginTop: 12 }} onClick={() => open('trip')}>View Trip Details<Icon n="chevR" s={16} w={2.2} /></button>
      </div>
    </div>
  );
}

const DOC_TYPES = [
  { k: 'bol', l: 'Bill of Lading', n: 'file', c: '#2F6BFF' },
  { k: 'fuel', l: 'Fuel Receipts', n: 'fuel', c: '#F08C1A' },
  { k: 'delivery', l: 'Delivery Receipts', n: 'receipt', c: '#14A86B' },
  { k: 'vehicle', l: 'Vehicle Documents', n: 'truck', c: '#7A5AF8' },
];
function DocsCard({ open }) {
  const { docs } = useStore();
  const count = Object.values(docs).filter(Boolean).length;
  return (
    <div className="card">
      <div className="card-h">
        <div>
          <div className="card-t">Documents</div>
          <div className="card-s">{count} of 4 uploaded for TRP-2048</div>
        </div>
      </div>
      <div className="doc-grid">
        {DOC_TYPES.map((d) => {
          const f = docs[d.k];
          return (
            <button key={d.k} className={'doc tap' + (f ? ' done' : '')} onClick={() => open('upload', d.k)}>
              <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                <div style={{ width: 32, height: 32, borderRadius: 10, background: f ? '#fff' : d.c + '18', color: d.c, display: 'grid', placeItems: 'center' }}><Icon n={d.n} s={17} /></div>
                {f ? <span style={{ width: 22, height: 22, borderRadius: '50%', background: 'var(--green)', color: '#fff', display: 'grid', placeItems: 'center' }}><Icon n="check" s={12} w={3} /></span>
                  : <Icon n="upload" s={17} c="#7A869C" />}
              </div>
              <div>
                <div className="dn">{d.l}</div>
                <div className="ds" style={f ? { color: '#3E8F6B' } : {}}>{f ? f.name : 'Tap to upload'}</div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function DiagCard({ open }) {
  const { tickets } = useStore();
  const rows = [
    { n: 'link', t: 'ELD connection', s: 'Bluetooth · HW-ELD 7F2A', st: 'Connected', c: '#14A86B' },
    { n: 'gps', t: 'GPS', s: '11 satellites · ±4 m', st: 'Locked', c: '#14A86B' },
    { n: 'engine', t: 'Engine sync', s: 'ECM J1939 · last 9:20 AM', st: 'Synced', c: '#14A86B' },
    { n: 'alert', t: 'Diagnostic alerts', s: 'Unidentified driving · 0.4 mi', st: '1 review', c: '#F08C1A' },
  ];
  return (
    <div className="card">
      <div className="card-h" style={{ marginBottom: 4 }}>
        <div>
          <div className="card-t">ELD Diagnostics</div>
          <div className="card-s">System health · checked 1 min ago</div>
        </div>
        <span className="pill" style={{ background: 'var(--green-soft)', color: 'var(--green)' }}><span className="pd" />Healthy</span>
      </div>
      {rows.map((r) => (
        <div key={r.t} className="diag">
          <div className="gi" style={{ background: r.c + '1A', color: r.c }}><Icon n={r.n} s={16} /></div>
          <div style={{ minWidth: 0 }}><div className="gt">{r.t}</div><div className="gs">{r.s}</div></div>
          <span className="stat" style={{ color: r.c }}>{r.st}</span>
        </div>
      ))}
      {tickets.length > 0 && (
        <div style={{ marginTop: 6, padding: '9px 11px', borderRadius: 12, background: 'var(--blue-soft)', fontSize: 12, color: '#1E4FC2', display: 'flex', gap: 8, alignItems: 'center' }}>
          <Icon n="msg" s={15} />Ticket <b className="mono">{tickets[0].id}</b> sent to fleet support
        </div>
      )}
      <button className="btn line" style={{ marginTop: 10 }} onClick={() => open('report')}><Icon n="alert" s={16} c="#E5484D" />Report an Issue</button>
    </div>
  );
}

function OperationsScreen({ open }) {
  const [day, setDay] = useState(13);
  return (
    <>
      <Header tall>
        <BrandRow onBell={() => open('notif')} title="Driver Operations" />
        <div style={{ fontSize: 12.5, color: '#9FB0D0', marginTop: 4, position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', gap: 6 }}>
          Michael Anderson <span style={{ opacity: .5 }}>•</span> Truck #2048 · Freightliner Cascadia
        </div>
        <DateStrip sel={day} setSel={setDay} />
      </Header>
      <div className="body lift">
        <LogsCard day={day} open={open} />
        <DvirCard open={open} />
        <ActiveTripCard open={open} />
        <DocsCard open={open} />
        <DiagCard open={open} />
        <div style={{ fontSize: 10.5, color: 'var(--ink-3)', textAlign: 'center', lineHeight: 1.5, padding: '4px 12px 0' }}>
          Concept prototype · illustrative data · not an FMCSA-registered ELD
        </div>
      </div>
    </>
  );
}

Object.assign(window, { OperationsScreen, DOC_TYPES, pastLog, sumLog });
