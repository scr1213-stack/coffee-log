export const STORAGE_KEYS = {
  ownedBeans: 'coffee-log-owned-beans',
  equipments: 'coffee-log-equipments',
  brewLogs: 'coffee-log-brew-logs',
  recipes: 'coffee-log-recipes',
}

export function loadCollection(storageKey) {
  const savedValue = localStorage.getItem(storageKey)

  if (!savedValue) {
    return []
  }

  try {
    const parsedValue = JSON.parse(savedValue)
    return Array.isArray(parsedValue) ? parsedValue : []
  } catch {
    return []
  }
}

export function saveCollection(storageKey, records) {
  localStorage.setItem(storageKey, JSON.stringify(records))
}
