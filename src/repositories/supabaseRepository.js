import { supabase } from '../lib/supabase'

const COLLECTION_NAMES = {
  ownedBeans: 'beans',
  equipments: 'equipments',
  recipes: 'recipes',
  brewLogs: 'brew_logs',
}

function emptyCoffeeLogData() {
  return {
    ownedBeans: [],
    equipments: [],
    recipes: [],
    brewLogs: [],
  }
}

export async function loadCoffeeLogData(userId) {
  const { data, error } = await supabase
    .from('coffee_log_records')
    .select('collection, payload')
    .eq('user_id', userId)

  if (error) throw error

  const coffeeLogData = emptyCoffeeLogData()
  const stateKeyByCollection = Object.fromEntries(
    Object.entries(COLLECTION_NAMES).map(([key, value]) => [value, key]),
  )

  for (const row of data) {
    const stateKey = stateKeyByCollection[row.collection]
    if (stateKey && row.payload) {
      coffeeLogData[stateKey].push(row.payload)
    }
  }

  return coffeeLogData
}

export async function saveCoffeeLogData(userId, coffeeLogData) {
  const rows = Object.entries(COLLECTION_NAMES).flatMap(([stateKey, collection]) =>
    coffeeLogData[stateKey].map((record) => ({
      user_id: userId,
      collection,
      record_id: record.id,
      payload: record,
    })),
  )

  if (rows.length > 0) {
    const { error } = await supabase
      .from('coffee_log_records')
      .upsert(rows, { onConflict: 'user_id,collection,record_id' })

    if (error) throw error
  }
}

export async function syncCoffeeLogChanges(userId, previousData, currentData) {
  const changedRows = Object.entries(COLLECTION_NAMES).flatMap(
    ([stateKey, collection]) => {
      const previousById = new Map(
        previousData[stateKey].map((record) => [record.id, record]),
      )

      return currentData[stateKey]
        .filter((record) => {
          const previousRecord = previousById.get(record.id)
          return JSON.stringify(previousRecord) !== JSON.stringify(record)
        })
        .map((record) => ({
          user_id: userId,
          collection,
          record_id: record.id,
          payload: record,
        }))
    },
  )

  if (changedRows.length > 0) {
    const { error } = await supabase
      .from('coffee_log_records')
      .upsert(changedRows, { onConflict: 'user_id,collection,record_id' })

    if (error) throw error
  }

  for (const [stateKey, collection] of Object.entries(COLLECTION_NAMES)) {
    const currentIds = new Set(currentData[stateKey].map((record) => record.id))
    const deletedIds = previousData[stateKey]
      .filter((record) => !currentIds.has(record.id))
      .map((record) => record.id)

    if (deletedIds.length === 0) continue

    const { error } = await supabase
      .from('coffee_log_records')
      .delete()
      .eq('user_id', userId)
      .eq('collection', collection)
      .in('record_id', deletedIds)

    if (error) throw error
  }
}

export function hasCoffeeLogData(coffeeLogData) {
  return Object.values(coffeeLogData).some((records) => records.length > 0)
}

export function mergeCoffeeLogData(localData, remoteData) {
  return Object.fromEntries(
    Object.keys(COLLECTION_NAMES).map((stateKey) => {
      const recordsById = new Map(
        localData[stateKey].map((record) => [record.id, record]),
      )

      for (const record of remoteData[stateKey]) {
        recordsById.set(record.id, record)
      }

      return [stateKey, [...recordsById.values()]]
    }),
  )
}
