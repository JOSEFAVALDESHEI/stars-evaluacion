import { useState } from 'react';
import { supabase } from '../lib/supabase';

const BRAND = {
  bg: '#f7f6f2', surface: '#ffffff', card: '#f0ede6',
  border: '#e0dbd0', accent: '#b8922a', text: '#1a1a16', muted: '#7a7668',
};

const DIMS = [
  { id: 'confianza', label: 'Confianza', tag: 'Lencioni', accent: '#7a6ecc',
    desc: 'Vulnerabilidad, apertura y seguridad psicológica en el equipo.',
    questions: [
      'Los miembros del equipo admiten sus errores y debilidades abiertamente.',
      'Las personas piden ayuda a sus pares sin sentir que eso las hace ver mal.',
      'Se conocen bien entre sí más allá del rol profesional.',
      'Existe seguridad psicológica para expresar opiniones distintas.',
    ]},
  { id: 'debate', label: 'Debate productivo', tag: 'Lencioni', accent: '#4a9e8a',
    desc: 'Debates honestos, sin filtros, orientados a las mejores soluciones.',
    questions: [
      'Las reuniones incluyen debates reales, no solo validaciones.',
      'Las personas expresan desacuerdos aunque sean incómodos.',
      'Los conflictos se resuelven directamente entre las partes.',
      'No hay temas tabú que el equipo evita discutir.',
    ]},
  { id: 'compromiso', label: 'Compromiso', tag: 'Lencioni', accent: '#b8922a',
    desc: 'Decisiones respaldadas por todos, aunque no haya unanimidad.',
    questions: [
      'Cuando se toma una decisión, todos la respaldan públicamente.',
      'Los planes se cumplen con los plazos acordados.',
      'El equipo es claro sobre sus prioridades y no las cambia constantemente.',
      'No hay agendas paralelas que van en contra de lo acordado.',
    ]},
  { id: 'alineamiento', label: 'Alineamiento', tag: 'ARE', accent: '#4a7ecc',
    desc: 'Visión compartida, valores comunes y claridad de dirección.',
    questions: [
      'Todos los miembros pueden explicar la estrategia del equipo con las mismas palabras.',
      'Los valores y la forma de trabajar son consistentes en la práctica.',
      'Las decisiones importantes se toman considerando el propósito común.',
      'El equipo prioriza el éxito colectivo sobre el individual.',
    ]},
  { id: 'ejecucion', label: 'Ejecución', tag: 'ARE', accent: '#5a9e4a',
    desc: 'Cumplimiento disciplinado de compromisos y accountability mutuo.',
    questions: [
      'Los compromisos se cumplen de manera consistente.',
      'Existe un sistema claro de seguimiento de resultados.',
      'El equipo se pide cuentas entre sí, no solo hacia arriba.',
      'Se celebran los logros y se analizan los fracasos con honestidad.',
    ]},
  { id: 'renovacion', label: 'Renovación constante', tag: 'ARE', accent: '#c85a6a',
    desc: 'Aprendizaje continuo, adaptación y mejora del equipo.',
    questions: [
      'El equipo dedica tiempo a reflexionar sobre cómo mejorar su forma de trabajar.',
      'Se aprende activamente de los errores sin buscar culpables.',
      'El equipo incorpora perspectivas externas y nuevas ideas.',
      'Las personas se desarrollan profesionalmente dentro del equipo.',
    ]},
];

const SCALE = [
  { val: 1, label: 'Casi nunca' }, { val: 2, label: 'A veces' },
  { val: 3, label: 'Frecuente' }, { val: 4, label: 'Casi siempre' }, { val: 5, label: 'Siempre' },
];

const OPEN_QS = [
  { id: 'orgulho',    text: '¿De qué estás más orgulloso/a de este equipo?' },
  { id: 'mejora',     text: '¿Qué es lo que más necesita mejorar para ser un equipo de alto rendimiento?' },
  { id: 'bloqueador', text: '¿Qué bloquea el desempeño del equipo?' },
  { id: 'accion',     text: 'Si pudieras cambiar una sola cosa en la dinámica del equipo, ¿qué sería?' },
];

