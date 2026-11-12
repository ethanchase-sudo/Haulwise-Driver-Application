// flows.jsx — sheets / overlays for all interactions

/* ───────── HOS breakdown ───────── */
function HosSheet({ focus, close }) {
  const { totals } = useStore();
  const items = [
    { k: 'drive', t: 'Driving', sub: '11-hour limit', used: HOS.drive.limit - HOS.drive.rem },
    { k: 'duty', t: 'On-Duty', sub: 'Remaining on-duty time this shift', used: HOS.duty.limit - HOS.duty.rem },
    { k: 'shift', t: '14-Hour Shift Window', sub: 'Started 5:30 AM · ends 7:30 PM*', used: HOS.shift.limit - HOS.shift.rem },
    { k: 'cycle', t: '60/70-Hour Cycle', sub: '70 hours in 8 days', used: HOS.cycle.limit - HOS.cycle.rem },
  ];
  const recap = [{ d: 'Fr', h: 9.8 }, { d: 'Sa', h: 10.5 }, { d: 'Su', h: 0 }, { d: 'Mo', h: 8.2 }, { d: 'Tu', h: 11.1 }, { d: 'We', h: 10.4 }, { d: 'Th', h: 3.9, t: 1 }, { d: 'Fr', h: 0, f: 1 }];
  return (
    <>
      <Disclaimer />
      {items.map((x) => {
        const h = HOS[x.k]; const pct = h.rem / h.limit; const hl = focus === x.k;
        return (
          <div key={x.k} className="card" style={{ padding: 14, ...(hl ? { borderColor: h.c, boxShadow: `0 0 0 3px ${h.c}22, 0 6px 20px rgba(12,26,51,.06)` } : {}) }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <Ring size={64} stroke={7} pct={pct} color={h.c}>
                <span className="mono" style={{ fontSize: 12, fontWeight: 600 }}>{Math.round(pct * 100)}%</span>
              </Ring>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 600 }}>{x.t}</div>
                <div style={{ fontSize: 11.5, color: 'var(--ink-3)', marginTop: 1 }}>{x.sub}</div>
                <div style={{ display: 'flex', gap: 14, marginTop: 8 }}>
                  <div><div style={{ fontSize: 10.5, color: 'var(--ink-3)' }}>Remaining</div><div className="mono" style={{ fontSize: 15, fontWeight: 600, color: h.c }}>{fmtDur(h.rem)}</div></div>
                  <div><div style={{ fontSize: 10.5, color: 'var(--ink-3)' }}>Used</div><div className="mono" style={{ fontSize: 15, fontWeight: 600 }}>{fmtDur(x.used)}</div></div>
                </div>
              </div>
            </div>
          </div>
        );
      })}
      <div className="card" style={{ padding: 14, ...(focus === 'break' ? { borderColor: '#F08C1A', boxShadow: '0 0 0 3px #F08C1A22' } : {}) }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 36, height: 36, borderRadius: 11, background: 'var(--orange-soft)', color: '#C86E05', display: 'grid', placeItems: 'center' }}><Icon n="clock" s={18} /></div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 14, fontWeight: 600 }}>30-Minute Break</div>
            <div style={{ fontSize: 11.5, color: 'var(--ink-3)' }}>Required after 8 cumulative hours of driving</div>
          </div>
          <div className="mono" style={{ fontWeight: 600, color: '#C86E05' }}>04h 24m</div>
        </div>
      </div>
      <div className="card" style={{ padding: 14 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
          <div style={{ fontSize: 14, fontWeight: 600 }}>8-Day Recap</div>
          <div style={{ fontSize: 11.5, color: 'var(--ink-3)' }}>On-duty hrs / day</div>
        </div>
        <div className="recap">
          {recap.map((r, i) => (
            <div key={i} className={r.t ? 't' : ''}>
              <span style={{ color: r.t ? 'var(--blue)' : undefined, fontWeight: r.t ? 600 : 400 }}>{r.f ? '–' : r.h.toFixed(1)}</span>
              <i style={{ height: r.f ? 2 : Math.max(2, (r.h / 14) * 58), background: r.f ? '#E4E8F0' : undefined }} />
              {r.d}
            </div>
          ))}
        </div>
        <div style={{ fontSize: 11.5, color: 'var(--ink-2)', marginTop: 10, lineHeight: 1.45 }}>
          A 34-hour restart would reset the cycle to 70:00. Earliest restart end: <b>Sat 7:30 PM</b>.
        </div>
      </div>
      <div style={{ fontSize: 10.5, color: 'var(--ink-3)', lineHeight: 1.5 }}>* Rules shown reflect FMCSA property-carrying HOS limits for reference. Production calculations will come from the certified HOS engine via the Haulwise API.</div>
    </>
  );
}

