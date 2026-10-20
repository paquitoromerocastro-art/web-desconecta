import { FormEvent, useState } from 'react';
import {
  ArrowDown,
  ArrowRight,
  Check,
  CircleCheck,
  Instagram,
  Leaf,
  Mail,
  Menu,
  MessageCircle,
  Plus,
  Sparkles,
  X,
} from 'lucide-react';
import { supabase } from '@/lib/supabase';

type SurveyStep = 'moment' | 'interests' | 'format' | 'contact';

type SurveyData = {
  moment: string;
  interests: string[];
  format: string;
  name: string;
  email: string;
  notes: string;
};

const moments = [
  { id: 'desacelerar', label: 'Desacelerar', text: 'Necesito bajar el ritmo y volver a mí.' },
  { id: 'compartir', label: 'Compartir', text: 'Quiero regalar un momento sin pantallas.' },
  { id: 'activar', label: 'Activar', text: 'Me apetece moverme y probar algo nuevo.' },
];

const interests = [
  { id: 'leer', label: 'Leer con calma', detail: 'Libros y pequeñas historias' },
  { id: 'jugar', label: 'Jugar en compañía', detail: 'Juegos de mesa y retos' },
  { id: 'cuidarme', label: 'Cuidarme', detail: 'Spa, calma y bienestar' },
  { id: 'moverme', label: 'Moverme', detail: 'Ideas para activar el cuerpo' },
  { id: 'crear', label: 'Crear con las manos', detail: 'Propuestas para hacer despacio' },
  { id: 'sorpresa', label: 'Dejarme sorprender', detail: 'Una mezcla elegida para ti' },
];

const formats = [
  { id: 'individual', label: 'Para mí', detail: 'Un ritual personal para desconectar.' },
  { id: 'pareja', label: 'Para dos', detail: 'Un plan para compartir sin pantallas.' },
  { id: 'regalo', label: 'Para regalar', detail: 'Una pausa bonita para alguien especial.' },
];

const initialData: SurveyData = {
  moment: '',
  interests: [],
  format: '',
  name: '',
  email: '',
  notes: '',
};

