import { useEffect, useState } from 'react'
import './App.css'

const STORAGE_KEY = 'coffee-log-owned-beans'

const emptySingleBean = {
  type: 'single',
  name: '',
  region: '',
  altitude: '',
  variety: '',
  process: '',
  cuppingNote: '',
  origin: '',
  roastDate: '',
}

const emptyRatioItem = {
  name: '',
  ratio: '',
}

const emptyBlendBean = {
  type: 'blend',
  name: '',
  altitude: '',
  cuppingNote: '',
  roastDate: '',
  components: [{ ...emptyRatioItem }],
  varieties: [{ ...emptyRatioItem }],
  processes: [{ ...emptyRatioItem }],
  origins: [{ ...emptyRatioItem }],
}

function App() {
  const [activeTab, setActiveTab] = useState('beans')
  const [beanType, setBeanType] = useState('single')
  const [singleBean, setSingleBean] = useState(emptySingleBean)
  const [blendBean, setBlendBean] = useState(emptyBlendBean)
  const [ownedBeans, setOwnedBeans] = useState(() => {
    const savedBeans = localStorage.getItem(STORAGE_KEY)

    if (!savedBeans) {
      return []
    }

    try {
      return JSON.parse(savedBeans)
    } catch {
      return []
    }
  })

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ownedBeans))
  }, [ownedBeans])

  const handleSingleChange = (event) => {
    const { name, value } = event.target

    setSingleBean({
      ...singleBean,
      [name]: value,
    })
  }

  const handleBlendFieldChange = (event) => {
    const { name, value } = event.target

    setBlendBean({
      ...blendBean,
      [name]: value,
    })
  }

  const handleRatioItemChange = (groupName, index, event) => {
    const { name, value } = event.target
    const nextItems = [...blendBean[groupName]]

    nextItems[index] = {
      ...nextItems[index],
      [name]: value,
    }

    setBlendBean({
      ...blendBean,
      [groupName]: nextItems,
    })
  }

  const addRatioItem = (groupName) => {
    setBlendBean({
      ...blendBean,
      [groupName]: [...blendBean[groupName], { ...emptyRatioItem }],
    })
  }

  const removeRatioItem = (groupName, index) => {
    if (blendBean[groupName].length === 1) return

    setBlendBean({
      ...blendBean,
      [groupName]: blendBean[groupName].filter((_, itemIndex) => itemIndex !== index),
    })
  }

  const getRatioTotal = (items) => {
    return items.reduce((sum, item) => sum + Number(item.ratio || 0), 0)
  }

  const cleanRatioItems = (items) => {
    return items.filter((item) => item.name.trim() !== '' || item.ratio !== '')
  }

  const handleSaveBean = (event) => {
    event.preventDefault()

    if (beanType === 'single') {
      if (!singleBean.name.trim()) {
        alert('원두 이름을 입력해줘.')
        return
      }

      const newBean = {
        id: crypto.randomUUID(),
        createdAt: new Date().toLocaleString(),
        ...singleBean,
      }

      setOwnedBeans([newBean, ...ownedBeans])
      setSingleBean(emptySingleBean)
      setActiveTab('ownedBeans')
      return
    }

    if (!blendBean.name.trim()) {
      alert('블렌드 이름을 입력해줘.')
      return
    }

    const newBlendBean = {
      id: crypto.randomUUID(),
      createdAt: new Date().toLocaleString(),
      ...blendBean,
      components: cleanRatioItems(blendBean.components),
      varieties: cleanRatioItems(blendBean.varieties),
      processes: cleanRatioItems(blendBean.processes),
      origins: cleanRatioItems(blendBean.origins),
    }

    setOwnedBeans([newBlendBean, ...ownedBeans])
    setBlendBean(emptyBlendBean)
    setActiveTab('ownedBeans')
  }

  const deleteBean = (beanId) => {
    const isConfirmed = window.confirm('이 원두를 삭제할까?')

    if (!isConfirmed) return

    setOwnedBeans(ownedBeans.filter((bean) => bean.id !== beanId))
  }

  const clearAllBeans = () => {
    const isConfirmed = window.confirm('등록된 원두를 전부 삭제할까?')

    if (!isConfirmed) return

    setOwnedBeans([])
  }

  return (
    <main className="app">
      <header className="app-header">
        <h1>커피 로그</h1>
        <p>원두, 레시피, 추출 기록을 관리하는 개인 커피 데이터베이스</p>
      </header>

      <nav className="tabs">
        <button
          type="button"
          className={activeTab === 'beans' ? 'active' : ''}
          onClick={() => setActiveTab('beans')}
        >
          1. 원두 등록
        </button>

        <button
          type="button"
          className={activeTab === 'ownedBeans' ? 'active' : ''}
          onClick={() => setActiveTab('ownedBeans')}
        >
          2. 보유 원두
        </button>

        <button
          type="button"
          className={activeTab === 'brew' ? 'active' : ''}
          onClick={() => setActiveTab('brew')}
        >
          3. 추출 기록
        </button>

        <button
          type="button"
          className={activeTab === 'recipe' ? 'active' : ''}
          onClick={() => setActiveTab('recipe')}
        >
          4. 레시피 등록
        </button>

        <button
          type="button"
          className={activeTab === 'logs' ? 'active' : ''}
          onClick={() => setActiveTab('logs')}
        >
          5. 로그 확인
        </button>
      </nav>

      {activeTab === 'beans' && (
        <section className="card">
          <h2>원두 등록</h2>

          <div className="type-selector">
            <button
              type="button"
              className={beanType === 'single' ? 'active' : ''}
              onClick={() => setBeanType('single')}
            >
              싱글 원두
            </button>

            <button
              type="button"
              className={beanType === 'blend' ? 'active' : ''}
              onClick={() => setBeanType('blend')}
            >
              블렌드
            </button>
          </div>

          <form className="form" onSubmit={handleSaveBean}>
            {beanType === 'single' ? (
              <SingleBeanForm bean={singleBean} onChange={handleSingleChange} />
            ) : (
              <BlendBeanForm
                bean={blendBean}
                onFieldChange={handleBlendFieldChange}
                onRatioItemChange={handleRatioItemChange}
                onAddRatioItem={addRatioItem}
                onRemoveRatioItem={removeRatioItem}
                getRatioTotal={getRatioTotal}
              />
            )}

            <button type="submit" className="submit-button">
              원두 저장
            </button>
          </form>
        </section>
      )}

      {activeTab === 'ownedBeans' && (
        <OwnedBeansTab
          beans={ownedBeans}
          onDelete={deleteBean}
          onClearAll={clearAllBeans}
        />
      )}

      {activeTab === 'brew' && (
        <section className="card">
          <h2>추출 기록</h2>
          <p className="empty">
            여기는 다음 단계에서 저장된 원두를 선택하고 추출 기록을 남기는 화면으로 만들 예정입니다.
          </p>
        </section>
      )}

      {activeTab === 'recipe' && (
        <section className="card">
          <h2>레시피 등록</h2>
          <p className="empty">
            여기는 다음 단계에서 레시피 입력폼을 만들 예정입니다.
          </p>
        </section>
      )}

      {activeTab === 'logs' && (
        <section className="card">
          <h2>로그 확인</h2>
          <p className="empty">
            여기는 등록된 원두, 레시피, 추출 기록을 확인하는 화면으로 만들 예정입니다.
          </p>
        </section>
      )}
    </main>
  )
}