/* ───────── Duty change confirm ───────── */
function DutySheetBody({ target, close, toast }) {
  const { duty, setDuty, minute } = useStore();
  const [note, setNote] = useState('');
  const T = DUTY[target];
  const blocked = target === 'D';
  return {
    body: (
      <>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 14, borderRadius: 18, background: '#fff', border: '1px solid var(--line)' }}>
          <div style={{ textAlign: 'center', flex: 1 }}>
            <div className="eyebrow">From</div>
            <div style={{ marginTop: 6, fontWeight: 600, color: DUTY[duty].c, fontSize: 14 }}>{DUTY[duty].short}</div>
          </div>
          <Icon n="chevR" s={18} c="#B9C3D3" />
          <div style={{ textAlign: 'center', flex: 1 }}>
            <div className="eyebrow">To</div>
            <div style={{ marginTop: 6, fontWeight: 600, color: T.c, fontSize: 14 }}>{T.short}</div>
          </div>
        </div>
        <div className="card" style={{ padding: 0 }}>
          <div style={{ padding: '2px 14px' }}>
            <div className="kv"><span>Time</span><b className="mono">{fmtClock(minute)} CST</b></div>
            <div className="kv"><span>Location</span><b>Mt Pleasant, TX</b></div>
            <div className="kv"><span>Odometer</span><b className="mono">412,886 mi</b></div>
            <div className="kv"><span>Engine hours</span><b className="mono">18,204.6</b></div>
          </div>
        </div>
        {blocked && (
          <div style={{ display: 'flex', gap: 9, padding: 12, borderRadius: 12, background: 'var(--blue-soft)', fontSize: 12, color: '#1E4FC2', lineHeight: 1.45 }}>
            <Icon n="info" s={15} style={{ marginTop: 1 }} />In production, Driving is set automatically when the vehicle exceeds 5 mph via engine sync. Manual selection here is for demo only.
          </div>
        )}
        <div>
          <div className="eyebrow" style={{ margin: '2px 2px 8px' }}>Annotation (optional)</div>
          <div className="seg" style={{ marginBottom: 8 }}>
            {['Fuel stop', 'Loading', 'Break', 'Inspection'].map((n) => (
              <button key={n} className={note === n ? 'on' : ''} onClick={() => setNote(note === n ? '' : n)}>{n}</button>
            ))}
          </div>
        </div>
      </>
    ),
    footer: (
      <button className="btn primary" style={{ background: T.c, boxShadow: `0 6px 16px ${T.c}55` }} onClick={() => { setDuty(target); close(); toast(`Status changed to ${T.name}`, T.c); }}>
        <Icon n={T.icon} s={18} />Switch to {T.short}
      </button>
    ),
  };
}

/* ───────── Log timeline ───────── */
function LogsSheetBody({ day }) {
  const { log } = useStore();
  const isToday = !day || day === 13;
  const L = isToday ? log.map((x) => ({ ...x })) : pastLog(day).map((x) => ({ ...x, loc: 'Interstate 40, AR', note: '' }));
  const T = sumLog(L);
  return (
    <>
      <div className="card" style={{ padding: 14 }}>
        <RodsGraph log={L} height={132} />
        <div className="sum-grid">
          {DUTY_ORDER.map((k) => (
            <div key={k} className="sum"><div className="sv">{fmtDur(T[k]).replace('h ', ':').replace('m', '')}</div><div className="sl"><i style={{ background: DUTY[k].c }} />{DUTY[k].short}</div></div>
          ))}
        </div>
      </div>
      <div className="card" style={{ padding: '6px 14px' }}>
        <div className="eyebrow" style={{ padding: '10px 0 4px' }}>Duty status events</div>
        {L.slice().reverse().map((x, i) => (
          <div key={i} className="event">
            <span className="ev-badge" style={{ background: DUTY[x.st].soft, color: DUTY[x.st].c }}>{x.st}</span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 600 }}>{DUTY[x.st].name}{i === 0 && isToday && <span style={{ marginLeft: 6, fontSize: 10.5, color: 'var(--blue)', fontWeight: 600 }}>● LIVE</span>}</div>
              <div style={{ fontSize: 11.5, color: 'var(--ink-3)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{x.loc || 'Interstate 40, AR'}{x.note ? ' · ' + x.note : ''}</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div className="mono" style={{ fontSize: 12, fontWeight: 600 }}>{fmt24(x.s)}–{i === 0 && isToday ? 'now' : fmt24(x.e)}</div>
              <div className="mono" style={{ fontSize: 11, color: 'var(--ink-3)' }}>{fmtDur(x.e - x.s)}</div>
            </div>
          </div>
        ))}
      </div>
      <div className="card" style={{ padding: '2px 14px' }}>
        <div className="kv"><span>Carrier</span><b>Anderson Freight LLC</b></div>
        <div className="kv"><span>USDOT #</span><b className="mono">3 418 207</b></div>
        <div className="kv"><span>Co-driver</span><b>None</b></div>
        <div className="kv"><span>Shipping docs</span><b className="mono">BOL 88412</b></div>
      </div>
    </>
  );
}

