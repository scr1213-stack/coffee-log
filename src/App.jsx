import { useState } from 'react'
import './App.css'

function App() {
  const [logs, setLogs] = useState([])
  const [form, setForm] = useState({
    beanName: '',
    method: '아이스',
    grindClicks: '',
    dose: '',
    water: '',
    brewTime: '',
    rating: '3',
    taste: '',
    memo: '',
  })

  const handleChange = (event) => {
    const { name, value } = event.target

    setForm({
      ...form,
      [name]: value,
    })
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    const newLog = {
      id: Date.now(),
      createdAt: new Date().toLocaleString(),
      ...form,
    }

    setLogs([newLog, ...logs])

    setForm({
      beanName: '',
      method: '아이스',
      grindClicks: '',
      dose: '',
      water: '',
      brewTime: '',
      rating: '3',
      taste: '',
      memo: '',
    })
  }

  return (
    <main className="app">
      <section className="card">
        <h1>커피 로그</h1>
        <p className="sub-text">드립 커피 추출 기록을 남기는 앱</p>

        <form onSubmit={handleSubmit} className="form">
          <label>
            원두명
            <input
              name="beanName"
              value={form.beanName}
              onChange={handleChange}
              placeholder="예: SPECIALTY BLEND 여름"
              required
            />
          </label>

          <label>
            추출 방식
            <select name="method" value={form.method} onChange={handleChange}>
              <option>아이스</option>
              <option>핫</option>
              <option>기타</option>
            </select>
          </label>

          <div className="grid">
            <label>
              클릭수
              <input
                name="grindClicks"
                value={form.grindClicks}
                onChange={handleChange}
                placeholder="예: 22"
              />
            </label>

            <label>
              원두량 g
              <input
                name="dose"
                value={form.dose}
                onChange={handleChange}
                placeholder="예: 30"
              />
            </label>

            <label>
              물량 g
              <input
                name="water"
                value={form.water}
                onChange={handleChange}
                placeholder="예: 300"
              />
            </label>

            <label>
              추출시간
              <input
                name="brewTime"
                value={form.brewTime}
                onChange={handleChange}
                placeholder="예: 2:40"
              />
            </label>
          </div>

          <label>
            별점
            <select name="rating" value={form.rating} onChange={handleChange}>
              <option value="1">★☆☆☆☆</option>
              <option value="2">★★☆☆☆</option>
              <option value="3">★★★☆☆</option>
              <option value="4">★★★★☆</option>
              <option value="5">★★★★★</option>
            </select>
          </label>

          <label>
            맛
            <input
              name="taste"
              value={form.taste}
              onChange={handleChange}
              placeholder="예: 쓰다, 산미 강함, 단맛 좋음"
            />
          </label>

          <label>
            메모
            <textarea
              name="memo"
              value={form.memo}
              onChange={handleChange}
              placeholder="다음에는 클릭수를 더 굵게 조정해보기"
            />
          </label>

          <button type="submit">기록 저장</button>
        </form>
      </section>

      <section className="card">
        <h2>기록 목록</h2>

        {logs.length === 0 ? (
          <p className="empty">아직 기록이 없습니다.</p>
        ) : (
          <div className="log-list">
            {logs.map((log) => (
              <article key={log.id} className="log-item">
                <div className="log-header">
                  <strong>{log.beanName}</strong>
                  <span>{'★'.repeat(Number(log.rating))}</span>
                </div>

                <p>
                  {log.method} / 클릭수 {log.grindClicks || '-'} / 원두 {log.dose || '-'}g /
                  물 {log.water || '-'}g / 시간 {log.brewTime || '-'}
                </p>

                <p>맛: {log.taste || '-'}</p>
                <p>메모: {log.memo || '-'}</p>
                <small>{log.createdAt}</small>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  )
}

export default App