function SingleBeanForm({ bean, onChange }) {
  return (
    <>
      <label>
        이름
        <input
          name="name"
          value={bean.name}
          onChange={onChange}
          placeholder="예: 에티오피아 구지"
        />
      </label>

      <div className="grid">
        <label>
          Region
          <input
            name="region"
            value={bean.region}
            onChange={onChange}
            placeholder="예: Guji, Yirgacheffe"
          />
        </label>

        <label>
          Altitude
          <input
            name="altitude"
            value={bean.altitude}
            onChange={onChange}
            placeholder="예: 1,900-2,100m"
          />
        </label>

        <label>
          Variety
          <input
            name="variety"
            value={bean.variety}
            onChange={onChange}
            placeholder="예: Heirloom, Bourbon"
          />
        </label>

        <label>
          Process
          <input
            name="process"
            value={bean.process}
            onChange={onChange}
            placeholder="예: Washed, Natural"
          />
        </label>

        <label>
          원산지
          <input
            name="origin"
            value={bean.origin}
            onChange={onChange}
            placeholder="예: Ethiopia"
          />
        </label>

        <label>
          제조일 / 로스팅일
          <input
            type="date"
            name="roastDate"
            value={bean.roastDate}
            onChange={onChange}
          />
        </label>
      </div>

      <label>
        Cupping Note
        <textarea
          name="cuppingNote"
          value={bean.cuppingNote}
          onChange={onChange}
          placeholder="예: 자스민, 베르가못, 복숭아, 꿀"
        />
      </label>
    </>
  )
}

