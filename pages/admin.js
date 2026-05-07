import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

const BRAND = {
  bg: '#f7f6f2', surface: '#ffffff', card: '#f0ede6',
  border: '#e0dbd0', accent: '#b8922a', text: '#1a1a16', muted: '#7a7668',
};

const DIMS = [
  { id: 'confianza',    label: 'Confianza',            tag: 'Lencioni', color: '#7a6ecc' },
  { id: 'debate',       label: 'Debate productivo',    tag: 'Lencioni', color: '#4a9e8a' },
  { id: 'compromiso',   label: 'Compromiso',           tag: 'Lencioni', color: '#b8922a' },
  { id: 'alineamiento', label: 'Alineamiento',         tag: 'ARE',      color: '#4a7ecc' },
  { id: 'ejecucion',    label: 'Ejecución',            tag: 'ARE',      color: '#5a9e4a' },
  { id: 'renovacion',   label: 'Renovación constante', tag: 'ARE',      color: '#c85a6a' },
];

const OPEN_QS = [
  { id: 'orgulho',    text: '¿De qué estás más orgulloso/a de este equipo?' },
  { id: 'mejora',     text: '¿Qué es lo que más necesita mejorar para ser un equipo de alto rendimiento?' },
  { id: 'bloqueador', text: '¿Qué bloquea el desempeño del equipo?' },
  { id: 'accion',     text: 'Si pudieras cambiar una sola cosa en la dinámica del equipo, ¿qué sería?' },
];

const Q_PER_DIM = 4;

function calcScores(responses) {
  const scores = {};
  DIMS.forEach(d => {
    const all = responses.flatMap(r =>
      Array.from({ length: Q_PER_DIM }, (_, i) => r.ratings?.[`${d.id}_${i}`]).filter(Boolean)
    );
    scores[d.id] = all.length ? all.reduce((a, b) => a + b, 0) / all.length : 0;
  });
  return scores;
}

function RadarChart({ scores }) {
  const cx = 150, cy = 150, r = 105, n = DIMS.length;
  const angle = (i) => (Math.PI * 2 * i) / n - Math.PI / 2;
  const gridPts = (lvl) => DIMS.map((_, i) => {
    const rad = (lvl / 5) * r;
    return `${cx + rad * Math.cos(angle(i))},${cy + rad * Math.sin(angle(i))}`;
  }).join(' ');
  const dataPts = DIMS.map((d, i) => {
    const rad = ((scores[d.id] || 0) / 5) * r;
    return `${cx + rad * Math.cos(angle(i))},${cy + rad * Math.sin(angle(i))}`;
  }).join(' ');

  return (
    <svg viewBox="0 0 300 300" style={{ width: '100%', maxWidth: 280 }}>
      {[1,2,3,4,5].map(l => <polygon key={l} points={gridPts(l)} fill="none"
        stroke={l===5?'#ccc8be':'#e8e4dc'} strokeWidth={l===5?'1':'0.5'} />)}
      {DIMS.map((_, i) => <line key={i} x1={cx} y1={cy}
        x2={cx + r * Math.cos(angle(i))} y2={cy + r * Math.sin(angle(i))}
        stroke="#e0dbd0" strokeWidth="0.5" />)}
      <polygon points={dataPts} fill="rgba(184,146,42,0.12)" stroke="#b8922a" strokeWidth="1.5" />
      {DIMS.map((d, i) => {
        const rad = ((scores[d.id] || 0) / 5) * r;
        return <circle key={i} cx={cx + rad * Math.cos(angle(i))} cy={cy + rad * Math.sin(angle(i))}
          r="4" fill={d.color} stroke="#fff" strokeWidth="1.5" />;
      })}
      {DIMS.map((d, i) => {
        const lr = r + 22;
        return <text key={i} x={cx + lr * Math.cos(angle(i))} y={cy + lr * Math.sin(angle(i))}
          textAnchor="middle" dominantBaseline="middle"
          style={{ fontSize: 9, fill: d.color, fontWeight: 500, fontFamily: 'sans-serif' }}>{d.label}</text>;
      })}
    </svg>
  );
}

