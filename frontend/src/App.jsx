import { useState, useRef, useEffect } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import './App.css'

const STARTERS = [
  { icon: '🗺️', title: 'I know where I\'m going', text: 'I want to plan a trip from Kandy to Nuwara Eliya.' },
  { icon: '🌿', title: 'I need a break', text: "I'm stressed and need a break from work. Where should I go?" },
  { icon: '🥾', title: 'Hikes & hidden places', text: 'I love hiking. Suggest hidden places and hikes for a few days.' },
  { icon: '☁️', title: 'Check the weather', text: "What's the weather like in Ella this week?" },
]

export default function App() {
  const [messages, setMessages] = useState([])
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(false)
  const [sessionId, setSessionId] = useState(() => crypto.randomUUID())
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  async function send(override) {
    const msg = (override ?? text).trim()
    if (!msg || loading) return
    setText('')
    setMessages((m) => [...m, { who: 'user', text: msg }])
    setLoading(true)
    try {
      const res = await fetch('/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ session_id: sessionId, message: msg }),
      })
      if (!res.ok) throw new Error('Server error')
      const data = await res.json()
      setMessages((m) => [...m, { who: 'bot', text: data.reply }])
    } catch {
      setMessages((m) => [
        ...m,
        { who: 'bot', text: 'Sorry, I could not reach the server. Is Ollama running and is `uvicorn server:app` started?' },
      ])
    }
    setLoading(false)
  }

  function newTrip() {
    setMessages([])
    setText('')
    setSessionId(crypto.randomUUID()) // new id = fresh conversation on the server
  }

  return (
    <div className="app">
      <header className="header">
        <div className="brand">
          <span className="logo">🌿</span>
          <div>
            <h1>Wanderlk</h1>
            <p>Your Sri Lanka travel companion</p>
          </div>
        </div>
        {messages.length > 0 && (
          <button className="ghost" onClick={newTrip}>+ New trip</button>
        )}
      </header>

      <main className="chat">
        {messages.length === 0 ? (
          <div className="welcome">
            <h2>Where shall we wander?</h2>
            <p>Tell me a destination, or tell me how you feel and I'll find a calm place for you.</p>
            <div className="starters">
              {STARTERS.map((s) => (
                <button key={s.title} className="starter" onClick={() => send(s.text)}>
                  <span>{s.icon}</span>
                  <strong>{s.title}</strong>
                </button>
              ))}
            </div>
          </div>
        ) : (
          messages.map((m, i) => (
            <div key={i} className={`bubble ${m.who}`}>
              {m.who === 'bot' ? (
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{m.text}</ReactMarkdown>
              ) : (
                m.text
              )}
            </div>
          ))
        )}
        {loading && (
          <div className="bubble bot typing">
            <span></span><span></span><span></span>
          </div>
        )}
        <div ref={bottomRef} />
      </main>

      <footer className="composer">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && send()}
          placeholder="Where would you like to go?"
          disabled={loading}
          autoFocus
        />
        <button onClick={() => send()} disabled={loading || !text.trim()}>Send</button>
      </footer>
    </div>
  )
}