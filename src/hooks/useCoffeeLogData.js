import { useEffect, useRef, useState } from 'react'
import {
  loadCollection,
  getStorageKeys,
  hasCompletedRemoteSync,
  markRemoteSyncComplete,
  saveCollection,
} from '../repositories/localStorageRepository'
import {
  hasCoffeeLogData,
  loadCoffeeLogData,
  mergeCoffeeLogData,
  saveCoffeeLogData,
  syncCoffeeLogChanges,
} from '../repositories/supabaseRepository'

export function useCoffeeLogData(user) {
  const userId = user?.id
  const storageKeys = getStorageKeys(userId)
  const [ownedBeans, setOwnedBeans] = useState(() =>
    loadCollection(storageKeys.ownedBeans),
  )
  const [equipments, setEquipments] = useState(() =>
    loadCollection(storageKeys.equipments),
  )
  const [brewLogs, setBrewLogs] = useState(() =>
    loadCollection(storageKeys.brewLogs),
  )
  const [recipes, setRecipes] = useState(() =>
    loadCollection(storageKeys.recipes),
  )
  const [syncStatus, setSyncStatus] = useState(user ? 'loading' : 'local')
  const [syncError, setSyncError] = useState('')
  const [syncAttempt, setSyncAttempt] = useState(0)
  const remoteReadyRef = useRef(false)
  const localDataRef = useRef(null)
  const lastSyncedDataRef = useRef(null)

  localDataRef.current = { ownedBeans, equipments, recipes, brewLogs }

  useEffect(() => {
    saveCollection(storageKeys.ownedBeans, ownedBeans)
  }, [ownedBeans, storageKeys.ownedBeans])

  useEffect(() => {
    saveCollection(storageKeys.equipments, equipments)
  }, [equipments, storageKeys.equipments])

  useEffect(() => {
    saveCollection(storageKeys.brewLogs, brewLogs)
  }, [brewLogs, storageKeys.brewLogs])

  useEffect(() => {
    saveCollection(storageKeys.recipes, recipes)
  }, [recipes, storageKeys.recipes])

  useEffect(() => {
    remoteReadyRef.current = false

    if (!userId) {
      setSyncStatus('local')
      setSyncError('')
      return undefined
    }

    let isCancelled = false

    const initializeRemoteData = async () => {
      setSyncStatus('loading')
      setSyncError('')

      try {
        const remoteData = await loadCoffeeLogData(userId)

        if (isCancelled) return

        const isFirstRemoteSync = !hasCompletedRemoteSync(userId)
        const nextData = isFirstRemoteSync
          ? mergeCoffeeLogData(localDataRef.current, remoteData)
          : remoteData

        setOwnedBeans(nextData.ownedBeans)
        setEquipments(nextData.equipments)
        setRecipes(nextData.recipes)
        setBrewLogs(nextData.brewLogs)

        if (isFirstRemoteSync && hasCoffeeLogData(nextData)) {
          await saveCoffeeLogData(userId, nextData)
        }

        if (isCancelled) return

        markRemoteSyncComplete(userId)
        lastSyncedDataRef.current = nextData
        remoteReadyRef.current = true
        setSyncStatus('synced')
      } catch (error) {
        if (isCancelled) return

        setSyncStatus('error')
        setSyncError(error.message || '데이터를 동기화하지 못했습니다.')
      }
    }

    initializeRemoteData()

    return () => {
      isCancelled = true
    }
  }, [userId, syncAttempt])

  useEffect(() => {
    if (!userId || !remoteReadyRef.current) return undefined

    let isCancelled = false
    const timer = window.setTimeout(async () => {
      setSyncStatus('saving')

      try {
        const currentData = {
          ownedBeans,
          equipments,
          recipes,
          brewLogs,
        }
        const previousData = lastSyncedDataRef.current ?? currentData

        await syncCoffeeLogChanges(userId, previousData, currentData)

        if (!isCancelled) {
          lastSyncedDataRef.current = currentData
          setSyncStatus('synced')
          setSyncError('')
        }
      } catch (error) {
        if (!isCancelled) {
          setSyncStatus('error')
          setSyncError(error.message || '변경 사항을 저장하지 못했습니다.')
        }
      }
    }, 500)

    return () => {
      isCancelled = true
      window.clearTimeout(timer)
    }
  }, [ownedBeans, equipments, recipes, brewLogs, userId])

  return {
    ownedBeans,
    setOwnedBeans,
    equipments,
    setEquipments,
    brewLogs,
    setBrewLogs,
    recipes,
    setRecipes,
    syncStatus,
    syncError,
    retrySync: () => setSyncAttempt((attempt) => attempt + 1),
  }
}
