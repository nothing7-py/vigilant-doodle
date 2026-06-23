Now the main page — all 6 sections with the full experience:
Action: file_editor create /app/app/page.js --file-text "'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Heart, Music2, Pause, Play, Upload, ChevronLeft, ChevronRight,
  Settings, X, Sparkles, Mail, Camera, Flower2, ScrollText, Cake
} from 'lucide-react'
import confetti from 'canvas-confetti'

// ---------- Defaults ----------
const DEFAULTS = {
  recipientName: 'My Love',
  fromName: 'Yours, Forever',
  message:
    \"On this special day, I want you to know how incredibly loved you are. Your smile lights up every room, and your kindness touches every heart you meet. May this year bring you endless joy, sweet adventures, and every little thing your heart desires.\",
  captions: [
    'the day we met ♡',
    'our little adventure',
    'sunsets with you',
    'silly faces',
    'late night talks',
    'forever & always',
  ],
  wishes: [
    'May every dream you whisper to the stars find its way back to you this year ✨',
    'Wishing you sun-warm mornings, cozy nights, and a heart that never stops dancing ♡',
    'May love, laughter, and magic follow you everywhere you go — today and always 🌸',
  ],
  letter:
    \"My dearest,\n\nThe moment I met you, my whole world tilted in the most beautiful way. You have a way of making ordinary days feel like little celebrations — your laugh, your terrible jokes, the way you hum songs without realizing.\n\nToday, the universe celebrates the day you came into it, but honestly? I celebrate you every single day. Thank you for being patient, for being kind, for being you.\n\nI hope this little surprise makes you smile. You deserve every flower, every song, every soft thing in this world.\n\nHappy Birthday, my favorite person. Here's to another year of us.\",
}

// ---------- Helper: localStorage safe ----------
const lsGet = (k, fb) => {
  if (typeof window === 'undefined') return fb
  try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : fb } catch { return fb }
}
const lsSet = (k, v) => {
  if (typeof window === 'undefined') return
  try { localStorage.setItem(k, JSON.stringify(v)) } catch {}
}

// ---------- Floating hearts background ----------
const FloatingHearts = ({ count = 14 }) => {
  const [hearts, setHearts] = useState([])
  useEffect(() => {
    const arr = Array.from({ length: count }).map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      size: 10 + Math.random() * 18,
      delay: Math.random() * 8,
      duration: 8 + Math.random() * 8,
      hue: Math.random() > 0.5 ? '#f9a8d4' : '#c4b5fd',
    }))
    setHearts(arr)
  }, [count])
  return (
    <div className=\"pointer-events-none fixed inset-0 overflow-hidden z-0\">
      {hearts.map(h => (
        <div
          key={h.id}
          className=\"heart-float absolute bottom-0\"
          style={{
            left: `${h.left}%`,
            animationDelay: `${h.delay}s`,
            animationDuration: `${h.duration}s`,
            color: h.hue,
          }}
        >
          <Heart fill=\"currentColor\" strokeWidth={0} style={{ width: h.size, height: h.size, opacity: 0.55 }} />
        </div>
      ))}
    </div>
  )
}

// ---------- Sparkles overlay ----------
const Sparkle = ({ x, y, size = 14, delay = 0 }) => (
  <div className=\"absolute twinkle\" style={{ left: `${x}%`, top: `${y}%`, animationDelay: `${delay}s` }}>
    <Sparkles className=\"text-pink-300\" style={{ width: size, height: size }} />
  </div>
)

