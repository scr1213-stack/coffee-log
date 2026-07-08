import { useEffect, useState } from 'react'
import './App.css'

const BEANS_STORAGE_KEY = 'coffee-log-owned-beans'
const EQUIPMENT_STORAGE_KEY = 'coffee-log-equipments'
const BREW_LOG_STORAGE_KEY = 'coffee-log-brew-logs'
const RECIPE_STORAGE_KEY = 'coffee-log-recipes'

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

const emptyEquipmentForm = {
  type: 'dripper',
  name: '',
  memo: '',
}

const emptyBrewForm = {
  beanId: '',
  method: 'hot',
  dripperId: '',
  filterId: '',
  grinderId: '',
  grindClicks: '',
  dose: '',
  water: '',
  bypassWater: '',
  temperature: '',
  brewTime: '',
  rating: '3',
  bitterness: '3',
  acidity: '3',
  sweetness: '3',
  body: '3',
  aroma: '3',
  tasteMemo: '',
  nextAdjustment: '',
}

const emptyPourStep = {
  time: '',
  water: '',
  memo: '',
}

const emptyRecipeForm = {
  name: '',
  method: 'hot',
  dripperId: '',
  filterId: '',
  grinderId: '',
  grindClicks: '',
  dose: '',
  water: '',
  bypassWater: '',
  temperature: '',
  targetTime: '',
  pours: [{ ...emptyPourStep }],
  memo: '',
}

function loadFromStorage(key, fallbackValue) {
  const savedValue = localStorage.getItem(key)

  if (!savedValue) {
    return fallbackValue
  }

  try {
    return JSON.parse(savedValue)
  } catch {
    return fallbackValue
  }
}

