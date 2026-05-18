import { useState, useEffect } from 'react'

interface Props { score: number; highScore: number; onRestart: () => void }

export default function GameOverScreen({ score, highScore, onRestart }: Props) {
  const [blink, setBlink] = useState(true)
  useEffect(() => {
    const t = setInterval(() => setBlink(b => !b), 500)
    return () => clearInterval(t)
  }, [])

  return (
    <div style={{ textAlign: 'center', fontFamily: 'Arial, sans-serif', padding: 40 }}>
      <div style={{ fontSize: 52, fontWeight: 'bold', color: '#FF0000', textShadow: '0 0 20px #FF0000' }}>
        GAME OVER
      </div>
      <div style={{ color: '#fff', fontSize: 22, margin: '24px 0 8px' }}>
        Score: <span style={{ color: '#FFD700' }}>{score}</span>
      </div>
      <div style={{ color: '#aaa', fontSize: 16, marginBottom: 32 }}>
        Best: <span style={{ color: '#FFD700' }}>{highScore}</span>
      </div>
      <div style={{ color: blink ? '#fff' : 'transparent', fontSize: 20, transition: 'color 0.1s' }}>
        Press ENTER to Play Again
      </div>
      <button
        onClick={onRestart}
        style={{
          marginTop: 24, padding: '10px 28px', fontSize: 16,
          background: '#FFD700', color: '#000', border: 'none',
          borderRadius: 6, cursor: 'pointer', fontWeight: 'bold'
        }}
      >
        Play Again
      </button>
    </div>
  )
}