// ---------- Envelope ----------
const Envelope = ({ open, onOpen }) => {
  return (
    <div className=\"relative w-full max-w-[280px] mx-auto\" style={{ aspectRatio: '5/3.4' }}>
      {/* paper inside */}
      <motion.div
        initial={false}
        animate={open ? { y: -110, opacity: 1, rotate: -2 } : { y: 8, opacity: 1, rotate: 0 }}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        className=\"absolute inset-x-6 top-3 bottom-2 rounded-md bg-white shadow-lg border border-pink-100 z-10 flex flex-col items-center justify-center p-3\"
      >
        <Heart className=\"w-7 h-7 text-pink-400\" fill=\"#f472b6\" strokeWidth={0} />
        <p className=\"font-hand text-pink-500 text-xl mt-1\">open me ♡</p>
      </motion.div>

      {/* envelope body */}
      <div className=\"absolute inset-0 rounded-xl bg-gradient-to-br from-pink-200 to-pink-300 shadow-xl shadow-pink-200/60 overflow-hidden z-20\">
        {/* bottom front flap */}
        <div
          className=\"absolute inset-x-0 bottom-0 h-[62%] bg-gradient-to-br from-pink-200 to-pink-300 z-30\"
          style={{ clipPath: 'polygon(0 30%, 100% 30%, 100% 100%, 0 100%)' }}
        />
        {/* side triangles for envelope shape */}
        <div className=\"absolute inset-0 z-20\" style={{
          background: 'linear-gradient(135deg, transparent 49.5%, rgba(255,255,255,0.25) 50%, transparent 50.5%)',
        }} />
        {/* top flap (animates open) */}
        <motion.div
          initial={false}
          animate={open ? { rotateX: 175 } : { rotateX: 0 }}
          transition={{ duration: 0.9, ease: 'easeInOut' }}
          style={{ transformOrigin: 'top center', transformStyle: 'preserve-3d' }}
          className=\"absolute top-0 left-0 right-0 h-[62%] z-40\"
        >
          <div
            className=\"w-full h-full bg-gradient-to-br from-pink-300 to-pink-400 shadow-inner\"
            style={{ clipPath: 'polygon(0 0, 100% 0, 50% 100%)' }}
          />
        </motion.div>
        {/* wax seal */}
        {!open && (
          <motion.button
            onClick={onOpen}
            whileTap={{ scale: 0.92 }}
            className=\"absolute left-1/2 top-[58%] -translate-x-1/2 -translate-y-1/2 z-50 w-14 h-14 rounded-full bg-gradient-to-br from-rose-400 to-pink-500 shadow-lg flex items-center justify-center border-2 border-white/70\"
          >
            <Heart className=\"w-6 h-6 text-white\" fill=\"white\" strokeWidth={0} />
          </motion.button>
        )}
      </div>
    </div>
  )
}

// ---------- Sections ----------
const CoverScreen = ({ onNext, name }) => {
  const [open, setOpen] = useState(false)
  const handleOpen = () => {
    setOpen(true)
    setTimeout(onNext, 1700)
  }
  return (
    <motion.section
      key=\"cover\"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
      className=\"min-h-screen flex flex-col items-center justify-center px-6 py-10 relative z-10\"
    >
      <Sparkle x={10} y={15} delay={0} />
      <Sparkle x={85} y={20} delay={1} size={18} />
      <Sparkle x={15} y={75} delay={2} size={12} />
      <Sparkle x={88} y={80} delay={0.5} />

      <motion.div
        initial={{ y: -10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className=\"px-4 py-1.5 rounded-full bg-white/70 backdrop-blur border border-pink-200 text-pink-500 text-xs tracking-[0.2em] uppercase font-medium shadow-sm\"
      >
        ♡ A Birthday Surprise ♡
      </motion.div>

      <motion.h1
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.8 }}
        className=\"font-serif italic text-4xl leading-tight text-rose-900/80 text-center mt-6 max-w-[300px]\"
      >
        a little something for you
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
        className=\"font-hand text-pink-500 text-2xl mt-3\"
      >
        happy birthday, {name} ♡
      </motion.p>

      <div className=\"mt-12\">
        <Envelope open={open} onOpen={handleOpen} />
      </div>

      {!open && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4 }}
          className=\"text-xs text-pink-400/80 mt-10 tracking-wider uppercase\"
        >
          tap the envelope ✿
        </motion.p>
      )}
    </motion.section>
  )
}