function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [surveyOpen, setSurveyOpen] = useState(false);
  const [step, setStep] = useState<SurveyStep>('moment');
  const [survey, setSurvey] = useState<SurveyData>(initialData);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const stepIndex = ['moment', 'interests', 'format', 'contact'].indexOf(step);
  const progress = ((stepIndex + 1) / 4) * 100;

  function openSurvey() {
    setSurveyOpen(true);
    setSubmitted(false);
    setError('');
  }

  function closeSurvey() {
    setSurveyOpen(false);
    setStep('moment');
    setSurvey(initialData);
    setError('');
  }

  function goNext() {
    setError('');
    if (step === 'moment' && !survey.moment) return setError('Elige una opción para continuar.');
    if (step === 'interests' && survey.interests.length === 0) return setError('Elige al menos un interés.');
    if (step === 'format' && !survey.format) return setError('Elige el formato que buscas.');
    setStep(step === 'moment' ? 'interests' : step === 'interests' ? 'format' : 'contact');
  }

  function goBack() {
    setError('');
    setStep(step === 'contact' ? 'format' : step === 'format' ? 'interests' : 'moment');
  }

  function toggleInterest(id: string) {
    setSurvey((current) => ({
      ...current,
      interests: current.interests.includes(id)
        ? current.interests.filter((interest) => interest !== id)
        : [...current.interests, id],
    }));
  }

  async function submitSurvey(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!survey.email || !survey.name) {
      setError('Completa tu nombre y correo para que podamos contactarte.');
      return;
    }

    setSubmitting(true);
    setError('');
    const { error: insertError } = await supabase.from('survey_responses').insert({
      name: survey.name.trim(),
      email: survey.email.trim(),
      moment: survey.moment,
      interests: survey.interests,
      format: survey.format,
      notes: survey.notes.trim() || null,
    });

    if (insertError) {
      setError('No hemos podido guardar tus respuestas. Inténtalo de nuevo en un momento.');
      setSubmitting(false);
      return;
    }

    setSubmitted(true);
    setSubmitting(false);
  }

  return (
    <div className="min-h-screen overflow-hidden bg-cream text-ink">
      <header className="fixed left-0 right-0 top-0 z-40 border-b border-ink/10 bg-cream/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-10">
          <a href="#inicio" className="flex items-center gap-3" onClick={() => setMenuOpen(false)}>
            <img src="/image.png" alt="Desconecta" className="h-11 w-11 rounded-full" />
            <div className="hidden leading-none sm:block">
              <span className="font-display text-xl font-semibold tracking-tight">desconecta</span>
              <span className="mt-1 block font-mono text-[9px] uppercase tracking-[0.24em] text-olive">menos pantallas</span>
            </div>
          </a>
          <nav className={`${menuOpen ? 'absolute left-0 right-0 top-[76px] flex border-b border-ink/10 bg-cream px-6 py-6' : 'hidden'} flex-col gap-5 text-sm font-medium md:static md:flex md:flex-row md:items-center md:border-0 md:bg-transparent md:p-0`}>
            <a href="#como-funciona" onClick={() => setMenuOpen(false)} className="transition-colors hover:text-orange">Cómo funciona</a>
            <a href="#que-incluye" onClick={() => setMenuOpen(false)} className="transition-colors hover:text-orange">Qué incluye</a>
            <a href="#contacto" onClick={() => setMenuOpen(false)} className="transition-colors hover:text-orange">Hablemos</a>
            <button onClick={openSurvey} className="rounded-full bg-olive px-5 py-3 text-sm font-semibold text-cream transition-transform hover:-translate-y-0.5 hover:bg-deep">Crear mi kit <ArrowRight className="ml-2 inline-block h-4 w-4" /></button>
          </nav>
          <button className="p-2 md:hidden" onClick={() => setMenuOpen(!menuOpen)} aria-label="Abrir menú">
            {menuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </header>

      <main id="inicio">
        <section className="relative mx-auto flex min-h-[720px] max-w-7xl items-center px-6 pb-20 pt-36 lg:px-10 lg:pb-28 lg:pt-40">
          <div className="pointer-events-none absolute -right-40 top-20 h-[520px] w-[520px] rounded-full border border-orange/20 lg:right-0" />
          <div className="pointer-events-none absolute -right-24 top-36 h-[370px] w-[370px] rounded-full border border-orange/20" />
          <div className="relative z-10 max-w-3xl">
            <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-olive/25 bg-sage px-4 py-2 font-mono text-[11px] uppercase tracking-[0.2em] text-olive"><Sparkles className="h-3.5 w-3.5" /> kits para vivir más despacio</div>
            <h1 className="max-w-3xl font-display text-5xl font-medium leading-[0.98] tracking-[-0.045em] sm:text-7xl lg:text-[100px]">Tu tiempo también merece <span className="italic text-orange">desconectar.</span></h1>
            <p className="mt-8 max-w-xl text-lg leading-8 text-ink/70 sm:text-xl">Creamos kits personalizados para que vuelvas a disfrutar de lo que pasa cuando dejas el móvil a un lado.</p>
            <div className="mt-10 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
              <button onClick={openSurvey} className="group rounded-full bg-orange px-7 py-4 font-semibold text-cream shadow-lg shadow-orange/20 transition-all hover:-translate-y-1 hover:bg-brown">Descubre tu kit <ArrowRight className="ml-3 inline-block h-4 w-4 transition-transform group-hover:translate-x-1" /></button>
              <a href="#como-funciona" className="flex items-center gap-2 px-3 py-4 text-sm font-semibold text-olive hover:text-orange"><ArrowDown className="h-4 w-4" /> Conoce el proceso</a>
            </div>
          </div>
          <div className="absolute bottom-16 right-8 hidden w-72 rotate-6 rounded-[32px] bg-olive p-7 text-cream shadow-2xl shadow-deep/20 lg:block">
            <Leaf className="mb-14 h-9 w-9 text-yellow" />
            <p className="font-display text-3xl leading-tight">“Lo que buscas no está en otra pantalla.”</p>
            <div className="mt-7 flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-cream/60"><span className="h-px w-8 bg-cream/50" /> Desconecta</div>
          </div>
        </section>

        <section id="como-funciona" className="bg-sage py-24 lg:py-32">
          <div className="mx-auto max-w-7xl px-6 lg:px-10">
            <div className="grid gap-14 lg:grid-cols-[0.85fr_1.4fr] lg:items-end">
              <div><p className="mb-5 font-mono text-xs uppercase tracking-[0.24em] text-orange">Un plan sencillo</p><h2 className="font-display text-5xl leading-[1.02] tracking-[-0.04em] sm:text-6xl">Haz espacio para lo que sí importa.</h2></div>
              <p className="max-w-md text-lg leading-8 text-ink/65 lg:justify-self-end">Cuéntanos cómo quieres sentirte. Nosotros reunimos una selección de cosas bonitas para acompañarte en tu pausa.</p>
            </div>
            <div className="mt-20 grid gap-10 border-t border-ink/15 pt-8 md:grid-cols-3">
              {[['01', 'Cuéntanos', 'Responde unas preguntas rápidas sobre tu momento ideal para desconectar.'], ['02', 'Lo preparamos', 'Elegimos cada pieza pensando en tus gustos, tu energía y tu plan.'], ['03', 'Vuelve a ti', 'Recibe tu kit y regálate un rato sin notificaciones ni prisas.']].map(([number, title, text]) => <div key={number} className="group"><span className="font-mono text-xs text-orange">{number}</span><h3 className="mt-8 font-display text-3xl">{title}</h3><p className="mt-4 max-w-xs leading-7 text-ink/65">{text}</p><div className="mt-8 h-px w-0 bg-orange transition-all duration-500 group-hover:w-16" /></div>)}
            </div>
          </div>
        </section>

        <section id="que-incluye" className="bg-cream py-24 lg:py-32">
          <div className="mx-auto max-w-7xl px-6 lg:px-10">
            <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end"><div><p className="mb-5 font-mono text-xs uppercase tracking-[0.24em] text-orange">Dentro de cada caja</p><h2 className="font-display text-5xl leading-[1.02] tracking-[-0.04em] sm:text-6xl">Pequeñas pausas,<br /><span className="italic text-orange">grandes momentos.</span></h2></div><p className="max-w-xs leading-7 text-ink/65">No hay dos kits iguales. Cada uno nace de tus respuestas.</p></div>
            <div className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[['01', 'Historias', 'Un libro elegido para perderte un rato.', 'bg-yellow'], ['02', 'Planes', 'Juegos para reír, pensar y compartir.', 'bg-sage'], ['03', 'Cuidado', 'Un detalle para bajar revoluciones.', 'bg-pink'], ['04', 'Movimiento', 'Una invitación a salir de la silla.', 'bg-blue']].map(([number, title, text, color]) => <div key={number} className={`${color} min-h-[270px] rounded-[24px] p-7 transition-transform hover:-translate-y-2`}><span className="font-mono text-xs text-ink/50">{number}</span><div className="mt-20"><h3 className="font-display text-3xl">{title}</h3><p className="mt-3 max-w-[190px] text-sm leading-6 text-ink/65">{text}</p></div></div>)}
            </div>
            <div className="mt-14 flex flex-col items-start justify-between gap-6 border-t border-ink/10 pt-8 sm:flex-row sm:items-center"><div className="flex items-center gap-3 text-sm text-ink/60"><CircleCheck className="h-5 w-5 text-olive" /> Sin pantallas, sin complicaciones</div><button onClick={openSurvey} className="font-semibold text-orange transition-colors hover:text-brown">Personaliza el tuyo <ArrowRight className="ml-2 inline h-4 w-4" /></button></div>
          </div>
        </section>

        <section className="bg-deep py-24 text-cream lg:py-32"><div className="mx-auto grid max-w-7xl gap-14 px-6 lg:grid-cols-[1fr_0.8fr] lg:items-center lg:px-10"><div><p className="mb-5 font-mono text-xs uppercase tracking-[0.24em] text-yellow">Nuestro porqué</p><h2 className="max-w-2xl font-display text-5xl leading-[1.02] tracking-[-0.04em] sm:text-7xl">Más vida real.<br /><span className="italic text-yellow">Menos scroll.</span></h2></div><div><p className="text-lg leading-8 text-cream/70">Desconecta nace para recordarte algo sencillo: descansar no es hacer menos, es volver a elegir en qué quieres estar.</p><div className="mt-10 flex items-center gap-5"><img src="/image.png" alt="Logo Desconecta" className="h-20 w-20 rounded-full" /><p className="max-w-[180px] font-mono text-[10px] uppercase leading-5 tracking-[0.15em] text-cream/55">Menos pantallas,<br />más vida real.</p></div></div></div></section>
      </main>

      <footer id="contacto" className="bg-brown py-16 text-cream"><div className="mx-auto max-w-7xl px-6 lg:px-10"><div className="grid gap-12 md:grid-cols-[1fr_auto_auto] md:items-start"><div><div className="flex items-center gap-3"><img src="/image.png" alt="Desconecta" className="h-12 w-12 rounded-full" /><span className="font-display text-2xl">desconecta</span></div><p className="mt-6 max-w-xs leading-7 text-cream/65">Una caja para volver a las cosas que no necesitan batería.</p></div><div><p className="mb-5 font-mono text-[10px] uppercase tracking-[0.2em] text-yellow">Escríbenos</p><a href="mailto:hola@desconecta.es" className="flex items-center gap-2 text-lg hover:text-yellow"><Mail className="h-4 w-4" /> hola@desconecta.es</a><a href="https://wa.me/34600000000" className="mt-4 flex items-center gap-2 text-lg hover:text-yellow"><MessageCircle className="h-4 w-4" /> +34 600 000 000</a></div><div><p className="mb-5 font-mono text-[10px] uppercase tracking-[0.2em] text-yellow">Síguenos</p><a href="https://instagram.com" className="flex items-center gap-2 text-lg hover:text-yellow"><Instagram className="h-4 w-4" /> @desconecta</a><p className="mt-8 font-mono text-[10px] uppercase tracking-widest text-cream/40">Madrid · España</p></div></div><div className="mt-16 flex flex-col justify-between gap-3 border-t border-cream/15 pt-6 text-xs text-cream/40 sm:flex-row"><span>© 2024 Desconecta</span><span>Hecho para vivir más despacio.</span></div></div></footer>

      {surveyOpen && <div className="fixed inset-0 z-50 flex items-end justify-center bg-deep/60 p-0 backdrop-blur-sm sm:items-center sm:p-6"><div className="relative max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-t-[28px] bg-cream p-6 shadow-2xl sm:rounded-[28px] sm:p-10"><button onClick={closeSurvey} className="absolute right-5 top-5 rounded-full p-2 text-ink/50 hover:bg-ink/5 hover:text-ink" aria-label="Cerrar encuesta"><X className="h-5 w-5" /></button>{submitted ? <div className="flex min-h-[430px] flex-col items-center justify-center text-center"><div className="flex h-16 w-16 items-center justify-center rounded-full bg-sage text-olive"><Check className="h-8 w-8" /></div><p className="mt-7 font-mono text-xs uppercase tracking-[0.2em] text-orange">Todo en orden</p><h2 className="mt-4 font-display text-5xl tracking-[-0.04em]">Tu pausa empieza aquí.</h2><p className="mt-5 max-w-sm leading-7 text-ink/65">Gracias, {survey.name}. Te escribiremos pronto para contarte cómo será tu kit.</p><button onClick={closeSurvey} className="mt-9 rounded-full bg-olive px-7 py-3 font-semibold text-cream">Cerrar</button></div> : <><div className="mb-9 pr-8"><div className="mb-4 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.18em] text-ink/45"><span>Tu kit · 0{stepIndex + 1} / 04</span><span>{Math.round(progress)}%</span></div><div className="h-1 rounded-full bg-ink/10"><div className="h-1 rounded-full bg-orange transition-all" style={{ width: `${progress}%` }} /></div></div><div className="min-h-[360px]">{step === 'moment' && <><p className="font-mono text-xs uppercase tracking-[0.2em] text-orange">Primero</p><h2 className="mt-4 max-w-lg font-display text-5xl leading-[1.02] tracking-[-0.04em]">¿Qué necesitas<br /><span className="italic text-orange">ahora mismo?</span></h2><div className="mt-9 grid gap-3">{moments.map((item) => <button key={item.id} onClick={() => setSurvey({ ...survey, moment: item.id })} className={`flex items-center justify-between rounded-2xl border p-5 text-left transition-all ${survey.moment === item.id ? 'border-orange bg-yellow/50' : 'border-ink/10 hover:border-olive/40'}`}><span><span className="block font-display text-2xl">{item.label}</span><span className="mt-1 block text-sm text-ink/60">{item.text}</span></span>{survey.moment === item.id ? <Check className="h-5 w-5 text-orange" /> : <ArrowRight className="h-5 w-5 text-ink/30" />}</button>)}</div></>}{step === 'interests' && <><p className="font-mono text-xs uppercase tracking-[0.2em] text-orange">Después</p><h2 className="mt-4 max-w-lg font-display text-5xl leading-[1.02] tracking-[-0.04em]">¿Qué te gustaría<br /><span className="italic text-orange">encontrar dentro?</span></h2><div className="mt-9 grid gap-3 sm:grid-cols-2">{interests.map((item) => <button key={item.id} onClick={() => toggleInterest(item.id)} className={`rounded-2xl border p-5 text-left transition-all ${survey.interests.includes(item.id) ? 'border-orange bg-yellow/50' : 'border-ink/10 hover:border-olive/40'}`}><span className="flex items-center justify-between font-display text-xl">{item.label}{survey.interests.includes(item.id) ? <Check className="h-5 w-5 text-orange" /> : <Plus className="h-5 w-5 text-ink/30" />}</span><span className="mt-2 block text-sm text-ink/60">{item.detail}</span></button>)}</div></>}{step === 'format' && <><p className="font-mono text-xs uppercase tracking-[0.2em] text-orange">Casi está</p><h2 className="mt-4 max-w-lg font-display text-5xl leading-[1.02] tracking-[-0.04em]">¿Para quién es<br /><span className="italic text-orange">esta pausa?</span></h2><div className="mt-9 grid gap-3">{formats.map((item) => <button key={item.id} onClick={() => setSurvey({ ...survey, format: item.id })} className={`flex items-center justify-between rounded-2xl border p-5 text-left transition-all ${survey.format === item.id ? 'border-orange bg-yellow/50' : 'border-ink/10 hover:border-olive/40'}`}><span><span className="block font-display text-2xl">{item.label}</span><span className="mt-1 block text-sm text-ink/60">{item.detail}</span></span>{survey.format === item.id ? <Check className="h-5 w-5 text-orange" /> : <ArrowRight className="h-5 w-5 text-ink/30" />}</button>)}</div></>}{step === 'contact' && <form onSubmit={submitSurvey}><p className="font-mono text-xs uppercase tracking-[0.2em] text-orange">Último paso</p><h2 className="mt-4 max-w-lg font-display text-5xl leading-[1.02] tracking-[-0.04em]">¿Dónde te<br /><span className="italic text-orange">encontramos?</span></h2><div className="mt-8 grid gap-4 sm:grid-cols-2"><label className="text-sm font-semibold">Tu nombre<input value={survey.name} onChange={(event) => setSurvey({ ...survey, name: event.target.value })} className="mt-2 w-full rounded-xl border border-ink/15 bg-transparent px-4 py-3 font-normal outline-none transition-colors focus:border-orange" placeholder="Leonor" /></label><label className="text-sm font-semibold">Tu correo<input type="email" value={survey.email} onChange={(event) => setSurvey({ ...survey, email: event.target.value })} className="mt-2 w-full rounded-xl border border-ink/15 bg-transparent px-4 py-3 font-normal outline-none transition-colors focus:border-orange" placeholder="hola@ejemplo.com" /></label></div><label className="mt-4 block text-sm font-semibold">¿Algo más que debamos saber? <span className="font-normal text-ink/45">(opcional)</span><textarea value={survey.notes} onChange={(event) => setSurvey({ ...survey, notes: event.target.value })} rows={3} className="mt-2 w-full resize-none rounded-xl border border-ink/15 bg-transparent px-4 py-3 font-normal outline-none transition-colors focus:border-orange" placeholder="Cuéntanos tus gustos o una idea para tu kit..." /></label></form>}</div>{error && <p className="mt-2 text-sm text-brown">{error}</p>}<div className="mt-8 flex items-center justify-between border-t border-ink/10 pt-6">{step !== 'moment' ? <button onClick={goBack} className="text-sm font-semibold text-ink/55 hover:text-ink">Atrás</button> : <span />}{step === 'contact' ? <button onClick={(event) => submitSurvey(event as unknown as FormEvent<HTMLFormElement>)} disabled={submitting} className="rounded-full bg-orange px-6 py-3 font-semibold text-cream transition-colors hover:bg-brown disabled:cursor-wait disabled:opacity-60">{submitting ? 'Guardando...' : 'Enviar mis respuestas'} <ArrowRight className="ml-2 inline h-4 w-4" /></button> : <button onClick={goNext} className="rounded-full bg-olive px-6 py-3 font-semibold text-cream transition-colors hover:bg-deep">Continuar <ArrowRight className="ml-2 inline h-4 w-4" /></button>}</div></>}</div></div>}
    </div>
  );
}

export default App;
