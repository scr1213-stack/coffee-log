import { useState } from 'react'

export function AuthScreen({ onSignIn, onSignUp }) {
  const [mode, setMode] = useState('signIn')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()
    setMessage('')
    setErrorMessage('')
    setIsSubmitting(true)

    try {
      if (mode === 'signIn') {
        await onSignIn(email, password)
      } else {
        const { needsEmailConfirmation } = await onSignUp(email, password)

        if (needsEmailConfirmation) {
          setMessage('확인 메일을 보냈습니다. 메일의 링크를 누른 뒤 로그인해 주세요.')
          setMode('signIn')
        }
      }
    } catch (error) {
      setErrorMessage(error.message || '인증 중 오류가 발생했습니다.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const changeMode = (nextMode) => {
    setMode(nextMode)
    setMessage('')
    setErrorMessage('')
  }

  return (
    <main className="auth-page">
      <section className="auth-card">
        <p className="auth-eyebrow">개인 커피 데이터베이스</p>
        <h1>커피 로그</h1>
        <p className="auth-description">
          같은 계정으로 로그인하면 PC와 휴대폰에서 기록을 함께 사용할 수 있습니다.
        </p>

        <div className="auth-tabs" role="tablist" aria-label="로그인 방식">
          <button
            type="button"
            className={mode === 'signIn' ? 'active' : ''}
            onClick={() => changeMode('signIn')}
          >
            로그인
          </button>
          <button
            type="button"
            className={mode === 'signUp' ? 'active' : ''}
            onClick={() => changeMode('signUp')}
          >
            회원가입
          </button>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <label>
            이메일
            <input
              type="email"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </label>

          <label>
            비밀번호
            <input
              type="password"
              autoComplete={mode === 'signIn' ? 'current-password' : 'new-password'}
              minLength="6"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </label>

          {message && <p className="auth-message success-message">{message}</p>}
          {errorMessage && <p className="auth-message error-message">{errorMessage}</p>}

          <button type="submit" className="submit-button" disabled={isSubmitting}>
            {isSubmitting
              ? '처리 중...'
              : mode === 'signIn'
                ? '로그인'
                : '회원가입'}
          </button>
        </form>
      </section>
    </main>
  )
}