const MessageScreen = ({ onNext, data, audioFile }) => {
  const audioRef = useRef(null)
  const [playing, setPlaying] = useState(false)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const a = audioRef.current
    if (!a) return
    const onTime = () => setProgress((a.currentTime / (a.duration || 1)) * 100)
    const onEnd = () => setPlaying(false)
    a.addEventListener('timeupdate', onTime)
    a.addEventListener('ended', onEnd)
    return () => { a.removeEventListener('timeupdate', onTime); a.removeEventListener('ended', onEnd) }
  }, [audioFile])

  const toggle = () => {
    const a = audioRef.current
    if (!a) return
    if (playing) { a.pause(); setPlaying(false) }
    else { a.play().then(() => setPlaying(true)).catch(() => {}) }
  }

  return (
    <motion.section
      key=\"message\"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -30 }}
      transition={{ duration: 0.7 }}
      className=\"min-h-screen flex flex-col items-center px-6 py-12 relative z-10\"
    >
      {/* avatar */}
      <motion.div
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', delay: 0.1 }}
        className=\"w-24 h-24 rounded-full bg-gradient-to-br from-pink-200 via-rose-200 to-purple-200 border-4 border-white shadow-lg flex items-center justify-center text-4xl\"
      >
        🎀
      </motion.div>

      <motion.h2
        initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }}
        className=\"font-serif italic text-3xl text-rose-900/80 mt-5\"
      >
        Happy Birthday
      </motion.h2>
      <p className=\"font-hand text-pink-500 text-xl\">{data.recipientName} ♡</p>

      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
        className=\"bg-white/80 backdrop-blur rounded-3xl shadow-xl shadow-pink-200/40 p-6 mt-6 border border-pink-100\"
      >
        <p className=\"text-rose-900/75 leading-relaxed text-[15px] text-center font-serif\">
          {data.message}
        </p>
      </motion.div>

      {/* music player */}
      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}
        className=\"w-full mt-5 bg-gradient-to-br from-pink-100 to-purple-100 rounded-2xl p-4 shadow-md border border-white/60\"
      >
        <div className=\"flex items-center gap-3\">
          <button
            onClick={toggle}
            disabled={!audioFile}
            className=\"w-12 h-12 rounded-full bg-gradient-to-br from-pink-400 to-rose-500 text-white shadow-lg flex items-center justify-center disabled:opacity-50\"
          >
            {playing ? <Pause className=\"w-5 h-5\" fill=\"white\" /> : <Play className=\"w-5 h-5 ml-0.5\" fill=\"white\" />}
          </button>
          <div className=\"flex-1\">
            <div className=\"flex items-center gap-1.5 text-pink-600 text-xs\">
              <Music2 className=\"w-3 h-3\" />
              <span className=\"font-medium truncate\">
                {audioFile ? (audioFile.name || 'Your Song') : 'Upload a song below ↓'}
              </span>
            </div>
            <div className=\"h-1.5 bg-white/70 rounded-full mt-2 overflow-hidden\">
              <div className=\"h-full bg-gradient-to-r from-pink-400 to-purple-400\" style={{ width: `${progress}%` }} />
            </div>
          </div>
        </div>
        {audioFile && <audio ref={audioRef} src={audioFile.url} preload=\"metadata\" />}
      </motion.div>

      <motion.button
        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9 }}
        onClick={onNext}
        className=\"mt-8 px-8 py-3.5 rounded-full bg-gradient-to-r from-rose-400 to-pink-500 text-white font-medium shadow-lg shadow-pink-300/40 active:scale-95 transition\"
      >
        See Our Album →
      </motion.button>
    </motion.section>
  )
}

