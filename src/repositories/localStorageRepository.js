export const STORAGE_KEYS = {
  ownedBeans: 'coffee-log-owned-beans',
  equipments: 'coffee-log-equipments',
  brewLogs: 'coffee-log-brew-logs',
  recipes: 'coffee-log-recipes',
}

const LEGACY_DATA_OWNER_KEY = 'coffee-log-legacy-data-owner'
const REMOTE_SYNC_MARKER_PREFIX = 'coffee-log-remote-sync-complete'

export function getStorageKeys(userId) {
  if (!userId) return STORAGE_KEYS

  const legacyOwner = localStorage.getItem(LEGACY_DATA_OWNER_KEY)

  if (!legacyOwner) {
    localStorage.setItem(LEGACY_DATA_OWNER_KEY, userId)

    for (const storageKey of Object.values(STORAGE_KEYS)) {
      const savedValue = localStorage.getItem(storageKey)
      if (savedValue) {
        localStorage.setItem(`${storageKey}:${userId}`, savedValue)
      }
    }
  }

  return Object.fromEntries(
    Object.entries(STORAGE_KEYS).map(([name, storageKey]) => [
      name,
      `${storageKey}:${userId}`,
    ]),
  )
}

export function hasCompletedRemoteSync(userId) {
  return localStorage.getItem(`${REMOTE_SYNC_MARKER_PREFIX}:${userId}`) === 'true'
}

export function markRemoteSyncComplete(userId) {
  localStorage.setItem(`${REMOTE_SYNC_MARKER_PREFIX}:${userId}`, 'true')
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
