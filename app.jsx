// app.jsx — two live phones sharing one driver session

function BottomNav({ tab, onTab }) {
  const items = [
    { k: 'home', n: 'home', l: 'Home' }, { k: 'logs', n: 'logs', l: 'Logs' }, { k: 'trips', n: 'route', l: 'Trips' },
    { k: 'vehicle', n: 'truck', l: 'Vehicle' }, { k: 'profile', n: 'user', l: 'Profile' },
  ];
  return (
    <div className="nav">
      {items.map((it) => (
        <button key={it.k} className={'nav-i' + (tab === it.k ? ' on' : '')} onClick={() => onTab(it.k)}>
          <Icon n={it.n} s={21} w={tab === it.k ? 2.1 : 1.8} />{it.l}
        </button>
      ))}
    </div>
  );
}

function Phone({ initial, id }) {
  const key = 'hw_phone_' + id;
  const [tab, setTab] = useState(() => { const v = localStorage.getItem(key); return v && v !== 'profile' ? v : initial; });
  const prevTab = useRef(tab);
  const [sheet, setSheet] = useState(null);
  const [toastMsg, setToast] = useState(null);
  const scrollRef = useRef(null);
  const nRef = useRef(0);
  const baseTab = tab === 'profile' ? prevTab.current : tab;
  const screen = baseTab === 'home' ? 'dash' : 'ops';

  useEffect(() => { localStorage.setItem(key, tab); if (tab !== 'profile') prevTab.current = tab; }, [tab]);

  const open = (k, arg) => { nRef.current++; setSheet({ k, arg, n: nRef.current }); };
  const close = () => setSheet(null);
  const toast = (m, c) => { setToast({ m, c, id: Date.now() }); };
  useEffect(() => { if (!toastMsg) return; const t = setTimeout(() => setToast(null), 2400); return () => clearTimeout(t); }, [toastMsg]);

  const scrollTo = (sel) => {
    requestAnimationFrame(() => {
      const sc = scrollRef.current; if (!sc) return;
      const cards = sc.querySelectorAll('.body > .card');
      const idx = { logs: 0, vehicle: 1, trips: 2 }[sel];
      const el = cards[idx];
      sc.scrollTo({ top: el ? Math.max(0, el.offsetTop - 120) : 0, behavior: 'smooth' });
    });
  };
  const onTab = (k) => {
    if (k === 'profile') { setTab('profile'); open('profile'); return; }
    setTab(k);
    if (k === 'home') { scrollRef.current && scrollRef.current.scrollTo({ top: 0, behavior: 'smooth' }); return; }
    if (k === 'logs') { scrollRef.current && scrollRef.current.scrollTo({ top: 0, behavior: 'smooth' }); return; }
    scrollTo(k);
  };
  // From dashboard, "logs" quick action switches to logs sheet; tab stays
  const closeWrap = () => { close(); if (tab === 'profile') setTab(prevTab.current); };

  return (
    <div className="phone" data-screen-label={id === 'a' ? '01 Driver Dashboard' : '02 Driver Operations'}>
      <div className="island" />
      <StatusBar dark />
      <div className="scroll" ref={scrollRef}>
        {screen === 'dash' ? <DashboardScreen open={open} /> : <OperationsScreen open={open} />}
      </div>
      <div className="navfade" />
      <BottomNav tab={tab} onTab={onTab} />
      {toastMsg && (
        <div className="toast" key={toastMsg.id}>
          <span style={{ width: 26, height: 26, borderRadius: 8, background: toastMsg.c, display: 'grid', placeItems: 'center', flex: 'none' }}><Icon n="check" s={14} w={2.8} c="#fff" /></span>
          {toastMsg.m}
        </div>
      )}
      <FlowHost sheet={sheet} close={closeWrap} open={open} toast={toast} />
      <div className="homebar" />
    </div>
  );
}

function Stage() {
  const ref = useRef(null);
  useEffect(() => {
    const fit = () => {
      const s = Math.min(window.innerWidth / 1080, window.innerHeight / 1010, 1.15);
      if (ref.current) ref.current.style.transform = `translate(-50%,-50%) scale(${s})`;
    };
    fit(); window.addEventListener('resize', fit); return () => window.removeEventListener('resize', fit);
  }, []);
  return (
    <div className="stage">
      <div className="canvas" ref={ref}>
        <div className="canvas-row">
          <div className="phone-col">
            <div className="phone-label"><b>01</b>Driver Dashboard &amp; ELD Overview</div>
            <Phone id="a" initial="home" />
          </div>
          <div className="phone-col">
            <div className="phone-label"><b>02</b>ELD Logs, Inspection &amp; Trips</div>
            <Phone id="b" initial="logs" />
          </div>
        </div>
        <div className="canvas-foot">Both screens share one live driver session — change duty status on <span>01</span> and watch the RODS log update on <span>02</span>. Illustrative data only.</div>
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<StoreProvider><Stage /></StoreProvider>);