const AlbumScreen = ({ onNext, data, photos }) => {
  const [idx, setIdx] = useState(0)
  const total = 6
  const rotations = [-3, 2, -1.5, 3, -2.5, 1.5]
  const next = () => setIdx(i => (i + 1) % total)
  const prev = () => setIdx(i => (i - 1 + total) % total)

  return (
    <motion.section
      key=\"album\"
      initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -30 }}
      transition={{ duration: 0.7 }}
      className=\"min-h-screen flex flex-col items-center px-6 py-12 relative z-10\"
    >
      <p className=\"font-hand text-pink-500 text-2xl\">our little memories</p>
      <h2 className=\"font-serif italic text-3xl text-rose-900/80 mt-1\">Photo Album</h2>

      <div className=\"relative w-full max-w-[320px] h-[420px] mt-8 flex items-center justify-center\">
        <AnimatePresence mode=\"wait\">
          <motion.div
            key={idx}
            initial={{ opacity: 0, x: 80, rotate: rotations[idx] + 8 }}
            animate={{ opacity: 1, x: 0, rotate: rotations[idx] }}
            exit={{ opacity: 0, x: -80, rotate: rotations[idx] - 8 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className=\"absolute bg-white p-3 pb-14 rounded-sm shadow-2xl shadow-pink-300/30 w-[260px]\"
          >
            <div className=\"w-full aspect-square bg-gradient-to-br from-pink-100 via-rose-100 to-purple-100 overflow-hidden flex items-center justify-center\">
              {photos[idx] ? (
                <img src={photos[idx]} alt={`memory ${idx + 1}`} className=\"w-full h-full object-cover\" />
              ) : (
                <div className=\"text-pink-300 flex flex-col items-center gap-2\">
                  <Camera className=\"w-10 h-10\" />
                  <span className=\"text-xs\">photo {idx + 1}</span>
                </div>
              )}
            </div>
            <p className=\"font-hand text-pink-500 text-xl text-center mt-3\">
              {data.captions[idx] || `memory ${idx + 1}`}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className=\"flex items-center gap-6 mt-2\">
        <button onClick={prev} className=\"w-11 h-11 rounded-full bg-white shadow-md border border-pink-100 flex items-center justify-center text-pink-500 active:scale-95\">
          <ChevronLeft className=\"w-5 h-5\" />
        </button>
        <div className=\"px-4 py-1.5 rounded-full bg-white/80 border border-pink-100 text-pink-500 text-sm font-medium shadow-sm\">
          {idx + 1} / {total}
        </div>
        <button onClick={next} className=\"w-11 h-11 rounded-full bg-white shadow-md border border-pink-100 flex items-center justify-center text-pink-500 active:scale-95\">
          <ChevronRight className=\"w-5 h-5\" />
        </button>
      </div>

      <button
        onClick={onNext}
        className=\"mt-8 px-8 py-3.5 rounded-full bg-gradient-to-r from-rose-400 to-pink-500 text-white font-medium shadow-lg shadow-pink-300/40 active:scale-95 transition\"
      >
        Pick A Wish →
      </button>
    </motion.section>
  )
}

const FLOWER_THEMES = [
  { bg: 'from-pink-200 to-rose-300', text: 'text-rose-700', emoji: '🌷', name: 'pink' },
  { bg: 'from-orange-100 to-rose-200', text: 'text-orange-700', emoji: '🌸', name: 'peach' },
  { bg: 'from-purple-200 to-violet-300', text: 'text-violet-800', emoji: '💜', name: 'lavender' },
]