function BlendBeanForm({
  bean,
  onFieldChange,
  onRatioItemChange,
  onAddRatioItem,
  onRemoveRatioItem,
  getRatioTotal,
}) {
  return (
    <>
      <label>
        블렌드 이름
        <input
          name="name"
          value={bean.name}
          onChange={onFieldChange}
          placeholder="예: SPECIALTY BLEND 여름"
        />
      </label>

      <div className="grid">
        <label>
          Altitude
          <input
            name="altitude"
            value={bean.altitude}
            onChange={onFieldChange}
            placeholder="예: 1,600-2,000m"
          />
        </label>

        <label>
          제조일 / 로스팅일
          <input
            type="date"
            name="roastDate"
            value={bean.roastDate}
            onChange={onFieldChange}
          />
        </label>
      </div>

      <label>
        Cupping Note
        <textarea
          name="cuppingNote"
          value={bean.cuppingNote}
          onChange={onFieldChange}
          placeholder="예: 베리, 초콜릿, 열대과일, 긴 여운"
        />
      </label>

      <RatioInputGroup
        title="구성 원두 비율"
        groupName="components"
        itemLabel="구성 원두 이름"
        placeholder="예: 봄베"
        items={bean.components}
        onChange={onRatioItemChange}
        onAdd={onAddRatioItem}
        onRemove={onRemoveRatioItem}
        total={getRatioTotal(bean.components)}
      />

      <RatioInputGroup
        title="Variety 비율"
        groupName="varieties"
        itemLabel="Variety"
        placeholder="예: Bourbon"
        items={bean.varieties}
        onChange={onRatioItemChange}
        onAdd={onAddRatioItem}
        onRemove={onRemoveRatioItem}
        total={getRatioTotal(bean.varieties)}
      />

      <RatioInputGroup
        title="Process 비율"
        groupName="processes"
        itemLabel="Process"
        placeholder="예: Natural"
        items={bean.processes}
        onChange={onRatioItemChange}
        onAdd={onAddRatioItem}
        onRemove={onRemoveRatioItem}
        total={getRatioTotal(bean.processes)}
      />

      <RatioInputGroup
        title="원산지 비율"
        groupName="origins"
        itemLabel="원산지"
        placeholder="예: Ethiopia"
        items={bean.origins}
        onChange={onRatioItemChange}
        onAdd={onAddRatioItem}
        onRemove={onRemoveRatioItem}
        total={getRatioTotal(bean.origins)}
      />
    </>
  )
}