export default function Survey() {
  const [step, setStep] = useState('intro');
  const [name, setName] = useState('');
  const [ratings, setRatings] = useState({});
  const [openAns, setOpenAns] = useState({});
  const [dimIdx, setDimIdx] = useState(0);
  const [saving, setSaving] = useState(false);

  const totalQ = DIMS.reduce((a, d) => a + d.questions.length, 0);
  const progress = Math.round((Object.keys(ratings).length / totalQ) * 100);
  const dim = DIMS[dimIdx];

  const submit = async () => {
    setSaving(true);
    await supabase.from('responses').insert([{
      name: name || 'Anónimo',
      ratings,
      open_answers: openAns,
    }]);
    setSaving(false);
    setStep('thanks');
  };

  const Header = () => (
    <div style={{ background: '#fff', borderBottom: `1px solid ${BRAND.border}`, padding: '14px 24px',
      display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <img src="https://stars-companies.cl/wp-content/uploads/2024/04/Logos-11-uai-258x258.png"
        alt="STARS" style={{ height: 34, objectFit: 'contain' }} />
      <span style={{ fontSize: 11, color: BRAND.muted, letterSpacing: '0.07em', textTransform: 'uppercase' }}>
        Evaluación de equipo directivo
      </span>
    </div>
  );

  if (step === 'intro') return (
    <div style={{ background: BRAND.bg, minHeight: '100vh' }}>
      <Header />
      <div style={{ maxWidth: 580, margin: '0 auto', padding: '2rem 1.5rem' }}>
        <span style={{ fontSize: 11, color: BRAND.accent, letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 500 }}>
          Herramienta de diagnóstico
        </span>
        <h1 style={{ fontSize: 24, fontWeight: 400, color: BRAND.text, margin: '8px 0 10px', lineHeight: 1.3 }}>
          ¿Cómo funciona nuestro equipo como equipo de alto rendimiento?
        </h1>
        <p style={{ fontSize: 14, color: BRAND.muted, marginBottom: 28, lineHeight: 1.7 }}>
          Esta evaluación es confidencial. Tómate 8–10 minutos para reflexionar con honestidad.
          No hay respuestas correctas o incorrectas.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 28 }}>
          {DIMS.map(d => (
            <div key={d.id} style={{ background: '#fff', border: `1px solid ${BRAND.border}`,
              borderRadius: 10, padding: '12px 14px', borderLeft: `3px solid ${d.accent}` }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                <span style={{ fontSize: 12, fontWeight: 500, color: d.accent }}>{d.label}</span>
                <span style={{ fontSize: 9, color: BRAND.muted, background: BRAND.card,
                  padding: '1px 5px', borderRadius: 8, border: `1px solid ${BRAND.border}` }}>{d.tag}</span>
              </div>
              <div style={{ fontSize: 11, color: BRAND.muted, lineHeight: 1.4 }}>{d.desc}</div>
            </div>
          ))}
        </div>
        <label style={{ fontSize: 12, color: BRAND.muted, display: 'block', marginBottom: 6,
          textTransform: 'uppercase', letterSpacing: '0.05em' }}>Tu nombre (opcional)</label>
        <input value={name} onChange={e => setName(e.target.value)} placeholder="Nombre o iniciales"
          style={{ width: '100%', marginBottom: 18, boxSizing: 'border-box', background: '#fff',
            border: `1px solid ${BRAND.border}`, color: BRAND.text, borderRadius: 8,
            padding: '10px 12px', fontSize: 14 }} />
        <button onClick={() => setStep('survey')} style={{ width: '100%', padding: 12,
          background: BRAND.accent, color: '#fff', border: 'none', borderRadius: 8,
          fontSize: 14, fontWeight: 500, cursor: 'pointer' }}>
          Iniciar evaluación →
        </button>
      </div>
    </div>
  );

  if (step === 'survey') return (
    <div style={{ background: BRAND.bg, minHeight: '100vh' }}>
      <Header />
      <div style={{ maxWidth: 580, margin: '0 auto', padding: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
          <span style={{ fontSize: 11, color: BRAND.muted, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            {dimIdx + 1} / {DIMS.length} — {dim.label}
          </span>
          <span style={{ fontSize: 11, color: BRAND.accent }}>{progress}% completado</span>
        </div>
        <div style={{ height: 3, borderRadius: 2, background: BRAND.card, marginBottom: 22 }}>
          <div style={{ height: '100%', width: `${progress}%`, borderRadius: 2,
            background: BRAND.accent, transition: 'width 0.3s' }} />
        </div>
        <div style={{ background: '#fff', borderRadius: 10, padding: '14px 16px',
          marginBottom: 24, borderLeft: `3px solid ${dim.accent}` }}>
          <div style={{ fontSize: 14, fontWeight: 500, color: dim.accent, marginBottom: 4 }}>{dim.label}</div>
          <div style={{ fontSize: 12, color: BRAND.muted }}>{dim.desc}</div>
        </div>
        {dim.questions.map((q, qi) => {
          const key = `${dim.id}_${qi}`;
          return (
            <div key={key} style={{ marginBottom: 24, paddingBottom: 24, borderBottom: `1px solid ${BRAND.border}` }}>
              <p style={{ fontSize: 14, color: BRAND.text, marginBottom: 12, lineHeight: 1.6 }}>{q}</p>
              <div style={{ display: 'flex', gap: 6 }}>
                {SCALE.map(s => (
                  <button key={s.val} onClick={() => setRatings(r => ({ ...r, [key]: s.val }))}
                    style={{ flex: 1, padding: '8px 4px', borderRadius: 6, cursor: 'pointer',
                      background: ratings[key] === s.val ? dim.accent : '#fff',
                      border: `1px solid ${ratings[key] === s.val ? dim.accent : BRAND.border}`,
                      color: ratings[key] === s.val ? '#fff' : BRAND.muted }}>
                    <div style={{ fontSize: 13 }}>{'★'.repeat(s.val)}{'☆'.repeat(5 - s.val)}</div>
                    <div style={{ fontSize: 9, marginTop: 2 }}>{s.label}</div>
                  </button>
                ))}
              </div>
            </div>
          );
        })}
        <div style={{ display: 'flex', gap: 8 }}>
          {dimIdx > 0 && (
            <button onClick={() => setDimIdx(i => i - 1)} style={{ flex: 1, padding: 10,
              background: '#fff', border: `1px solid ${BRAND.border}`, color: BRAND.muted,
              borderRadius: 8, cursor: 'pointer', fontSize: 13 }}>← Anterior</button>
          )}
          {dimIdx < DIMS.length - 1 ? (
            <button onClick={() => setDimIdx(i => i + 1)} style={{ flex: 2, padding: 10,
              background: BRAND.accent, border: 'none', color: '#fff', borderRadius: 8,
              cursor: 'pointer', fontSize: 13, fontWeight: 500 }}>Siguiente →</button>
          ) : (
            <button onClick={() => setStep('open')} style={{ flex: 2, padding: 10,
              background: BRAND.accent, border: 'none', color: '#fff', borderRadius: 8,
              cursor: 'pointer', fontSize: 13, fontWeight: 500 }}>Reflexiones abiertas →</button>
          )}
        </div>
      </div>
    </div>
  );

  if (step === 'open') return (
    <div style={{ background: BRAND.bg, minHeight: '100vh' }}>
      <Header />
      <div style={{ maxWidth: 580, margin: '0 auto', padding: '1.5rem' }}>
        <span style={{ fontSize: 11, color: BRAND.accent, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
          Reflexiones cualitativas
        </span>
        <h2 style={{ fontSize: 20, fontWeight: 400, color: BRAND.text, margin: '6px 0 8px' }}>
          Tu perspectiva, con tus palabras
        </h2>
        <p style={{ fontSize: 13, color: BRAND.muted, marginBottom: 24, lineHeight: 1.6 }}>
          Estas respuestas son las más valiosas del diagnóstico. Sé específico/a y honesto/a.
        </p>
        {OPEN_QS.map((q, i) => (
          <div key={q.id} style={{ marginBottom: 20 }}>
            <label style={{ fontSize: 13, fontWeight: 500, color: BRAND.text, display: 'block', marginBottom: 8 }}>
              <span style={{ color: BRAND.accent, marginRight: 8 }}>0{i + 1}</span>{q.text}
            </label>
            <textarea value={openAns[q.id] || ''} onChange={e => setOpenAns(a => ({ ...a, [q.id]: e.target.value }))}
              rows={3} placeholder="Escribe tu respuesta aquí..."
              style={{ width: '100%', boxSizing: 'border-box', fontSize: 13, padding: '10px 12px',
                borderRadius: 8, border: `1px solid ${BRAND.border}`, background: '#fff',
                color: BRAND.text, resize: 'vertical', fontFamily: 'inherit', lineHeight: 1.6 }} />
          </div>
        ))}
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={() => setStep('survey')} style={{ flex: 1, padding: 10,
            background: '#fff', border: `1px solid ${BRAND.border}`, color: BRAND.muted,
            borderRadius: 8, cursor: 'pointer', fontSize: 13 }}>← Volver</button>
          <button onClick={submit} disabled={saving} style={{ flex: 2, padding: 10,
            background: BRAND.accent, border: 'none', color: '#fff', borderRadius: 8,
            cursor: 'pointer', fontSize: 13, fontWeight: 500 }}>
            {saving ? 'Guardando...' : 'Enviar evaluación ✓'}
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div style={{ background: BRAND.bg, minHeight: '100vh' }}>
      <Header />
      <div style={{ maxWidth: 500, margin: '0 auto', padding: '4rem 1.5rem', textAlign: 'center' }}>
        <div style={{ width: 52, height: 52, borderRadius: '50%', background: '#f0f9f4',
          border: '1px solid #2e7d52', display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 16px', fontSize: 22, color: '#2e7d52' }}>✓</div>
        <h2 style={{ fontSize: 20, fontWeight: 400, color: BRAND.text, marginBottom: 12 }}>
          ¡Gracias por tu evaluación!
        </h2>
        <p style={{ fontSize: 14, color: BRAND.muted, lineHeight: 1.7 }}>
          Tu respuesta ha sido registrada. Los resultados del equipo estarán disponibles
          una vez que todos hayan completado la encuesta.
        </p>
      </div>
    </div>
  );
}
