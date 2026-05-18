import { CELL_SIZE, COLS } from '../game/maze'

interface Props {
  score: number
  highScore: number
  lives: number
  totalDots: number
  dotsLeft: number
}

export default function ScoreBar({ score, highScore, lives, totalDots, dotsLeft }: Props) {
  const width = COLS * CELL_SIZE
  const pct = totalDots > 0 ? ((totalDots - dotsLeft) / totalDots) * 100 : 0

  return (
    <div style={{ width, color: '#fff', fontFamily: 'Arial, sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, marginBottom: 4 }}>
        <span>SCORE: <b style={{ color: '#FFD700' }}>{score}</b></span>
        <span>BEST: <b style={{ color: '#FFD700' }}>{highScore}</b></span>
        <span>
          {Array.from({ length: 3 }).map((_, i) => (
            <span key={i} style={{ marginLeft: 4, fontSize: 16 }}>
              {i < lives ? '🟡' : '⚫'}
            </span>
          ))}
        </span>
      </div>
      <div style={{ height: 4, background: '#333', borderRadius: 2 }}>
        <div style={{ height: '100%', width: `${pct}%`, background: '#FFD700', borderRadius: 2, transition: 'width 0.1s' }} />
      </div>
    </div>
  )
}