function RatioInputGroup({
  title,
  groupName,
  itemLabel,
  placeholder,
  items,
  onChange,
  onAdd,
  onRemove,
  total,
}) {
  const isTotalValid = total === 100

  return (
    <section className="blend-card">
      <div className="blend-header">
        <h3>{title}</h3>
        <span className={isTotalValid ? 'ratio-ok' : 'ratio-warning'}>
          합계 {total}%
        </span>
      </div>

      <div className="ratio-list">
        {items.map((item, index) => (
          <div className="ratio-row" key={index}>
            <label>
              {itemLabel}
              <input
                name="name"
                value={item.name}
                onChange={(event) => onChange(groupName, index, event)}
                placeholder={placeholder}
              />
            </label>

            <label>
              비율 %
              <input
                type="number"
                name="ratio"
                value={item.ratio}
                onChange={(event) => onChange(groupName, index, event)}
                placeholder="예: 40"
              />
            </label>

            <button
              type="button"
              className="remove-button ratio-remove-button"
              onClick={() => onRemove(groupName, index)}
              disabled={items.length === 1}
            >
              삭제
            </button>
          </div>
        ))}
      </div>

      <button type="button" className="secondary-button" onClick={() => onAdd(groupName)}>
        항목 추가
      </button>
    </section>
  )
}

function OwnedBeansTab({ beans, onDelete, onClearAll }) {
  return (
    <section className="card">
      <div className="section-header">
        <div>
          <h2>보유 원두</h2>
          <p className="section-description">
            등록한 싱글 원두와 블렌드를 확인하는 화면입니다.
          </p>
        </div>

        <div className="section-actions">
          <span className="count-badge">{beans.length}개</span>

          {beans.length > 0 && (
            <button type="button" className="remove-button" onClick={onClearAll}>
              전체 삭제
            </button>
          )}
        </div>
      </div>

      {beans.length === 0 ? (
        <p className="empty">
          아직 등록된 원두가 없습니다. 1번 탭에서 원두를 먼저 등록해줘.
        </p>
      ) : (
        <div className="bean-list">
          {beans.map((bean) => (
            <article className="bean-card" key={bean.id}>
              <div className="bean-card-header">
                <div>
                  <span className={bean.type === 'single' ? 'bean-type single' : 'bean-type blend'}>
                    {bean.type === 'single' ? '싱글' : '블렌드'}
                  </span>
                  <h3>{bean.name}</h3>
                </div>

                <button type="button" className="remove-button" onClick={() => onDelete(bean.id)}>
                  삭제
                </button>
              </div>

              {bean.type === 'single' ? (
                <SingleBeanCard bean={bean} />
              ) : (
                <BlendBeanCard bean={bean} />
              )}

              <small className="created-at">등록일: {bean.createdAt}</small>
            </article>
          ))}
        </div>
      )}
    </section>
  )
}

function SingleBeanCard({ bean }) {
  return (
    <div className="bean-info">
      <InfoRow label="원산지" value={bean.origin} />
      <InfoRow label="Region" value={bean.region} />
      <InfoRow label="Altitude" value={bean.altitude} />
      <InfoRow label="Variety" value={bean.variety} />
      <InfoRow label="Process" value={bean.process} />
      <InfoRow label="제조일 / 로스팅일" value={bean.roastDate} />
      <InfoRow label="Cupping Note" value={bean.cuppingNote} />
    </div>
  )
}

function BlendBeanCard({ bean }) {
  return (
    <div className="bean-info">
      <InfoRow label="Altitude" value={bean.altitude} />
      <InfoRow label="제조일 / 로스팅일" value={bean.roastDate} />
      <InfoRow label="Cupping Note" value={bean.cuppingNote} />

      <RatioSummary title="구성 원두" items={bean.components} />
      <RatioSummary title="Variety" items={bean.varieties} />
      <RatioSummary title="Process" items={bean.processes} />
      <RatioSummary title="원산지" items={bean.origins} />
    </div>
  )
}

function InfoRow({ label, value }) {
  return (
    <p>
      <strong>{label}: </strong>
      {value || '-'}
    </p>
  )
}

function RatioSummary({ title, items }) {
  const filteredItems = items.filter((item) => item.name || item.ratio)

  if (filteredItems.length === 0) {
    return (
      <p>
        <strong>{title}: </strong>-
      </p>
    )
  }

  return (
    <p>
      <strong>{title}: </strong>
      {filteredItems.map((item) => `${item.name || '-'} ${item.ratio || 0}%`).join(', ')}
    </p>
  )
}

export default App