const FlowerCard = ({ theme, wish, open, onOpen }) => {
  return (
    <motion.div
      layout
      onClick={() => !open && onOpen()}
      className={`relative w-full rounded-3xl shadow-xl border border-white/60 overflow-hidden cursor-pointer bg-gradient-to-br ${theme.bg}`}
      animate={{ height: open ? 'auto' : 140 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      <AnimatePresence mode=\"wait\">
        {!open ? (
          <motion.div
            key=\"closed\"
            exit={{ opacity: 0, scale: 0.85 }}
            transition={{ duration: 0.3 }}
            className=\"absolute inset-0 flex flex-col items-center justify-center\"
          >
            <motion.div
              animate={{ rotate: [0, -5, 5, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
              className=\"text-5xl\"
            >
              {theme.emoji}
            </motion.div>
            <p className={`font-hand text-2xl mt-1 ${theme.text}`}>pick me ♡</p>
          </motion.div>
        ) : (
          <motion.div
            key=\"open\"
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className=\"p-6 flex flex-col items-center text-center\"
          >
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', delay: 0.1 }}
              className=\"text-6xl\"
            >
              {theme.emoji}
            </motion.div>
            <p className={`font-serif italic text-lg mt-3 leading-relaxed ${theme.text}`}>
              {wish}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

const FlowerScreen = ({ onNext, data }) => {
  const [opened, setOpened] = useState([false, false, false])
  const allOpen = opened.every(Boolean)

  return (
    <motion.section
      key=\"flower\"
      initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -30 }}
      transition={{ duration: 0.7 }}
      className=\"min-h-screen flex flex-col items-center px-6 py-12 relative z-10\"
    >
      <p className=\"font-hand text-pink-500 text-2xl\">a wish for you</p>
      <h2 className=\"font-serif italic text-3xl text-rose-900/80 mt-1 text-center\">Pick A Flower</h2>
      <p className=\"text-rose-900/60 text-sm mt-2 text-center\">tap each flower to bloom 🌷</p>

      <div className=\"w-full mt-8 flex flex-col gap-4\">
        {FLOWER_THEMES.map((t, i) => (
          <FlowerCard
            key={i}
            theme={t}
            wish={data.wishes[i]}
            open={opened[i]}
            onOpen={() => setOpened(o => o.map((v, idx) => idx === i ? true : v))}
          />
        ))}
      </div>

      <motion.button
        animate={{ opacity: allOpen ? 1 : 0.4 }}
        onClick={onNext}
        className=\"mt-8 px-8 py-3.5 rounded-full bg-gradient-to-r from-rose-400 to-pink-500 text-white font-medium shadow-lg shadow-pink-300/40 active:scale-95 transition\"
      >
        Read My Letter →
      </motion.button>
    </motion.section>
  )
}

const LetterScreen = ({ onNext, data }) => {
  return (
    <motion.section
      key=\"letter\"
      initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -30 }}
      transition={{ duration: 0.7 }}
      className=\"min-h-screen flex flex-col items-center px-6 py-12 relative z-10\"
    >
      <motion.div
        initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring' }}
        className=\"w-20 h-20 rounded-full bg-gradient-to-br from-purple-200 to-pink-200 border-4 border-white shadow-lg flex items-center justify-center text-3xl\"
      >
        💌
      </motion.div>
      <h2 className=\"font-serif italic text-3xl text-rose-900/80 mt-4 text-center\">A Letter Just For You</h2>
      <p className=\"font-hand text-pink-500 text-xl\">with all my love ♡</p>

      <motion.div
        initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.8 }}
        className=\"w-full mt-6 bg-[#fff9fb] rounded-2xl shadow-xl shadow-pink-200/40 border border-pink-100 p-6 lined-paper relative overflow-hidden\"
      >
        <div className=\"absolute left-6 top-0 bottom-0 w-px bg-pink-300/60\" />
        <div className=\"absolute left-8 top-0 bottom-0 w-px bg-pink-200/60\" />
        <div className=\"pl-6 whitespace-pre-line font-serif italic text-rose-900/80 leading-[32px] text-[15px]\">
          {data.letter}
        </div>
        <p className=\"font-hand text-pink-500 text-xl mt-4 text-right\">— {data.fromName}</p>
      </motion.div>

      <button
        onClick={onNext}
        className=\"mt-8 px-8 py-3.5 rounded-full bg-gradient-to-r from-rose-400 to-pink-500 text-white font-medium shadow-lg shadow-pink-300/40 active:scale-95 transition\"
      >
        One More Surprise →
      </button>
    </motion.section>
  )
}

const FinalScreen = ({ data, onRestart }) => {
  useEffect(() => {
    const fire = () => {
      confetti({
        particleCount: 80,
        spread: 90,
        origin: { y: 0.3 },
        colors: ['#f9a8d4', '#c4b5fd', '#fbcfe8', '#fde68a', '#ddd6fe'],
        scalar: 0.9,
      })
    }
    fire()
    const t1 = setTimeout(fire, 800)
    const t2 = setTimeout(fire, 1800)
    const interval = setInterval(fire, 3500)
    return () => { clearTimeout(t1); clearTimeout(t2); clearInterval(interval) }
  }, [])

  return (
    <motion.section
      key=\"final\"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
      className=\"min-h-screen flex flex-col items-center justify-center px-6 py-12 relative z-10 text-center\"
    >
      <motion.div
        initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', delay: 0.2 }}
        className=\"text-7xl\"
      >
        🎂
      </motion.div>

      <motion.h1
        initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.5 }}
        className=\"font-serif italic text-5xl text-rose-900/80 mt-6 leading-tight\"
      >
        Happy<br/>Birthday
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}
        className=\"font-hand text-3xl text-pink-500 mt-3\"
      >
        {data.recipientName} ♡
      </motion.p>

      <motion.p
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.1 }}
        className=\"text-rose-900/60 mt-6 max-w-[280px] leading-relaxed\"
      >
        Thank you for being you. May this year be the most magical one yet ✨
      </motion.p>

      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }}
        className=\"flex gap-2 mt-8 text-2xl\"
      >
        {['🌸','💖','✨','🌷','💕'].map((e, i) => (
          <motion.span
            key={i}
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
          >{e}</motion.span>
        ))}
      </motion.div>

      <button
        onClick={onRestart}
        className=\"mt-10 px-6 py-2.5 rounded-full bg-white/80 border border-pink-200 text-pink-500 text-sm font-medium shadow-sm active:scale-95\"
      >
        ♡ replay surprise
      </button>
    </motion.section>
  )
}