/* ───────── Certify ───────── */
function CertifyFlow({ day, close, toast }) {
  const { log, setCertified, certified } = useStore();
  const [agree, setAgree] = useState(false);
  const [signed, setSigned] = useState(false);
  const [done, setDone] = useState(false);
  const isToday = !day || day === 13;
  if (done || (!isToday)) {
    return {
      body: done ? <Success title="Logs certified" id={`CERT-1113-MA · ${fmtClock(NOW_MIN)}`}>Your record of duty status for Thu, Nov 13 has been signed and queued for sync to your carrier.</Success>
        : <Success title={`Nov ${day} already certified`}>This day was signed by Michael Anderson. Edits now require carrier-requested changes.</Success>,
      footer: <button className="btn dark" onClick={close}>Done</button>,
    };
  }
  const T = sumLog(log);
  return {
    body: (
      <>
        <div className="card" style={{ padding: 14 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
            <div style={{ fontSize: 14, fontWeight: 600 }}>Thu, Nov 13, 2026</div>
            <span className="pill" style={{ background: certified ? 'var(--green-soft)' : 'var(--orange-soft)', color: certified ? 'var(--green)' : '#C86E05' }}><span className="pd" />{certified ? 'Certified' : 'Uncertified'}</span>
          </div>
          <RodsGraph log={log} height={100} />
          <div className="sum-grid">
            {DUTY_ORDER.map((k) => (
              <div key={k} className="sum"><div className="sv">{fmtDur(T[k]).replace('h ', ':').replace('m', '')}</div><div className="sl"><i style={{ background: DUTY[k].c }} />{DUTY[k].short}</div></div>
            ))}
          </div>
        </div>
        <div className="card" style={{ padding: '2px 14px' }}>
          <div className="kv"><span>Form & manner check</span><b style={{ color: 'var(--green)' }}>No errors</b></div>
          <div className="kv"><span>Unassigned driving</span><b style={{ color: '#C86E05' }}>0.4 mi · review</b></div>
          <div className="kv"><span>Edits pending</span><b>None</b></div>
        </div>
        <button className={'check tap' + (agree ? ' on' : '')} onClick={() => setAgree(!agree)}>
          <span className="box">{agree && <Icon n="check" s={12} w={3} />}</span>
          I hereby certify that my data entries and my record of duty status for this 24-hour period are true and correct.
        </button>
        <div>
          <div className="eyebrow" style={{ margin: '2px 2px 8px' }}>Signature</div>
          <button onClick={() => setSigned(true)} style={{ width: '100%', height: 96, borderRadius: 14, border: '1.5px dashed ' + (signed ? '#2F6BFF' : '#CDD5E3'), background: '#fff', position: 'relative', display: 'grid', placeItems: 'center' }}>
            {signed ? (
              <svg width="190" height="60" viewBox="0 0 190 60"><path d="M8 42 C18 10 28 10 30 34 S40 52 48 28 S60 8 66 36 C70 50 78 44 84 30 S96 22 100 36 S114 48 122 30 C128 18 136 22 140 34 S156 44 182 20" fill="none" stroke="#0C1A33" strokeWidth="2.4" strokeLinecap="round" style={{ strokeDasharray: 420, strokeDashoffset: 0, animation: 'sig .9s ease-out' }} /></svg>
            ) : <span style={{ color: 'var(--ink-3)', fontSize: 13, display: 'flex', alignItems: 'center', gap: 6 }}><Icon n="pen" s={15} />Tap to sign</span>}
            <style>{'@keyframes sig{from{stroke-dashoffset:420}to{stroke-dashoffset:0}}'}</style>
          </button>
        </div>
      </>
    ),
    footer: (
      <button className="btn primary" disabled={!agree || !signed} onClick={() => { setCertified(true); setDone(true); toast('Logs certified for Nov 13', '#14A86B'); }}>
        <Icon n="shield" s={17} />Agree &amp; Certify
      </button>
    ),
  };
}

/* ───────── DVIR inspection ───────── */
const INSP_ITEMS = [
  { k: 'brakes', l: 'Brakes', s: 'Service, parking & air pressure', n: 'disc' },
  { k: 'tires', l: 'Tires & Wheels', s: 'Tread depth, inflation, lug nuts', n: 'wheel' },
  { k: 'lights', l: 'Lights & Reflectors', s: 'Head, tail, brake, turn, marker', n: 'sun' },
  { k: 'steering', l: 'Steering', s: 'Wheel play, linkage, power steering', n: 'nav' },
  { k: 'mirrors', l: 'Mirrors & Glass', s: 'Mounts, cracks, visibility', n: 'mirror' },
  { k: 'coupling', l: 'Coupling Devices', s: 'Fifth wheel, kingpin, safety chains', n: 'hitch' },
];
function InspectFlow({ close, toast, startDefect }) {
  const { setInspections, setPreTripDone, preTripDone } = useStore();
  const [type, setType] = useState(preTripDone ? 'Post-trip' : 'Pre-trip');
  const [res, setRes] = useState(startDefect ? { lights: 'd' } : {});
  const [notes, setNotes] = useState({});
  const [odo] = useState('412,886');
  const [signed, setSigned] = useState(false);
  const [done, setDone] = useState(null);
  const n = Object.keys(res).length;
  const defects = Object.entries(res).filter(([, v]) => v === 'd').map(([k]) => k);

  if (done) {
    return {
      body: (
        <>
          <Success title="Inspection submitted" id={done.id}>
            {defects.length ? `${type} report filed with ${defects.length} defect${defects.length > 1 ? 's' : ''}. Your fleet manager and maintenance have been notified.` : `${type} report filed. Vehicle condition satisfactory — you're cleared to drive.`}
          </Success>
          <div className="card" style={{ padding: '2px 14px' }}>
            <div className="kv"><span>Vehicle</span><b>#2048 · TR-5531</b></div>
            <div className="kv"><span>Items passed</span><b style={{ color: 'var(--green)' }}>{6 - defects.length} / 6</b></div>
            <div className="kv"><span>Defects</span><b style={{ color: defects.length ? 'var(--red)' : 'var(--ink)' }}>{defects.length ? defects.map((d) => INSP_ITEMS.find((i) => i.k === d).l).join(', ') : 'None'}</b></div>
            <div className="kv"><span>Signed</span><b>{fmtClock(NOW_MIN)} · M. Anderson</b></div>
          </div>
        </>
      ),
      footer: <button className="btn dark" onClick={close}>Done</button>,
    };
  }

  const submit = () => {
    const id = 'DVIR-' + (1108 + Math.floor(Math.random() * 20));
    setInspections((L) => [{ id, type, when: 'Nov 13 · ' + fmtClock(NOW_MIN), result: defects.length ? `Defect · ${defects.map((d) => INSP_ITEMS.find((i) => i.k === d).l).join(', ')}` : 'No defects', ok: !defects.length }, ...L]);
    if (type === 'Pre-trip') setPreTripDone(true);
    setDone({ id });
    toast(`${type} DVIR submitted`, defects.length ? '#E5484D' : '#14A86B');
  };

  return {
    body: (
      <>
        <div className="seg">
          {['Pre-trip', 'Post-trip'].map((t) => <button key={t} className={type === t ? 'on' : ''} onClick={() => setType(t)}>{t}</button>)}
          <div style={{ marginLeft: 'auto', fontSize: 11.5, color: 'var(--ink-3)', alignSelf: 'center' }} className="mono">ODO {odo}</div>
        </div>
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--ink-2)', marginBottom: 6 }}>
            <span><b>{n}</b> of 6 checked</span>
            {defects.length > 0 && <span style={{ color: 'var(--red)', fontWeight: 600 }}>{defects.length} defect{defects.length > 1 ? 's' : ''}</span>}
          </div>
          <div className="progress-line"><i style={{ width: (n / 6) * 100 + '%', background: defects.length ? 'var(--orange)' : 'var(--blue)' }} /></div>
        </div>
        {INSP_ITEMS.map((it) => {
          const v = res[it.k];
          return (
            <div key={it.k} className="insp" style={v === 'd' ? { borderColor: '#F5B5B7' } : v === 'p' ? { borderColor: '#BFE7D5' } : {}}>
              <div className="insp-top">
                <div className="insp-ic" style={v ? { background: v === 'p' ? 'var(--green-soft)' : 'var(--red-soft)', color: v === 'p' ? 'var(--green)' : 'var(--red)' } : { color: 'var(--ink-2)' }}><Icon n={it.n} s={18} /></div>
                <div style={{ flex: 1 }}><div className="in">{it.l}</div><div className="is">{it.s}</div></div>
              </div>
              <div className="pf">
                <button className={'p' + (v === 'p' ? ' on' : '')} onClick={() => setRes({ ...res, [it.k]: 'p' })}><Icon n="check" s={15} w={2.4} />Passed</button>
                <button className={'d' + (v === 'd' ? ' on' : '')} onClick={() => setRes({ ...res, [it.k]: 'd' })}><Icon n="alert" s={15} />Defect Found</button>
              </div>
              {v === 'd' && (
                <div style={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <textarea className="ta" rows={2} placeholder="Describe the defect…" value={notes[it.k] ?? (it.k === 'lights' ? 'Left rear marker lamp out' : '')} onChange={(e) => setNotes({ ...notes, [it.k]: e.target.value })} />
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button className="seg" style={{ display: 'contents' }}><span style={{ height: 34, padding: '0 12px', borderRadius: 10, border: '1px solid var(--line)', background: '#fff', fontSize: 12, fontWeight: 500, display: 'inline-flex', alignItems: 'center', gap: 6 }}><Icon n="camera" s={14} />Add photo</span></button>
                    <span style={{ height: 34, padding: '0 12px', borderRadius: 10, background: 'var(--red-soft)', color: 'var(--red)', fontSize: 12, fontWeight: 600, display: 'inline-flex', alignItems: 'center' }}>Minor · safe to operate?</span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
        <button className={'check tap' + (signed ? ' on' : '')} onClick={() => setSigned(!signed)}>
          <span className="box">{signed && <Icon n="check" s={12} w={3} />}</span>
          I certify this vehicle has been inspected in accordance with 49 CFR 396 and the above report is accurate.
        </button>
      </>
    ),
    footer: (
      <button className="btn primary" disabled={n < 6 || !signed} onClick={submit}
        style={defects.length && n === 6 && signed ? { background: 'var(--red)', boxShadow: '0 6px 16px rgba(229,72,77,.3)' } : {}}>
        <Icon n="upload" s={17} />{n < 6 ? `Check ${6 - n} more item${6 - n > 1 ? 's' : ''}` : defects.length ? 'Submit with Defects' : 'Submit Inspection'}
      </button>
    ),
  };
}

function HistoryBody() {
  const { inspections } = useStore();
  return (
    <div className="card" style={{ padding: '4px 14px' }}>
      {inspections.map((x) => (
        <div key={x.id} className="event">
          <div style={{ width: 34, height: 34, borderRadius: 10, background: x.ok ? 'var(--green-soft)' : 'var(--red-soft)', color: x.ok ? 'var(--green)' : 'var(--red)', display: 'grid', placeItems: 'center' }}><Icon n={x.ok ? 'check' : 'alert'} s={16} w={2.2} /></div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 13, fontWeight: 600 }}>{x.type} <span className="mono" style={{ fontSize: 11, color: 'var(--ink-3)', fontWeight: 500 }}>{x.id}</span></div>
            <div style={{ fontSize: 11.5, color: x.ok ? 'var(--ink-3)' : 'var(--red)' }}>{x.result}</div>
          </div>
          <div style={{ fontSize: 11, color: 'var(--ink-3)', textAlign: 'right' }}>{x.when}</div>
        </div>
      ))}
    </div>
  );
}

/* ───────── Trip details ───────── */
function TripBody() {
  const stops = [
    { t: 'Pickup', n: 'DFW Distribution Center', a: '2400 Singleton Blvd, Dallas, TX', time: 'Arr 5:30 · Dep 7:00 AM', done: true },
    { t: 'Fuel', n: 'Pilot Travel Center #412', a: 'I-30 Exit 162, Mt Pleasant, TX', time: 'Now · 9:12 AM', cur: true },
    { t: 'Break (planned)', n: 'Love\'s #298', a: 'I-40 Exit 161, Prescott, AR', time: 'ETA 12:05 PM' },
    { t: 'Delivery', n: 'Mid-South Cold Storage', a: '4800 Shelby Dr, Memphis, TN', time: 'ETA 3:42 PM · Appt 4:30 PM' },
  ];
  return (
    <>
      <MiniMap height={180} />
      <div className="card" style={{ padding: 14 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8 }}>
          <div className="sum"><div className="sv">452 mi</div><div className="sl">Total</div></div>
          <div className="sum"><div className="sv">338 mi</div><div className="sl">Remaining</div></div>
          <div className="sum"><div className="sv" style={{ color: 'var(--green)' }}>3:42 PM</div><div className="sl">ETA CST</div></div>
        </div>
        <div style={{ marginTop: 14 }}>
          {stops.map((s, i) => (
            <div key={i} style={{ display: 'flex', gap: 12 }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 16 }}>
                <span style={{ width: 14, height: 14, borderRadius: '50%', marginTop: 2, flex: 'none', background: s.done ? '#14A86B' : s.cur ? '#2F6BFF' : '#fff', border: s.done || s.cur ? 'none' : '2px solid #C8D0DD', boxShadow: s.cur ? '0 0 0 4px rgba(47,107,255,.2)' : 'none' }} />
                {i < stops.length - 1 && <span style={{ width: 2, flex: 1, background: s.done ? '#14A86B' : '#E4E8F0', margin: '3px 0' }} />}
              </div>
              <div style={{ flex: 1, paddingBottom: 14 }}>
                <div className="eyebrow" style={{ color: s.cur ? 'var(--blue)' : undefined }}>{s.t}</div>
                <div style={{ fontSize: 13.5, fontWeight: 600, marginTop: 2 }}>{s.n}</div>
                <div style={{ fontSize: 12, color: 'var(--ink-3)' }}>{s.a}</div>
                <div className="mono" style={{ fontSize: 11.5, color: 'var(--ink-2)', marginTop: 3 }}>{s.time}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="card" style={{ padding: '2px 14px' }}>
        <div className="kv"><span>Trip ID</span><b className="mono">TRP-2048</b></div>
        <div className="kv"><span>Load</span><b>Refrigerated · 38,400 lb</b></div>
        <div className="kv"><span>Reefer setpoint</span><b className="mono">34 °F</b></div>
        <div className="kv"><span>Assigned truck</span><b>#2048 · Freightliner Cascadia</b></div>
        <div className="kv"><span>Trailer</span><b className="mono">TR-5531</b></div>
        <div className="kv"><span>Dispatcher</span><b>Sarah Kim · (214) 555‑0148</b></div>
      </div>
    </>
  );
}

/* ───────── Upload ───────── */
function UploadFlow({ docKey, close, toast }) {
  const { docs, setDocs } = useStore();
  const [k, setK] = useState(docKey || 'bol');
  const [phase, setPhase] = useState('pick'); // pick | uploading | done
  const [pct, setPct] = useState(0);
  const D = DOC_TYPES.find((d) => d.k === k);
  const fname = { bol: 'BOL_88412_signed.jpg', fuel: 'Pilot412_fuel_1113.jpg', delivery: 'POD_MidSouth_1113.pdf', vehicle: 'IFTA_Cab_Card_2048.pdf' }[k];
  useEffect(() => {
    if (phase !== 'uploading') return;
    let p = 0;
    const id = setInterval(() => {
      p += 7 + Math.random() * 14;
      if (p >= 100) { p = 100; clearInterval(id); setTimeout(() => { setPhase('done'); setDocs((x) => ({ ...x, [k]: { name: fname, at: 'Just now' } })); toast(`${D.l} uploaded`, '#14A86B'); }, 250); }
      setPct(Math.round(p));
    }, 140);
    return () => clearInterval(id);
  }, [phase]);

  if (phase === 'done') {
    return {
      body: (
        <>
          <Success title="Upload complete" id={`DOC-${k.toUpperCase()}-${2048}`}>{D.l} attached to trip TRP-2048 and shared with dispatch.</Success>
          <div className="upl-row">
            <div style={{ width: 44, height: 54, borderRadius: 8, background: 'repeating-linear-gradient(135deg,#EEF1F6 0 6px,#F7F9FC 6px 12px)', border: '1px solid var(--line)', display: 'grid', placeItems: 'center' }}><Icon n="file" s={18} c="#7A869C" /></div>
            <div style={{ flex: 1 }}><div style={{ fontSize: 13, fontWeight: 600 }}>{fname}</div><div style={{ fontSize: 11.5, color: 'var(--ink-3)' }}>1.8 MB · OCR: BOL #88412 detected</div></div>
            <Icon n="check" s={18} c="#14A86B" w={2.4} />
          </div>
        </>
      ),
      footer: <div style={{ display: 'flex', gap: 8 }}><button className="btn line" onClick={() => { setPhase('pick'); setPct(0); }}>Upload another</button><button className="btn dark" onClick={close}>Done</button></div>,
    };
  }
  return {
    body: (
      <>
        <div className="seg">
          {DOC_TYPES.map((d) => <button key={d.k} className={k === d.k ? 'on' : ''} onClick={() => phase === 'pick' && setK(d.k)}>{d.l}</button>)}
        </div>
        {docs[k] && phase === 'pick' && (
          <div style={{ fontSize: 12, color: 'var(--ink-2)', display: 'flex', gap: 6, alignItems: 'center' }}><Icon n="check" s={14} c="#14A86B" w={2.4} />Current: <b>{docs[k].name}</b></div>
        )}
        {phase === 'pick' ? (
          <>
            <button className="tap" onClick={() => setPhase('uploading')} style={{ height: 170, borderRadius: 20, border: '2px dashed #B9C8EA', background: 'linear-gradient(180deg,#F5F8FF,#EEF3FF)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
              <div style={{ width: 56, height: 56, borderRadius: 18, background: 'var(--blue)', color: '#fff', display: 'grid', placeItems: 'center', boxShadow: '0 8px 20px rgba(47,107,255,.35)' }}><Icon n="camera" s={26} /></div>
              <div style={{ fontSize: 14.5, fontWeight: 600 }}>Scan {D.l}</div>
              <div style={{ fontSize: 12, color: 'var(--ink-3)' }}>Auto-crop & enhance · edges detected</div>
            </button>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              <button className="upl-row tap" onClick={() => setPhase('uploading')}><Icon n="image" s={18} c="#7A5AF8" /><span style={{ fontSize: 13, fontWeight: 600 }}>Photo library</span></button>
              <button className="upl-row tap" onClick={() => setPhase('uploading')}><Icon n="folder" s={18} c="#F08C1A" /><span style={{ fontSize: 13, fontWeight: 600 }}>Browse files</span></button>
            </div>
            <div style={{ fontSize: 11.5, color: 'var(--ink-3)', lineHeight: 1.5 }}>Accepted: JPG, PNG, PDF up to 20 MB. Files are encrypted in transit and linked to the active trip.</div>
          </>
        ) : (
          <div className="card" style={{ padding: 16 }}>
            <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
              <div style={{ width: 44, height: 54, borderRadius: 8, background: 'repeating-linear-gradient(135deg,#EEF1F6 0 6px,#F7F9FC 6px 12px)', border: '1px solid var(--line)', display: 'grid', placeItems: 'center' }}><Icon n="file" s={18} c="#7A869C" /></div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 600 }}>{fname}</div>
                <div className="mono" style={{ fontSize: 11.5, color: 'var(--ink-3)' }}>{(1.8 * pct / 100).toFixed(1)} / 1.8 MB · {pct}%</div>
              </div>
            </div>
            <div className="progress-line" style={{ marginTop: 12 }}><i style={{ width: pct + '%', transition: 'width .14s linear' }} /></div>
            <div style={{ fontSize: 12, color: 'var(--ink-2)', marginTop: 10 }}>{pct < 60 ? 'Uploading securely…' : 'Running OCR & attaching to TRP-2048…'}</div>
          </div>
        )}
      </>
    ),
    footer: null,
  };
}

function DocsListBody({ open }) {
  const { docs } = useStore();
  return (
    <>
      {DOC_TYPES.map((d) => (
        <button key={d.k} className="upl-row tap" onClick={() => open('upload', d.k)}>
          <div style={{ width: 40, height: 40, borderRadius: 12, background: d.c + '18', color: d.c, display: 'grid', placeItems: 'center' }}><Icon n={d.n} s={19} /></div>
          <div style={{ flex: 1 }}><div style={{ fontSize: 13.5, fontWeight: 600 }}>{d.l}</div><div style={{ fontSize: 11.5, color: docs[d.k] ? '#3E8F6B' : 'var(--ink-3)' }}>{docs[d.k] ? docs[d.k].name : 'Nothing uploaded'}</div></div>
          <Icon n={docs[d.k] ? 'check' : 'upload'} s={17} c={docs[d.k] ? '#14A86B' : '#7A869C'} />
        </button>
      ))}
      <div className="eyebrow" style={{ margin: '8px 2px 0' }}>Driver credentials</div>
      {[{ l: 'CDL Class A', s: 'TX · exp. Aug 2029' }, { l: 'DOT Medical Card', s: 'exp. Mar 2027' }, { l: 'ELD User Manual & Instruction Sheet', s: 'Required in cab' }].map((x) => (
        <div key={x.l} className="upl-row"><div style={{ width: 40, height: 40, borderRadius: 12, background: 'var(--slate-soft)', color: 'var(--slate)', display: 'grid', placeItems: 'center' }}><Icon n="shield" s={19} /></div><div style={{ flex: 1 }}><div style={{ fontSize: 13.5, fontWeight: 600 }}>{x.l}</div><div style={{ fontSize: 11.5, color: 'var(--ink-3)' }}>{x.s}</div></div><Icon n="chevR" s={16} c="#B9C3D3" /></div>
      ))}
    </>
  );
}

/* ───────── Report issue ───────── */
function ReportFlow({ close, toast }) {
  const { setTickets } = useStore();
  const [cat, setCat] = useState('');
  const [sev, setSev] = useState('Medium');
  const [txt, setTxt] = useState('');
  const [logs, setLogs] = useState(true);
  const [done, setDone] = useState(null);
  const cats = [
    { k: 'ELD connection', n: 'link' }, { k: 'GPS / location', n: 'gps' }, { k: 'Engine sync', n: 'engine' },
    { k: 'Log data error', n: 'logs' }, { k: 'App / device', n: 'phone' }, { k: 'Other', n: 'msg' },
  ];
  if (done) return {
    body: <>
      <Success title="Issue reported" id={done}>Fleet support has your report and device diagnostics. Per FMCSA guidance, if an ELD malfunction persists, keep paper logs and notify your carrier within 24 hours.</Success>
      <div className="card" style={{ padding: '2px 14px' }}>
        <div className="kv"><span>Category</span><b>{cat}</b></div>
        <div className="kv"><span>Severity</span><b>{sev}</b></div>
        <div className="kv"><span>Expected response</span><b>&lt; 30 min</b></div>
      </div>
    </>,
    footer: <button className="btn dark" onClick={close}>Done</button>,
  };
  return {
    body: (
      <>
        <div className="card" style={{ padding: 12, display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 6 }}>
          {[{ l: 'ELD', s: 'Connected', c: '#14A86B' }, { l: 'GPS', s: 'Locked', c: '#14A86B' }, { l: 'Engine', s: 'Synced', c: '#14A86B' }].map((x) => (
            <div key={x.l} style={{ textAlign: 'center' }}><div style={{ fontSize: 11, color: 'var(--ink-3)' }}>{x.l}</div><div style={{ fontSize: 12.5, fontWeight: 600, color: x.c, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5, marginTop: 2 }}><span style={{ width: 6, height: 6, borderRadius: '50%', background: x.c }} />{x.s}</div></div>
          ))}
        </div>
        <div>
          <div className="eyebrow" style={{ margin: '2px 2px 8px' }}>What's wrong?</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 6 }}>
            {cats.map((c) => (
              <button key={c.k} className="tap" onClick={() => setCat(c.k)} style={{ padding: '12px 6px', borderRadius: 14, border: '1.5px solid ' + (cat === c.k ? 'var(--blue)' : 'var(--line)'), background: cat === c.k ? 'var(--blue-soft)' : '#fff', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, fontSize: 11.5, fontWeight: 600, color: cat === c.k ? 'var(--blue)' : 'var(--ink-2)' }}>
                <Icon n={c.n} s={18} />{c.k}
              </button>
            ))}
          </div>
        </div>
        <div>
          <div className="eyebrow" style={{ margin: '2px 2px 8px' }}>Severity</div>
          <div className="seg">{['Low', 'Medium', 'High – can\'t log'].map((s) => <button key={s} className={sev === s ? 'on' : ''} onClick={() => setSev(s)}>{s}</button>)}</div>
        </div>
        <textarea className="ta" rows={3} placeholder="Describe what happened (optional)…" value={txt} onChange={(e) => setTxt(e.target.value)} />
        <button className={'check tap' + (logs ? ' on' : '')} onClick={() => setLogs(!logs)}>
          <span className="box">{logs && <Icon n="check" s={12} w={3} />}</span>
          Attach device diagnostics & last 24h event log
        </button>
      </>
    ),
    footer: (
      <button className="btn primary" disabled={!cat} onClick={() => { const id = 'TKT-' + (40210 + Math.floor(Math.random() * 80)); setTickets((t) => [{ id, cat }, ...t]); setDone(id); toast('Issue reported to fleet support', '#2F6BFF'); }}>
        <Icon n="upload" s={17} />Submit Report
      </button>
    ),
  };
}

/* ───────── Notifications / Profile ───────── */
function NotifBody() {
  const items = [
    { c: '#F08C1A', n: 'clock', t: '30-min break due in 4h 24m', s: 'Plan a stop near Prescott, AR', w: '2m' },
    { c: '#2F6BFF', n: 'msg', t: 'Dispatch: Appt confirmed 4:30 PM', s: 'Sarah Kim · Mid-South Cold Storage', w: '38m' },
    { c: '#E5484D', n: 'alert', t: 'Unidentified driving detected', s: '0.4 mi on Nov 12 · review & assign', w: '1h' },
    { c: '#14A86B', n: 'shield', t: 'Nov 12 logs certified', s: 'Synced to carrier', w: '13h' },
  ];
  return (
    <div className="card" style={{ padding: '4px 14px' }}>
      {items.map((x, i) => (
        <div key={i} className="event">
          <div style={{ width: 34, height: 34, borderRadius: 10, background: x.c + '1A', color: x.c, display: 'grid', placeItems: 'center' }}><Icon n={x.n} s={16} /></div>
          <div style={{ flex: 1 }}><div style={{ fontSize: 13, fontWeight: 600 }}>{x.t}</div><div style={{ fontSize: 11.5, color: 'var(--ink-3)' }}>{x.s}</div></div>
          <div style={{ fontSize: 11, color: 'var(--ink-3)' }}>{x.w}</div>
        </div>
      ))}
    </div>
  );
}
function ProfileBody() {
  return (
    <>
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ height: 96, position: 'relative' }}>
          <img src="assets/truck1.jpg" alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg,rgba(6,14,31,0),rgba(6,14,31,.55))' }} />
        </div>
        <div style={{ padding: '0 14px 14px', marginTop: -26, position: 'relative', display: 'flex', alignItems: 'flex-end', gap: 12 }}>
          <div className="avatar" style={{ width: 60, height: 60, borderRadius: 18, border: '3px solid #fff', fontSize: 20 }}>MA</div>
          <div style={{ paddingBottom: 4 }}><div style={{ fontWeight: 600, fontSize: 16 }}>Michael Anderson</div><div style={{ fontSize: 12, color: 'var(--ink-3)' }}>Driver ID MA-20481 · Anderson Freight LLC</div></div>
        </div>
      </div>
      <div className="card" style={{ padding: '2px 14px' }}>
        <div className="kv"><span>CDL</span><b>Class A · TX</b></div>
        <div className="kv"><span>Home terminal</span><b>Dallas, TX (CST)</b></div>
        <div className="kv"><span>HOS ruleset</span><b>US Property 70/8</b></div>
        <div className="kv"><span>Vehicle</span><b>#2048 · Freightliner Cascadia</b></div>
      </div>
      <div className="card" style={{ padding: '2px 14px' }}>
        {[['gear', 'Settings'], ['phone', 'Contact fleet support'], ['logout', 'Sign out']].map(([n, l]) => (
          <div key={l} className="kv" style={{ justifyContent: 'flex-start', gap: 10 }}><Icon n={n} s={17} c="#44526B" /><b style={{ flex: 1, textAlign: 'left' }}>{l}</b><Icon n="chevR" s={15} c="#B9C3D3" /></div>
        ))}
      </div>
    </>
  );
}

/* ───────── Router ───────── */
function FlowHost({ sheet: liveSheet, close, open, toast }) {
  const lastRef = useRef(null);
  const slot = useRef({ set: null });
  if (liveSheet) lastRef.current = liveSheet;
  const sheet = liveSheet || lastRef.current;
  const k = sheet && sheet.k;
  const arg = sheet && sheet.arg;
  const dm = (k === 'duty' && DUTY[arg]) || null;
  const meta = {
    hos: { t: 'Hours of Service', sub: 'Remaining time breakdown', icon: <SheetIcon n="clock" />, full: true },
    duty: { t: 'Change duty status', sub: 'This creates a new RODS event', icon: <SheetIcon n={dm ? dm.icon : 'clock'} c={dm ? dm.c : undefined} bg={dm ? dm.soft : undefined} /> },
    logs: { t: 'ELD Log Timeline', sub: arg && arg !== 13 ? `Nov ${arg}, 2026` : 'Thu, Nov 13, 2026 · today', icon: <SheetIcon n="logs" />, full: true },
    certify: { t: 'Review & Certify', sub: 'Record of Duty Status', icon: <SheetIcon n="pen" />, full: true },
    inspect: { t: 'Vehicle Inspection', sub: 'DVIR · Truck #2048 · Trailer TR-5531', icon: <SheetIcon n="clipboard" c="#14A86B" bg="#E3F6EE" />, full: true },
    defect: { t: 'Report a Defect', sub: 'DVIR · Truck #2048', icon: <SheetIcon n="alert" c="#E5484D" bg="#FDE8E9" />, full: true },
    history: { t: 'Inspection History', sub: 'Last 30 days', icon: <SheetIcon n="history" c="#14A86B" bg="#E3F6EE" /> },
    trip: { t: 'Trip TRP-2048', sub: 'Dallas, TX → Memphis, TN', icon: <SheetIcon n="route" />, full: true },
    upload: { t: 'Upload Document', sub: 'Attach to TRP-2048', icon: <SheetIcon n="upload" c="#7A5AF8" bg="#EFEBFE" /> },
    docs: { t: 'My Documents', sub: 'Trip & driver documents', icon: <SheetIcon n="folder" c="#7A5AF8" bg="#EFEBFE" />, full: true },
    report: { t: 'Report ELD Issue', sub: 'Diagnostics & malfunctions', icon: <SheetIcon n="alert" c="#E5484D" bg="#FDE8E9" />, full: true },
    notif: { t: 'Notifications', sub: '4 new', icon: <SheetIcon n="bell" /> },
    profile: { t: 'Profile', icon: <SheetIcon n="user" /> },
  };
  const m = k ? meta[k] : {};
  return (
    <Sheet open={!!liveSheet} onClose={close} title={m.t} sub={m.sub} icon={m.icon} full={m.full}
      footer={k ? <FooterSlot key={k + ':' + arg + ':' + sheet.n} slot={slot} /> : null}>
      {k && <FlowBody key={k + ':' + arg + ':' + sheet.n} slot={slot} k={k} arg={arg} close={close} open={open} toast={toast} />}
    </Sheet>
  );
}

// Footer slot: flow bodies push their footer into a sibling slot (per-phone)
function FooterSlot({ slot }) {
  const [node, setNode] = useState(null);
  slot.current.set = setNode;
  return node ? <div className="sheet-f">{node}</div> : null;
}

function FlowBody({ k, arg, close, open, toast, slot }) {
  let r;
  switch (k) {
    case 'hos': r = { body: <HosSheet focus={arg} close={close} />, footer: <button className="btn ghost" onClick={() => open('logs')}><Icon n="logs" s={17} />View ELD Logs</button> }; break;
    case 'duty': r = DutySheetBody({ target: arg, close, toast }); break;
    case 'logs': r = { body: <LogsSheetBody day={arg} />, footer: <button className="btn primary" onClick={() => open('certify', arg)}><Icon n="pen" s={17} />Review &amp; Certify Logs</button> }; break;
    case 'certify': r = CertifyFlow({ day: arg, close, toast }); break;
    case 'inspect': r = InspectFlow({ close, toast }); break;
    case 'defect': r = InspectFlow({ close, toast, startDefect: true }); break;
    case 'history': r = { body: <HistoryBody />, footer: <button className="btn dark" onClick={() => open('inspect')}><Icon n="clipboard" s={17} />Start Inspection</button> }; break;
    case 'trip': r = { body: <TripBody />, footer: <div style={{ display: 'flex', gap: 8 }}><button className="btn line" onClick={() => toast('Calling dispatch…', '#2F6BFF')}><Icon n="phone" s={16} />Dispatch</button><button className="btn primary" onClick={() => toast('Opening truck-safe navigation', '#2F6BFF')}><Icon n="nav" s={16} />Navigate</button></div> }; break;
    case 'upload': r = UploadFlow({ docKey: arg, close, toast }); break;
    case 'docs': r = { body: <DocsListBody open={open} />, footer: null }; break;
    case 'report': r = ReportFlow({ close, toast }); break;
    case 'notif': r = { body: <NotifBody />, footer: null }; break;
    case 'profile': r = { body: <ProfileBody />, footer: null }; break;
    default: r = { body: null };
  }
  useEffect(() => { slot.current.set && slot.current.set(r.footer || null); });
  return r.body;
}

Object.assign(window, { FlowHost });
