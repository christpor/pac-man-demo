import { useState, useEffect } from 'react'

interface Props { highScore: number }

export default function StartScreen({ highScore }: Props) {
  const [blink, setBlink] = useState(true)
  useEffect(() => {
    const t = setInterval(() => setBlink(b => !b), 500)
    return () => clearInterval(t)
  }, [])

  return (
    <div style={{ textAlign: 'center', fontFamily: 'Arial, sans-serif', padding: 40 }}>
      <div style={{ fontSize: 64, fontWeight: 'bold', color: '#FFD700', letterSpacing: 8, textShadow: '0 0 20px #FFD700' }}>
        PAC-MAN
      </div>
      <div style={{ color: '#ffb8ae', fontSize: 18, margin: '24px 0 8px' }}>
        Use Arrow Keys to move
      </div>
      <div style={{ color: '#aaa', fontSize: 14, marginBottom: 32 }}>
        Eat all dots · Avoid ghosts · Power pellets = blue ghosts!
      </div>
      {highScore > 0 && (
        <div style={{ color: '#FFD700', fontSize: 16, marginBottom: 24 }}>
          BEST: {highScore}
        </div>
      )}
      <div style={{ color: blink ? '#fff' : 'transparent', fontSize: 20, transition: 'color 0.1s' }}>
        Press ENTER to Start
      </div>
    </div>
  )
}