// ---------- Settings Drawer ----------
const SettingsDrawer = ({ open, onClose, data, setData, photos, setPhotos, setAudioFile, audioFile }) => {
  const fileInputs = useRef({})

  const handlePhoto = (i, file) => {
    const reader = new FileReader()
    reader.onload = () => {
      const next = [...photos]; next[i] = reader.result
      setPhotos(next)
      try { lsSet('bd_photos', next) } catch {}
    }
    reader.readAsDataURL(file)
  }

  const handleAudio = (file) => {
    const url = URL.createObjectURL(file)
    setAudioFile({ url, name: file.name })
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
            className=\"fixed inset-0 bg-black/30 z-40\"
          />
          <motion.div
            initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30 }}
            className=\"fixed inset-y-0 right-0 w-full max-w-md bg-gradient-to-b from-pink-50 to-purple-50 z-50 overflow-y-auto no-scrollbar shadow-2xl\"
          >
            <div className=\"sticky top-0 bg-white/80 backdrop-blur p-4 border-b border-pink-100 flex items-center justify-between z-10\">
              <h3 className=\"font-serif italic text-xl text-rose-900/80\">Customize ♡</h3>
              <button onClick={onClose} className=\"p-2 rounded-full hover:bg-pink-100\">
                <X className=\"w-5 h-5 text-pink-500\" />
              </button>
            </div>

            <div className=\"p-5 space-y-5\">
              <div>
                <label className=\"text-xs uppercase tracking-wider text-pink-500 font-medium\">Recipient Name</label>
                <input
                  value={data.recipientName}
                  onChange={e => setData({ ...data, recipientName: e.target.value })}
                  className=\"w-full mt-1 px-3 py-2 rounded-xl bg-white border border-pink-200 text-sm focus:outline-none focus:ring-2 focus:ring-pink-300\"
                />
              </div>

              <div>
                <label className=\"text-xs uppercase tracking-wider text-pink-500 font-medium\">Signed (From)</label>
                <input
                  value={data.fromName}
                  onChange={e => setData({ ...data, fromName: e.target.value })}
                  className=\"w-full mt-1 px-3 py-2 rounded-xl bg-white border border-pink-200 text-sm focus:outline-none focus:ring-2 focus:ring-pink-300\"
                />
              </div>

              <div>
                <label className=\"text-xs uppercase tracking-wider text-pink-500 font-medium\">Birthday Message</label>
                <textarea
                  rows={4}
                  value={data.message}
                  onChange={e => setData({ ...data, message: e.target.value })}
                  className=\"w-full mt-1 px-3 py-2 rounded-xl bg-white border border-pink-200 text-sm focus:outline-none focus:ring-2 focus:ring-pink-300\"
                />
              </div>

              <div>
                <label className=\"text-xs uppercase tracking-wider text-pink-500 font-medium\">Music (MP3)</label>
                <button
                  onClick={() => fileInputs.current.audio?.click()}
                  className=\"w-full mt-1 px-4 py-3 rounded-xl bg-white border border-pink-200 text-sm text-pink-600 flex items-center gap-2 hover:bg-pink-50\"
                >
                  <Upload className=\"w-4 h-4\" />
                  {audioFile?.name || 'Choose MP3 file'}
                </button>
                <input
                  ref={el => (fileInputs.current.audio = el)}
                  type=\"file\" accept=\"audio/*\" hidden
                  onChange={e => e.target.files?.[0] && handleAudio(e.target.files[0])}
                />
              </div>

              <div>
                <label className=\"text-xs uppercase tracking-wider text-pink-500 font-medium\">Photo Album (6)</label>
                <div className=\"grid grid-cols-3 gap-2 mt-2\">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i}>
                      <button
                        onClick={() => fileInputs.current[`p${i}`]?.click()}
                        className=\"aspect-square w-full rounded-xl bg-white border border-pink-200 overflow-hidden flex items-center justify-center\"
                      >
                        {photos[i] ? (
                          <img src={photos[i]} className=\"w-full h-full object-cover\" alt=\"\" />
                        ) : (
                          <Camera className=\"w-5 h-5 text-pink-400\" />
                        )}
                      </button>
                      <input
                        ref={el => (fileInputs.current[`p${i}`] = el)}
                        type=\"file\" accept=\"image/*\" hidden
                        onChange={e => e.target.files?.[0] && handlePhoto(i, e.target.files[0])}
                      />
                      <input
                        value={data.captions[i] || ''}
                        onChange={e => {
                          const next = [...data.captions]; next[i] = e.target.value
                          setData({ ...data, captions: next })
                        }}
                        placeholder={`caption ${i + 1}`}
                        className=\"w-full mt-1 px-2 py-1 rounded-md bg-white border border-pink-200 text-xs focus:outline-none\"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className=\"text-xs uppercase tracking-wider text-pink-500 font-medium\">3 Flower Wishes</label>
                {data.wishes.map((w, i) => (
                  <textarea
                    key={i}
                    rows={2}
                    value={w}
                    onChange={e => {
                      const next = [...data.wishes]; next[i] = e.target.value
                      setData({ ...data, wishes: next })
                    }}
                    className=\"w-full mt-2 px-3 py-2 rounded-xl bg-white border border-pink-200 text-sm focus:outline-none focus:ring-2 focus:ring-pink-300\"
                    placeholder={`Flower ${i + 1} wish`}
                  />
                ))}
              </div>

              <div>
                <label className=\"text-xs uppercase tracking-wider text-pink-500 font-medium\">Letter</label>
                <textarea
                  rows={10}
                  value={data.letter}
                  onChange={e => setData({ ...data, letter: e.target.value })}
                  className=\"w-full mt-1 px-3 py-2 rounded-xl bg-white border border-pink-200 text-sm focus:outline-none focus:ring-2 focus:ring-pink-300 font-serif\"
                />
              </div>

              <button
                onClick={onClose}
                className=\"w-full py-3 rounded-full bg-gradient-to-r from-rose-400 to-pink-500 text-white font-medium shadow-lg active:scale-95\"
              >
                Save & Close ♡
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