function App() {
  const [activeTab, setActiveTab] = useState('beans')
  const [beanType, setBeanType] = useState('single')
  const [singleBean, setSingleBean] = useState(emptySingleBean)
  const [blendBean, setBlendBean] = useState(emptyBlendBean)
  const [equipmentForm, setEquipmentForm] = useState(emptyEquipmentForm)
  const [brewForm, setBrewForm] = useState(emptyBrewForm)
  const [recipeForm, setRecipeForm] = useState(emptyRecipeForm)

  const [ownedBeans, setOwnedBeans] = useState(() =>
    loadFromStorage(BEANS_STORAGE_KEY, []),
  )
  const [equipments, setEquipments] = useState(() =>
    loadFromStorage(EQUIPMENT_STORAGE_KEY, []),
  )
  const [brewLogs, setBrewLogs] = useState(() =>
    loadFromStorage(BREW_LOG_STORAGE_KEY, []),
  )
  const [recipes, setRecipes] = useState(() =>
    loadFromStorage(RECIPE_STORAGE_KEY, []),
  )

  useEffect(() => {
    localStorage.setItem(BEANS_STORAGE_KEY, JSON.stringify(ownedBeans))
  }, [ownedBeans])

  useEffect(() => {
    localStorage.setItem(EQUIPMENT_STORAGE_KEY, JSON.stringify(equipments))
  }, [equipments])

  useEffect(() => {
    localStorage.setItem(BREW_LOG_STORAGE_KEY, JSON.stringify(brewLogs))
  }, [brewLogs])

  useEffect(() => {
    localStorage.setItem(RECIPE_STORAGE_KEY, JSON.stringify(recipes))
  }, [recipes])

  const handleSingleChange = (event) => {
    const { name, value } = event.target
    setSingleBean({ ...singleBean, [name]: value })
  }
const applyRecipeToBrewForm = (recipeId) => {
  const selectedRecipe = recipes.find((recipe) => recipe.id === recipeId)

  if (!selectedRecipe) {
    return
  }

  setBrewForm({
    ...brewForm,
    method: selectedRecipe.method,
    dripperId: selectedRecipe.dripperId,
    filterId: selectedRecipe.filterId,
    grinderId: selectedRecipe.grinderId,
    grindClicks: selectedRecipe.grindClicks,
    dose: selectedRecipe.dose,
    water: selectedRecipe.water,
    bypassWater: selectedRecipe.bypassWater,
    temperature: selectedRecipe.temperature,
  })
}


  const handleBlendFieldChange = (event) => {
    const { name, value } = event.target
    setBlendBean({ ...blendBean, [name]: value })
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

  const handleEquipmentChange = (event) => {
    const { name, value } = event.target
    setEquipmentForm({ ...equipmentForm, [name]: value })
  }

  const handleSaveEquipment = (event) => {
    event.preventDefault()

    if (!equipmentForm.name.trim()) {
      alert('장비 이름을 입력해줘.')
      return
    }

    const newEquipment = {
      id: crypto.randomUUID(),
      createdAt: new Date().toLocaleString(),
      ...equipmentForm,
    }

    setEquipments([newEquipment, ...equipments])
    setEquipmentForm(emptyEquipmentForm)
  }

  const deleteEquipment = (equipmentId) => {
    const isConfirmed = window.confirm('이 장비를 삭제할까?')
    if (!isConfirmed) return

    setEquipments(equipments.filter((equipment) => equipment.id !== equipmentId))
  }

  const getEquipmentsByType = (type) => {
    return equipments.filter((equipment) => equipment.type === type)
  }

  const handleBrewChange = (event) => {
    const { name, value } = event.target
    setBrewForm({ ...brewForm, [name]: value })
  }

  const handleSaveBrewLog = (event) => {
    event.preventDefault()

    const selectedBean = ownedBeans.find((bean) => bean.id === brewForm.beanId)
    const selectedDripper = equipments.find((equipment) => equipment.id === brewForm.dripperId)
    const selectedFilter = equipments.find((equipment) => equipment.id === brewForm.filterId)
    const selectedGrinder = equipments.find((equipment) => equipment.id === brewForm.grinderId)

    if (!selectedBean) {
      alert('원두를 선택해줘.')
      return
    }

    const newBrewLog = {
      id: crypto.randomUUID(),
      createdAt: new Date().toLocaleString(),

      beanId: selectedBean.id,
      beanName: selectedBean.name,
      beanType: selectedBean.type,

      method: brewForm.method,

      dripperId: selectedDripper?.id || '',
      dripperName: selectedDripper?.name || '',
      filterId: selectedFilter?.id || '',
      filterName: selectedFilter?.name || '',
      grinderId: selectedGrinder?.id || '',
      grinderName: selectedGrinder?.name || '',

      grindClicks: brewForm.grindClicks,
      dose: brewForm.dose,
      water: brewForm.water,
      bypassWater: brewForm.bypassWater,
      temperature: brewForm.temperature,
      brewTime: brewForm.brewTime,

      rating: brewForm.rating,
      bitterness: brewForm.bitterness,
      acidity: brewForm.acidity,
      sweetness: brewForm.sweetness,
      body: brewForm.body,
      aroma: brewForm.aroma,

      tasteMemo: brewForm.tasteMemo,
      nextAdjustment: brewForm.nextAdjustment,
    }

    setBrewLogs([newBrewLog, ...brewLogs])
    setBrewForm(emptyBrewForm)
    setActiveTab('logs')
  }

  const deleteBrewLog = (logId) => {
    const isConfirmed = window.confirm('이 추출 기록을 삭제할까?')
    if (!isConfirmed) return

    setBrewLogs(brewLogs.filter((log) => log.id !== logId))
  }

  const handleRecipeChange = (event) => {
    const { name, value } = event.target
    setRecipeForm({ ...recipeForm, [name]: value })
  }

  const handlePourStepChange = (index, event) => {
    const { name, value } = event.target
    const nextPours = [...recipeForm.pours]

    nextPours[index] = {
      ...nextPours[index],
      [name]: value,
    }

    setRecipeForm({
      ...recipeForm,
      pours: nextPours,
    })
  }

  const addPourStep = () => {
    setRecipeForm({
      ...recipeForm,
      pours: [...recipeForm.pours, { ...emptyPourStep }],
    })
  }

  const removePourStep = (index) => {
    if (recipeForm.pours.length === 1) return

    setRecipeForm({
      ...recipeForm,
      pours: recipeForm.pours.filter((_, pourIndex) => pourIndex !== index),
    })
  }

  const handleSaveRecipe = (event) => {
    event.preventDefault()

    if (!recipeForm.name.trim()) {
      alert('레시피 이름을 입력해줘.')
      return
    }

    const selectedDripper = equipments.find((equipment) => equipment.id === recipeForm.dripperId)
    const selectedFilter = equipments.find((equipment) => equipment.id === recipeForm.filterId)
    const selectedGrinder = equipments.find((equipment) => equipment.id === recipeForm.grinderId)

    const cleanedPours = recipeForm.pours.filter(
      (pour) => pour.time.trim() !== '' || pour.water.trim() !== '' || pour.memo.trim() !== '',
    )

    const newRecipe = {
      id: crypto.randomUUID(),
      createdAt: new Date().toLocaleString(),

      name: recipeForm.name,
      method: recipeForm.method,

      dripperId: selectedDripper?.id || '',
      dripperName: selectedDripper?.name || '',
      filterId: selectedFilter?.id || '',
      filterName: selectedFilter?.name || '',
      grinderId: selectedGrinder?.id || '',
      grinderName: selectedGrinder?.name || '',

      grindClicks: recipeForm.grindClicks,
      dose: recipeForm.dose,
      water: recipeForm.water,
      bypassWater: recipeForm.bypassWater,
      temperature: recipeForm.temperature,
      targetTime: recipeForm.targetTime,

      pours: cleanedPours,
      memo: recipeForm.memo,
    }

    setRecipes([newRecipe, ...recipes])
    setRecipeForm(emptyRecipeForm)
  }

  const deleteRecipe = (recipeId) => {
    const isConfirmed = window.confirm('이 레시피를 삭제할까?')
    if (!isConfirmed) return

    setRecipes(recipes.filter((recipe) => recipe.id !== recipeId))
  }

  return (
    <main className="app">
      <header className="app-header">
        <h1>커피 로그</h1>
        <p>원두, 장비, 레시피, 추출 기록을 관리하는 개인 커피 데이터베이스</p>
      </header>

      <nav className="tabs">
        <TabButton active={activeTab === 'beans'} onClick={() => setActiveTab('beans')}>
          1. 원두 등록
        </TabButton>

        <TabButton active={activeTab === 'ownedBeans'} onClick={() => setActiveTab('ownedBeans')}>
          2. 보유 원두
        </TabButton>

        <TabButton active={activeTab === 'equipment'} onClick={() => setActiveTab('equipment')}>
          3. 장비 관리
        </TabButton>

        <TabButton active={activeTab === 'brew'} onClick={() => setActiveTab('brew')}>
          4. 추출 기록
        </TabButton>

        <TabButton active={activeTab === 'recipe'} onClick={() => setActiveTab('recipe')}>
          5. 레시피 등록
        </TabButton>

        <TabButton active={activeTab === 'logs'} onClick={() => setActiveTab('logs')}>
          6. 로그 확인
        </TabButton>
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

      {activeTab === 'equipment' && (
        <EquipmentTab
          equipmentForm={equipmentForm}
          equipments={equipments}
          onChange={handleEquipmentChange}
          onSubmit={handleSaveEquipment}
          onDelete={deleteEquipment}
        />
      )}

      {activeTab === 'brew' && (
        <BrewLogTab
  form={brewForm}
  beans={ownedBeans}
  recipes={recipes}
  drippers={getEquipmentsByType('dripper')}
  filters={getEquipmentsByType('filter')}
  grinders={getEquipmentsByType('grinder')}
  onChange={handleBrewChange}
  onApplyRecipe={applyRecipeToBrewForm}
  onSubmit={handleSaveBrewLog}
/>
      )}

      {activeTab === 'recipe' && (
        <RecipeTab
          form={recipeForm}
          recipes={recipes}
          drippers={getEquipmentsByType('dripper')}
          filters={getEquipmentsByType('filter')}
          grinders={getEquipmentsByType('grinder')}
          onChange={handleRecipeChange}
          onPourChange={handlePourStepChange}
          onAddPour={addPourStep}
          onRemovePour={removePourStep}
          onSubmit={handleSaveRecipe}
          onDelete={deleteRecipe}
        />
      )}

      {activeTab === 'logs' && (
        <LogsTab logs={brewLogs} onDelete={deleteBrewLog} />
      )}
    </main>
  )
}

function TabButton({ active, onClick, children }) {
  return (
    <button type="button" className={active ? 'active' : ''} onClick={onClick}>
      {children}
    </button>
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

function EquipmentTab({ equipmentForm, equipments, onChange, onSubmit, onDelete }) {
  const drippers = equipments.filter((equipment) => equipment.type === 'dripper')
  const filters = equipments.filter((equipment) => equipment.type === 'filter')
  const grinders = equipments.filter((equipment) => equipment.type === 'grinder')

  return (
    <section className="card">
      <div className="section-header">
        <div>
          <h2>장비 관리</h2>
          <p className="section-description">
            드리퍼, 필터, 그라인더를 등록하면 추출 기록과 레시피에서 선택할 수 있습니다.
          </p>
        </div>

        <span className="count-badge">{equipments.length}개</span>
      </div>

      <form className="form equipment-form" onSubmit={onSubmit}>
        <label>
          장비 종류
          <select name="type" value={equipmentForm.type} onChange={onChange}>
            <option value="dripper">드리퍼</option>
            <option value="filter">필터</option>
            <option value="grinder">그라인더</option>
          </select>
        </label>

        <label>
          장비 이름
          <input
            name="name"
            value={equipmentForm.name}
            onChange={onChange}
            placeholder="예: 하리오 V60 02, 코만단테 C40"
          />
        </label>

        <label>
          메모
          <input
            name="memo"
            value={equipmentForm.memo}
            onChange={onChange}
            placeholder="예: 아이스용으로 자주 사용"
          />
        </label>

        <button type="submit" className="submit-button">
          장비 저장
        </button>
      </form>

      <div className="equipment-sections">
        <EquipmentGroup title="드리퍼" items={drippers} onDelete={onDelete} />
        <EquipmentGroup title="필터" items={filters} onDelete={onDelete} />
        <EquipmentGroup title="그라인더" items={grinders} onDelete={onDelete} />
      </div>
    </section>
  )
}

function EquipmentGroup({ title, items, onDelete }) {
  return (
    <section className="mini-section">
      <h3>{title}</h3>

      {items.length === 0 ? (
        <p className="empty">등록된 항목이 없습니다.</p>
      ) : (
        <div className="small-card-list">
          {items.map((item) => (
            <article className="small-card" key={item.id}>
              <div>
                <strong>{item.name}</strong>
                {item.memo && <p>{item.memo}</p>}
              </div>

              <button type="button" className="remove-button" onClick={() => onDelete(item.id)}>
                삭제
              </button>
            </article>
          ))}
        </div>
      )}
    </section>
  )
}

function BrewLogTab({
  form,
  beans,
  recipes,
  drippers,
  filters,
  grinders,
  onChange,
  onApplyRecipe,
  onSubmit,
}) {
  return (
    <section className="card">
      <div className="section-header">
        <div>
          <h2>추출 기록</h2>
          <p className="section-description">
            보유 원두와 등록 장비를 선택해서 실제 추출 결과를 기록합니다.
          </p>
        </div>
      </div>

      {beans.length === 0 ? (
        <p className="empty">보유 원두가 없습니다. 먼저 1번 탭에서 원두를 등록해줘.</p>
      ) : (
        <form className="form" onSubmit={onSubmit}>
          <label>
            원두 선택
            <select name="beanId" value={form.beanId} onChange={onChange}>
              <option value="">원두를 선택하세요</option>
              {beans.map((bean) => (
                <option key={bean.id} value={bean.id}>
                  {bean.type === 'single' ? '[싱글]' : '[블렌드]'} {bean.name}
                </option>
              ))}
            </select>
          </label>

          <label>
            레시피 불러오기
            <select
              value=""
              onChange={(event) => onApplyRecipe(event.target.value)}
            >
              <option value="">레시피를 선택하세요</option>
              {recipes.map((recipe) => (
                <option key={recipe.id} value={recipe.id}>
                  {recipe.method === 'hot' ? '[핫]' : '[아이스]'} {recipe.name}
                </option>
              ))}
            </select>
          </label>

          <label>
            추출 방식
            <select name="method" value={form.method} onChange={onChange}>
              <option value="hot">핫</option>
              <option value="ice">아이스</option>
            </select>
          </label>

          <div className="grid">
            <EquipmentSelect label="드리퍼" name="dripperId" value={form.dripperId} items={drippers} onChange={onChange} />
            <EquipmentSelect label="필터" name="filterId" value={form.filterId} items={filters} onChange={onChange} />
            <EquipmentSelect label="그라인더" name="grinderId" value={form.grinderId} items={grinders} onChange={onChange} />

            <TextInput label="클릭수" name="grindClicks" value={form.grindClicks} onChange={onChange} placeholder="예: 22" />
            <TextInput label="원두량 g" name="dose" value={form.dose} onChange={onChange} placeholder="예: 30" />
            <TextInput label="물량 g" name="water" value={form.water} onChange={onChange} placeholder="예: 300" />
            <TextInput label="가수량 g" name="bypassWater" value={form.bypassWater} onChange={onChange} placeholder="예: 100" />
            <TextInput label="물온도 ℃" name="temperature" value={form.temperature} onChange={onChange} placeholder="예: 92" />
            <TextInput label="추출시간" name="brewTime" value={form.brewTime} onChange={onChange} placeholder="예: 2:40" />
          </div>

          <div className="grid">
            <RatingSelect label="별점" name="rating" value={form.rating} onChange={onChange} />
            <ScoreSelect label="쓴맛" name="bitterness" value={form.bitterness} onChange={onChange} />
            <ScoreSelect label="산미" name="acidity" value={form.acidity} onChange={onChange} />
            <ScoreSelect label="단맛" name="sweetness" value={form.sweetness} onChange={onChange} />
            <ScoreSelect label="바디감" name="body" value={form.body} onChange={onChange} />
            <ScoreSelect label="향" name="aroma" value={form.aroma} onChange={onChange} />
          </div>

          <label>
            맛 메모
            <textarea
              name="tasteMemo"
              value={form.tasteMemo}
              onChange={onChange}
              placeholder="예: 쓴맛이 강함, 단맛 좋음, 산미가 선명함"
            />
          </label>

          <label>
            다음 수정
            <textarea
              name="nextAdjustment"
              value={form.nextAdjustment}
              onChange={onChange}
              placeholder="예: 다음에는 클릭수를 2클릭 더 굵게"
            />
          </label>

          <button type="submit" className="submit-button">
            추출 기록 저장
          </button>
        </form>
      )}
    </section>
  )
}

function RecipeTab({
  form,
  recipes,
  drippers,
  filters,
  grinders,
  onChange,
  onPourChange,
  onAddPour,
  onRemovePour,
  onSubmit,
  onDelete,
}) {
  return (
    <section className="card">
      <div className="section-header">
        <div>
          <h2>레시피 등록</h2>
          <p className="section-description">
            자주 쓰는 기준 레시피를 저장합니다. 기준 그라인더와 기준 클릭수는 선택값으로 둡니다.
          </p>
        </div>

        <span className="count-badge">{recipes.length}개</span>
      </div>

      <form className="form recipe-form" onSubmit={onSubmit}>
        <label>
          레시피 이름
          <input
            name="name"
            value={form.name}
            onChange={onChange}
            placeholder="예: 아이스 V60 22g 기본"
          />
        </label>

        <label>
          추출 방식
          <select name="method" value={form.method} onChange={onChange}>
            <option value="hot">핫</option>
            <option value="ice">아이스</option>
          </select>
        </label>

        <div className="grid">
          <EquipmentSelect label="드리퍼" name="dripperId" value={form.dripperId} items={drippers} onChange={onChange} />
          <EquipmentSelect label="필터" name="filterId" value={form.filterId} items={filters} onChange={onChange} />
          <EquipmentSelect label="기준 그라인더" name="grinderId" value={form.grinderId} items={grinders} onChange={onChange} />

          <TextInput label="기준 클릭수" name="grindClicks" value={form.grindClicks} onChange={onChange} placeholder="예: 30" />
          <TextInput label="원두량 g" name="dose" value={form.dose} onChange={onChange} placeholder="예: 22" />
          <TextInput label="물량 g" name="water" value={form.water} onChange={onChange} placeholder="예: 220" />
          <TextInput label="가수량 g" name="bypassWater" value={form.bypassWater} onChange={onChange} placeholder="예: 100" />
          <TextInput label="물온도 ℃" name="temperature" value={form.temperature} onChange={onChange} placeholder="예: 93" />
          <TextInput label="목표 추출시간" name="targetTime" value={form.targetTime} onChange={onChange} placeholder="예: 2:40~3:00" />
        </div>

        <section className="blend-card">
          <div className="blend-header">
            <h3>푸어링 단계</h3>
            <button type="button" className="secondary-button" onClick={onAddPour}>
              단계 추가
            </button>
          </div>

          <div className="pour-list">
            {form.pours.map((pour, index) => (
              <div className="pour-row" key={index}>
                <TextInput label={`${index + 1}단계 시간`} name="time" value={pour.time} onChange={(event) => onPourChange(index, event)} placeholder="예: 0:00" />
                <TextInput label="누적 물량 g" name="water" value={pour.water} onChange={(event) => onPourChange(index, event)} placeholder="예: 60" />
                <TextInput label="메모" name="memo" value={pour.memo} onChange={(event) => onPourChange(index, event)} placeholder="예: 블루밍" />

                <button
                  type="button"
                  className="remove-button ratio-remove-button"
                  onClick={() => onRemovePour(index)}
                  disabled={form.pours.length === 1}
                >
                  삭제
                </button>
              </div>
            ))}
          </div>
        </section>

        <label>
          레시피 메모
          <textarea
            name="memo"
            value={form.memo}
            onChange={onChange}
            placeholder="예: 쓴맛이 나면 클릭수를 굵게, 산미가 약하면 온도 유지"
          />
        </label>

        <button type="submit" className="submit-button">
          레시피 저장
        </button>
      </form>

      <section className="recipe-list-section">
        <h3>저장된 레시피</h3>

        {recipes.length === 0 ? (
          <p className="empty">아직 저장된 레시피가 없습니다.</p>
        ) : (
          <div className="bean-list">
            {recipes.map((recipe) => (
              <article className="bean-card" key={recipe.id}>
                <div className="bean-card-header">
                  <div>
                    <span className="bean-type blend">
                      {recipe.method === 'hot' ? '핫' : '아이스'}
                    </span>
                    <h3>{recipe.name}</h3>
                  </div>

                  <button type="button" className="remove-button" onClick={() => onDelete(recipe.id)}>
                    삭제
                  </button>
                </div>

                <div className="bean-info">
                  <InfoRow label="장비" value={`${recipe.dripperName || '-'} / ${recipe.filterName || '-'} / ${recipe.grinderName || '-'}`} />
                  <InfoRow label="기준 클릭수" value={recipe.grindClicks} />
                  <InfoRow label="원두량" value={recipe.dose ? `${recipe.dose}g` : ''} />
                  <InfoRow label="물량" value={recipe.water ? `${recipe.water}g` : ''} />
                  <InfoRow label="가수량" value={recipe.bypassWater ? `${recipe.bypassWater}g` : ''} />
                  <InfoRow label="물온도" value={recipe.temperature ? `${recipe.temperature}℃` : ''} />
                  <InfoRow label="목표 추출시간" value={recipe.targetTime} />

                  <PourSummary pours={recipe.pours} />

                  <InfoRow label="메모" value={recipe.memo} />
                </div>

                <small className="created-at">등록일: {recipe.createdAt}</small>
              </article>
            ))}
          </div>
        )}
      </section>
    </section>
  )
}

function EquipmentSelect({ label, name, value, items, onChange }) {
  return (
    <label>
      {label}
      <select name={name} value={value} onChange={onChange}>
        <option value="">선택 안 함</option>
        {items.map((equipment) => (
          <option key={equipment.id} value={equipment.id}>
            {equipment.name}
          </option>
        ))}
      </select>
    </label>
  )
}

function TextInput({ label, name, value, onChange, placeholder }) {
  return (
    <label>
      {label}
      <input name={name} value={value} onChange={onChange} placeholder={placeholder} />
    </label>
  )
}

function RatingSelect({ label, name, value, onChange }) {
  return (
    <label>
      {label}
      <select name={name} value={value} onChange={onChange}>
        <option value="1">★☆☆☆☆</option>
        <option value="2">★★☆☆☆</option>
        <option value="3">★★★☆☆</option>
        <option value="4">★★★★☆</option>
        <option value="5">★★★★★</option>
      </select>
    </label>
  )
}

function ScoreSelect({ label, name, value, onChange }) {
  return (
    <label>
      {label}
      <select name={name} value={value} onChange={onChange}>
        <option value="1">1 낮음</option>
        <option value="2">2</option>
        <option value="3">3 보통</option>
        <option value="4">4</option>
        <option value="5">5 높음</option>
      </select>
    </label>
  )
}

function LogsTab({ logs, onDelete }) {
  return (
    <section className="card">
      <div className="section-header">
        <div>
          <h2>로그 확인</h2>
          <p className="section-description">
            저장된 추출 기록을 확인하는 화면입니다.
          </p>
        </div>

        <span className="count-badge">{logs.length}개</span>
      </div>

      {logs.length === 0 ? (
        <p className="empty">아직 저장된 추출 기록이 없습니다.</p>
      ) : (
        <div className="bean-list">
          {logs.map((log) => (
            <article className="bean-card" key={log.id}>
              <div className="bean-card-header">
                <div>
                  <span className={log.beanType === 'single' ? 'bean-type single' : 'bean-type blend'}>
                    {log.method === 'hot' ? '핫' : '아이스'}
                  </span>
                  <h3>{log.beanName}</h3>
                </div>

                <button type="button" className="remove-button" onClick={() => onDelete(log.id)}>
                  삭제
                </button>
              </div>

              <div className="bean-info">
                <InfoRow label="장비" value={`${log.dripperName || '-'} / ${log.filterName || '-'} / ${log.grinderName || '-'}`} />
                <InfoRow label="클릭수" value={log.grindClicks} />
                <InfoRow label="원두량" value={log.dose ? `${log.dose}g` : ''} />
                <InfoRow label="물량" value={log.water ? `${log.water}g` : ''} />
                <InfoRow label="가수량" value={log.bypassWater ? `${log.bypassWater}g` : ''} />
                <InfoRow label="물온도" value={log.temperature ? `${log.temperature}℃` : ''} />
                <InfoRow label="추출시간" value={log.brewTime} />
                <InfoRow label="별점" value={'★'.repeat(Number(log.rating))} />
                <InfoRow
                  label="맛 수치"
                  value={`쓴맛 ${log.bitterness} / 산미 ${log.acidity} / 단맛 ${log.sweetness} / 바디 ${log.body} / 향 ${log.aroma}`}
                />
                <InfoRow label="맛 메모" value={log.tasteMemo} />
                <InfoRow label="다음 수정" value={log.nextAdjustment} />
              </div>

              <small className="created-at">기록일: {log.createdAt}</small>
            </article>
          ))}
        </div>
      )}
    </section>
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

function PourSummary({ pours }) {
  if (!pours || pours.length === 0) {
    return <InfoRow label="푸어링" value="" />
  }

  return (
    <div className="pour-summary">
      <strong>푸어링:</strong>
      <ol>
        {pours.map((pour, index) => (
          <li key={index}>
            {pour.time || '-'} / {pour.water || '-'}g / {pour.memo || '-'}
          </li>
        ))}
      </ol>
    </div>
  )
}

export default App