export default function Admin() {
  const [auth, setAuth] = useState(false);
  const [pwd, setPwd] = useState('');
  const [error, setError] = useState('');
  const [responses, setResponses] = useState([]);
  const [tab, setTab] = useState('resumen');

  const login = () => {
    if (pwd === process.env.NEXT_PUBLIC_ADMIN_PASSWORD) {
      setAuth(true);
      loadData();
    } else {
      setError('Clave incorrecta');
    }
  };

  const loadData = async () => {
    const { data } = await supabase.from('responses').select('*').order('created_at', { ascending: false });
    setResponses(data || []);
  };

  const Header = () => (
    <div style={{ background: '#fff', borderBottom: `1px solid ${BRAND.border}`, padding: '14px 24px',
      display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <img src="https://stars-companies.cl/wp-content/uploads/2024/11/Stars-Companies-Blanco.png"
        alt="STARS" style={{ height: 34, objectFit: 'contain' }} />
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <span style={{ fontSize: 11, color: BRAND.muted }}>{responses.length} respuestas</span>
        <button onClick={loadData} style={{ fontSize: 11, color: BRAND.accent,
          background: 'none', border: 'none', cursor: 'pointer' }}>↻ Actualizar</button>
      </div>
    </div>
  );

  if (!auth) return (
    <div style={{ background: BRAND.bg, minHeight: '100vh', display: 'flex',
      alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ background: '#fff', border: `1px solid ${BRAND.border}`, borderRadius: 12,
        padding: '2rem', width: 320, textAlign: 'center' }}>
        <img src="https://stars-companies.cl/wp-content/uploads/2024/04/Logos-11-uai-258x258.png"
          alt="STARS" style={{ height: 40, objectFit: 'contain', marginBottom: 20 }} />
        <h2 style={{ fontSize: 16, fontWeight: 500, color: BRAND.text, marginBottom: 20 }}>
          Acceso a resultados
        </h2>
        <input type="password" value={pwd} onChange={e => setPwd(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && login()} placeholder="Clave de acceso"
          style={{ width: '100%', boxSizing: 'border-box', marginBottom: 12, padding: '10px 12px',
            border: `1px solid ${BRAND.border}`, borderRadius: 8, fontSize: 14, background: BRAND.bg }} />
        {error && <p style={{ fontSize: 12, color: '#9e3030', marginBottom: 10 }}>{error}</p>}
        <button onClick={login} style={{ width: '100%', padding: 10, background: BRAND.accent,
          color: '#fff', border: 'none', borderRadius: 8, fontSize: 14, fontWeight: 500, cursor: 'pointer' }}>
          Ingresar →
        </button>
      </div>
    </div>
  );

  const scores = calcScores(responses);
  const overall = (DIMS.reduce((a, d) => a + (scores[d.id] || 0), 0) / DIMS.length).toFixed(1);
  const sorted = [...DIMS].sort((a, b) => scores[b.id] - scores[a.id]);
  const strengths  = sorted.filter(d => scores[d.id] >= 4);
  const developing = sorted.filter(d => scores[d.id] >= 3 && scores[d.id] < 4);
  const critical   = sorted.filter(d => scores[d.id] < 3);

  const tabs = [
    { id: 'resumen',     label: 'Resumen' },
    { id: 'dimensiones', label: 'Dimensiones' },
    { id: 'cualitativo', label: 'Voz del equipo' },
  ];

  return (
    <div style={{ background: BRAND.bg, minHeight: '100vh', color: BRAND.text,
      fontFamily: "'Helvetica Neue', Arial, sans-serif" }}>
      <Header />
      <div style={{ background: '#fff', borderBottom: `1px solid ${BRAND.border}`,
        padding: '0 24px', display: 'flex' }}>
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{ padding: '12px 18px',
            fontSize: 13, background: 'none', border: 'none', cursor: 'pointer',
            borderBottom: tab === t.id ? `2px solid ${BRAND.accent}` : '2px solid transparent',
            color: tab === t.id ? BRAND.accent : BRAND.muted,
            fontWeight: tab === t.id ? 500 : 400 }}>{t.label}</button>
        ))}
      </div>

      <div style={{ maxWidth: 720, margin: '0 auto', padding: '1.5rem' }}>

        {tab === 'resumen' && (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 10, marginBottom: 24 }}>
              {[
                { label: 'Índice global',  value: overall + '/5',    color: BRAND.accent },
                { label: 'Fortalezas',     value: strengths.length,  color: '#2e7d52' },
                { label: 'En desarrollo',  value: developing.length, color: '#a06820' },
                { label: 'Áreas críticas', value: critical.length,   color: '#9e3030' },
              ].map(c => (
                <div key={c.label} style={{ background: '#fff', border: `1px solid ${BRAND.border}`,
                  borderRadius: 10, padding: 14, textAlign: 'center' }}>
                  <div style={{ fontSize: 24, fontWeight: 500, color: c.color, marginBottom: 4 }}>{c.value}</div>
                  <div style={{ fontSize: 11, color: BRAND.muted, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{c.label}</div>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
              <div style={{ flex: '0 0 auto' }}><RadarChart scores={scores} /></div>
              <div style={{ flex: 1, minWidth: 240 }}>
                {DIMS.map(d => {
                  const sc = scores[d.id] || 0;
                  const status = sc >= 4 ? 'Fortaleza' : sc >= 3 ? 'En desarrollo' : 'Área crítica';
                  const c = sc >= 4 ? '#2e7d52' : sc >= 3 ? '#a06820' : '#9e3030';
                  return (
                    <div key={d.id} style={{ marginBottom: 14 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <div style={{ width: 7, height: 7, borderRadius: '50%', background: d.color }} />
                          <span style={{ fontSize: 12, fontWeight: 500 }}>{d.label}</span>
                        </div>
                        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                          <span style={{ fontSize: 10, color: c, fontWeight: 500 }}>{status}</span>
                          <span style={{ fontSize: 13, fontWeight: 500 }}>{sc.toFixed(1)}</span>
                        </div>
                      </div>
                      <div style={{ height: 5, borderRadius: 3, background: BRAND.card }}>
                        <div style={{ height: '100%', width: `${Math.round((sc/5)*100)}%`,
                          borderRadius: 3, background: d.color }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {tab === 'dimensiones' && (
          <div>
            {DIMS.map(d => {
              const sc = scores[d.id] || 0;
              const status = sc >= 4 ? 'Fortaleza' : sc >= 3 ? 'En desarrollo' : 'Área crítica';
              const c = sc >= 4 ? '#2e7d52' : sc >= 3 ? '#a06820' : '#9e3030';
              return (
                <div key={d.id} style={{ background: '#fff', border: `1px solid ${BRAND.border}`,
                  borderRadius: 10, padding: '16px 18px', marginBottom: 12, borderLeft: `3px solid ${d.color}` }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontSize: 14, fontWeight: 500, color: d.color }}>{d.label}</span>
                      <span style={{ fontSize: 9, color: BRAND.muted, background: BRAND.card,
                        padding: '1px 5px', borderRadius: 8, border: `1px solid ${BRAND.border}` }}>{d.tag}</span>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <span style={{ fontSize: 22, fontWeight: 500, color: d.color }}>{sc.toFixed(1)}</span>
                      <span style={{ fontSize: 12, color: BRAND.muted }}>/5</span>
                      <div style={{ fontSize: 10, color: c, fontWeight: 500 }}>{status}</div>
                    </div>
                  </div>
                  <div style={{ height: 4, borderRadius: 2, background: BRAND.card }}>
                    <div style={{ height: '100%', width: `${Math.round((sc/5)*100)}%`,
                      borderRadius: 2, background: d.color }} />
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {tab === 'cualitativo' && (
          <div>
            <div style={{ marginBottom: 16, padding: '10px 14px', background: '#fff',
              border: `1px solid ${BRAND.border}`, borderRadius: 8, fontSize: 12,
              color: BRAND.muted, borderLeft: `3px solid ${BRAND.accent}` }}>
              Las respuestas se muestran tal como fueron escritas por cada persona.
            </div>
            {OPEN_QS.map((q, qi) => (
              <div key={q.id} style={{ marginBottom: 24 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                  <span style={{ fontSize: 11, color: BRAND.accent, fontWeight: 500 }}>0{qi + 1}</span>
                  <span style={{ fontSize: 13, fontWeight: 500 }}>{q.text}</span>
                </div>
                {responses.map((r, i) => r.open_answers?.[q.id] ? (
                  <div key={i} style={{ background: '#fff', border: `1px solid ${BRAND.border}`,
                    borderRadius: 8, padding: '10px 14px', marginBottom: 8, borderLeft: `2px solid ${BRAND.border}` }}>
                    <span style={{ fontSize: 11, color: BRAND.accent, marginRight: 8 }}>{r.name}</span>
                    <span style={{ fontSize: 13, lineHeight: 1.6 }}>{r.open_answers[q.id]}</span>
                  </div>
                ) : null)}
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