// ---------- Step Indicator ----------
const StepIndicator = ({ step, total, onJump }) => {
  return (
    <div className=\"fixed bottom-4 left-1/2 -translate-x-1/2 z-30 flex gap-1.5 px-3 py-2 rounded-full bg-white/70 backdrop-blur border border-pink-100 shadow-sm\">
      {Array.from({ length: total }).map((_, i) => (
        <button
          key={i}
          onClick={() => onJump(i)}
          className={`h-1.5 rounded-full transition-all ${i === step ? 'w-6 bg-pink-500' : 'w-1.5 bg-pink-200'}`}
        />
      ))}
    </div>
  )
}

// ---------- Main App ----------
const App = () => {
  const [step, setStep] = useState(0)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [data, setData] = useState(DEFAULTS)
  const [photos, setPhotos] = useState([null, null, null, null, null, null])
  const [audioFile, setAudioFile] = useState(null)
  const [hydrated, setHydrated] = useState(false)

  // Load from localStorage on mount
  useEffect(() => {
    const saved = lsGet('bd_data', null)
    if (saved) setData({ ...DEFAULTS, ...saved })
    const savedPhotos = lsGet('bd_photos', null)
    if (savedPhotos) setPhotos(savedPhotos)
    setHydrated(true)
  }, [])

  // Persist data
  useEffect(() => {
    if (!hydrated) return
    lsSet('bd_data', data)
  }, [data, hydrated])

  const next = () => setStep(s => Math.min(s + 1, 5))
  const restart = () => setStep(0)

  const steps = [
    <CoverScreen onNext={next} name={data.recipientName} />,
    <MessageScreen onNext={next} data={data} audioFile={audioFile} />,
    <AlbumScreen onNext={next} data={data} photos={photos} />,
    <FlowerScreen onNext={next} data={data} />,
    <LetterScreen onNext={next} data={data} />,
    <FinalScreen data={data} onRestart={restart} />,
  ]

  return (
    <main className=\"min-h-screen w-full relative overflow-x-hidden bg-gradient-to-br from-pink-100 via-rose-50 to-purple-100\">
      {/* gradient blobs */}
      <div className=\"pointer-events-none fixed -top-20 -left-20 w-80 h-80 bg-pink-200/40 rounded-full blur-3xl\" />
      <div className=\"pointer-events-none fixed -bottom-20 -right-20 w-80 h-80 bg-purple-200/40 rounded-full blur-3xl\" />
      <div className=\"pointer-events-none fixed top-1/3 right-1/4 w-60 h-60 bg-rose-200/30 rounded-full blur-3xl\" />

      <FloatingHearts count={12} />

      {/* mobile-first container */}
      <div className=\"relative mx-auto max-w-[420px] min-h-screen\">
        <button
          onClick={() => setSettingsOpen(true)}
          className=\"fixed top-4 right-4 z-30 w-10 h-10 rounded-full bg-white/80 backdrop-blur border border-pink-200 shadow-sm flex items-center justify-center text-pink-500 active:scale-95\"
          aria-label=\"Customize\"
        >
          <Settings className=\"w-4 h-4\" />
        </button>

        <AnimatePresence mode=\"wait\">
          {steps[step]}
        </AnimatePresence>

        {step > 0 && <StepIndicator step={step} total={6} onJump={setStep} />}
      </div>

      <SettingsDrawer
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        data={data} setData={setData}
        photos={photos} setPhotos={setPhotos}
        audioFile={audioFile} setAudioFile={setAudioFile}
      />
    </main>
  )
}

export default App
"
Observation: Failed to create file: File already exists at: /app/app/page.js. Use overwrite=True to replace
