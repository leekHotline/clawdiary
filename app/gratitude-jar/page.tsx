'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'

interface GratitudeNote {
  id: string
  text: string
  color: string
  date: string
  createdAt: number
}

const PAPER_COLORS = [
  'bg-pink-200 border-pink-300',
  'bg-amber-200 border-amber-300',
  'bg-green-200 border-green-300',
  'bg-blue-200 border-blue-300',
  'bg-purple-200 border-purple-300',
  'bg-rose-200 border-rose-300',
  'bg-cyan-200 border-cyan-300',
  'bg-yellow-200 border-yellow-300',
]

const JAR_QUOTES = [
  '每一份感恩都是一粒种子 🌱',
  '心存感恩，幸福自来 ✨',
  '小小的感谢，大大的幸福 💝',
  '感恩是心灵的阳光 ☀️',
  '感谢每一个美好的瞬间 🌸',
]

export default function GratitudeJarPage() {
  const [notes, setNotes] = useState<GratitudeNote[]>([])
  const [newNote, setNewNote] = useState('')
  const [isAdding, setIsAdding] = useState(false)
  const [showInput, setShowInput] = useState(false)
  const [shakeAnimation, setShakeAnimation] = useState(false)
  const [randomNote, setRandomNote] = useState<GratitudeNote | null>(null)
  const [showRandom, setShowRandom] = useState(false)
  const [jarFill, setJarFill] = useState(0)
  const [quote] = useState(() => JAR_QUOTES[Math.floor(Math.random() * JAR_QUOTES.length)])
  const jarRef = useRef<HTMLDivElement>(null)

  // Load notes from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('gratitude-jar-notes')
    if (saved) {
      const loadedNotes = JSON.parse(saved)
      setNotes(loadedNotes)
      updateJarFill(loadedNotes.length)
    }
  }, [])

  // Update jar fill level
  const updateJarFill = (count: number) => {
    // Max capacity: 50 notes = 100% fill
    const fill = Math.min((count / 50) * 100, 95)
    setJarFill(fill)
  }

  // Save notes to localStorage
  const saveNotes = (updatedNotes: GratitudeNote[]) => {
    localStorage.setItem('gratitude-jar-notes', JSON.stringify(updatedNotes))
    setNotes(updatedNotes)
    updateJarFill(updatedNotes.length)
  }

  // Add a new note
  const addNote = () => {
    if (!newNote.trim()) return

    const note: GratitudeNote = {
      id: Date.now().toString(),
      text: newNote.trim(),
      color: PAPER_COLORS[Math.floor(Math.random() * PAPER_COLORS.length)],
      date: new Date().toLocaleDateString('zh-CN', {
        month: 'short',
        day: 'numeric',
      }),
      createdAt: Date.now(),
    }

    setIsAdding(true)

    setTimeout(() => {
      saveNotes([note, ...notes])
      setNewNote('')
      setIsAdding(false)
      setShowInput(false)
    }, 600)
  }

  // Shake the jar and pick a random note
  const shakeJar = () => {
    if (notes.length === 0) return

    setShakeAnimation(true)
    setShowRandom(false)

    setTimeout(() => {
      const randomIdx = Math.floor(Math.random() * notes.length)
      setRandomNote(notes[randomIdx])
      setShowRandom(true)
      setShakeAnimation(false)
    }, 1000)
  }

  // Delete a note
  const deleteNote = (id: string) => {
    const updated = notes.filter(n => n.id !== id)
    saveNotes(updated)
  }

  // Get notes by date groups
  const groupedNotes = notes.reduce((acc, note) => {
    const dateKey = note.date
    if (!acc[dateKey]) acc[dateKey] = []
    acc[dateKey].push(note)
    return acc
  }, {} as Record<string, GratitudeNote[]>)

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 p-4 md:p-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">🫙 感恩罐</h1>
            <p className="text-gray-500 text-sm mt-1">{quote}</p>
          </div>
          <Link
            href="/"
            className="px-4 py-2 bg-white/80 rounded-xl hover:bg-white transition shadow-sm text-sm"
          >
            返回首页
          </Link>
        </div>

        {/* Stats Bar */}
        <div className="flex gap-3 mb-6">
          <div className="flex-1 bg-white/80 backdrop-blur rounded-xl p-3 text-center shadow-sm">
            <div className="text-2xl font-bold text-orange-500">{notes.length}</div>
            <div className="text-xs text-gray-500">感恩纸条</div>
          </div>
          <div className="flex-1 bg-white/80 backdrop-blur rounded-xl p-3 text-center shadow-sm">
            <div className="text-2xl font-bold text-pink-500">{Object.keys(groupedNotes).length}</div>
            <div className="text-xs text-gray-500">记录天数</div>
          </div>
          <div className="flex-1 bg-white/80 backdrop-blur rounded-xl p-3 text-center shadow-sm">
            <div className="text-2xl font-bold text-amber-500">{Math.round(jarFill)}%</div>
            <div className="text-xs text-gray-500">罐子填充</div>
          </div>
        </div>

        {/* The Jar */}
        <div className="flex flex-col items-center mb-8">
          <div
            ref={jarRef}
            onClick={() => setShowInput(true)}
            className={`relative cursor-pointer transition-all duration-300 ${
              shakeAnimation ? 'animate-shake' : ''
            }`}
          >
            {/* Jar Container */}
            <div className="relative w-48 h-64">
              {/* Jar outline */}
              <div className="absolute inset-0 bg-gradient-to-b from-white/40 to-white/20 rounded-[40%_40%_30%_30%] border-4 border-white/60 shadow-xl overflow-hidden backdrop-blur-sm">
                {/* Fill level */}
                <div
                  className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-amber-400/80 via-orange-400/60 to-rose-400/40 transition-all duration-1000 ease-out"
                  style={{ height: `${jarFill}%` }}
                >
                  {/* Notes inside jar (floating effect) */}
                  <div className="absolute inset-0 overflow-hidden">
                    {notes.slice(0, 15).map((note, idx) => (
                      <div
                        key={note.id}
                        className={`absolute w-8 h-6 ${note.color} rounded-sm shadow-sm opacity-60`}
                        style={{
                          left: `${10 + (idx * 7) % 70}%`,
                          bottom: `${5 + (idx * 11) % 80}%`,
                          transform: `rotate(${(idx * 15) % 45 - 22}deg)`,
                          animation: `float ${3 + (idx % 3)}s ease-in-out infinite`,
                          animationDelay: `${idx * 0.2}s`,
                        }}
                      />
                    ))}
                  </div>
                </div>

                {/* Glass reflection */}
                <div className="absolute top-4 left-4 w-6 h-12 bg-white/30 rounded-full blur-sm" />
              </div>

              {/* Jar lid */}
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-20 h-8 bg-gradient-to-b from-gray-300 to-gray-400 rounded-t-lg border-2 border-gray-400 shadow-md">
                <div className="absolute top-1 left-1/2 -translate-x-1/2 w-16 h-5 bg-gradient-to-b from-gray-200 to-gray-300 rounded-t-md" />
              </div>

              {/* Plus icon */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-white/80 text-4xl font-light drop-shadow-lg">+</div>
              </div>
            </div>
          </div>

          <p className="text-gray-400 text-sm mt-4">点击罐子添加感恩</p>

          {/* Shake Button */}
          {notes.length > 0 && (
            <button
              onClick={shakeJar}
              disabled={shakeAnimation}
              className="mt-4 px-6 py-3 bg-gradient-to-r from-amber-400 to-orange-500 text-white font-medium rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {shakeAnimation ? '🔮 摇一摇...' : '🎲 摇罐子'}
            </button>
          )}
        </div>

        {/* Random Note Display */}
        {showRandom && randomNote && (
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setShowRandom(false)}
          >
            <div
              className={`${randomNote.color} p-6 rounded-2xl shadow-2xl max-w-sm w-full transform animate-bounce-in`}
              onClick={e => e.stopPropagation()}
            >
              <div className="text-sm text-gray-600 mb-2">{randomNote.date}</div>
              <p className="text-lg text-gray-800 leading-relaxed">{randomNote.text}</p>
              <div className="mt-4 text-center text-gray-500 text-sm">✨ 感恩的回忆 ✨</div>
            </div>
          </div>
        )}

        {/* Input Modal */}
        {showInput && (
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-end justify-center z-50 p-4"
            onClick={() => setShowInput(false)}
          >
            <div
              className="bg-white rounded-t-3xl p-6 w-full max-w-lg shadow-2xl transform animate-slide-up"
              onClick={e => e.stopPropagation()}
            >
              <h3 className="text-lg font-bold text-gray-800 mb-4">写下今日感恩 🙏</h3>
              <textarea
                value={newNote}
                onChange={e => setNewNote(e.target.value)}
                placeholder="今天有什么让你感恩的事？"
                className="w-full h-24 p-4 border border-gray-200 rounded-xl resize-none focus:border-orange-300 focus:ring-2 focus:ring-orange-100 outline-none"
                autoFocus
              />
              <div className="flex gap-3 mt-4">
                <button
                  onClick={() => setShowInput(false)}
                  className="flex-1 py-3 border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 transition"
                >
                  取消
                </button>
                <button
                  onClick={addNote}
                  disabled={!newNote.trim() || isAdding}
                  className="flex-1 py-3 bg-gradient-to-r from-orange-400 to-rose-400 text-white font-medium rounded-xl hover:from-orange-500 hover:to-rose-500 transition disabled:opacity-50"
                >
                  {isAdding ? '✨ 投入罐子...' : '🫙 投入罐子'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Notes List */}
        {notes.length > 0 && (
          <div className="bg-white/80 backdrop-blur rounded-2xl p-5 shadow-sm">
            <h2 className="text-lg font-bold text-gray-800 mb-4">📜 感恩纸条</h2>
            <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
              {Object.entries(groupedNotes).map(([date, dateNotes]) => (
                <div key={date}>
                  <div className="text-xs text-gray-400 mb-2 sticky top-0 bg-white/80 py-1">{date}</div>
                  <div className="space-y-2">
                    {dateNotes.map(note => (
                      <div
                        key={note.id}
                        className={`${note.color} p-3 rounded-xl border shadow-sm group relative`}
                      >
                        <p className="text-gray-800 text-sm pr-6">{note.text}</p>
                        <button
                          onClick={() => deleteNote(note.id)}
                          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition text-gray-400 hover:text-red-500"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {notes.length === 0 && (
          <div className="text-center py-8 text-gray-400">
            <div className="text-4xl mb-2">🫙</div>
            <p>你的感恩罐还是空的</p>
            <p className="text-sm">点击罐子开始收集感恩</p>
          </div>
        )}

        {/* Motivational Footer */}
        <div className="mt-8 text-center">
          <p className="text-gray-400 text-sm">
            每一条感恩，都是生活中的小确幸 🌸
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0) rotate(0deg); }
          10% { transform: translateX(-10px) rotate(-5deg); }
          20% { transform: translateX(10px) rotate(5deg); }
          30% { transform: translateX(-10px) rotate(-3deg); }
          40% { transform: translateX(10px) rotate(3deg); }
          50% { transform: translateX(-5px) rotate(-2deg); }
          60% { transform: translateX(5px) rotate(2deg); }
          70% { transform: translateX(-3px) rotate(-1deg); }
          80% { transform: translateX(3px) rotate(1deg); }
          90% { transform: translateX(-1px) rotate(0deg); }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(var(--rotation, 0deg)); }
          50% { transform: translateY(-5px) rotate(var(--rotation, 0deg)); }
        }
        
        @keyframes bounce-in {
          0% { transform: scale(0.3); opacity: 0; }
          50% { transform: scale(1.05); }
          70% { transform: scale(0.9); }
          100% { transform: scale(1); opacity: 1; }
        }
        
        @keyframes slide-up {
          0% { transform: translateY(100%); }
          100% { transform: translateY(0); }
        }
        
        .animate-shake {
          animation: shake 1s ease-in-out;
        }
        
        .animate-bounce-in {
          animation: bounce-in 0.5s ease-out;
        }
        
        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }
      `}</style>
    </div>
  )
}