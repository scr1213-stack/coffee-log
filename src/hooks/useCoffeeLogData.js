import { useEffect, useState } from 'react'
import {
  loadCollection,
  saveCollection,
  STORAGE_KEYS,
} from '../repositories/localStorageRepository'

export function useCoffeeLogData() {
  const [ownedBeans, setOwnedBeans] = useState(() =>
    loadCollection(STORAGE_KEYS.ownedBeans),
  )
  const [equipments, setEquipments] = useState(() =>
    loadCollection(STORAGE_KEYS.equipments),
  )
  const [brewLogs, setBrewLogs] = useState(() =>
    loadCollection(STORAGE_KEYS.brewLogs),
  )
  const [recipes, setRecipes] = useState(() =>
    loadCollection(STORAGE_KEYS.recipes),
  )

  useEffect(() => {
    saveCollection(STORAGE_KEYS.ownedBeans, ownedBeans)
  }, [ownedBeans])

  useEffect(() => {
    saveCollection(STORAGE_KEYS.equipments, equipments)
  }, [equipments])

  useEffect(() => {
    saveCollection(STORAGE_KEYS.brewLogs, brewLogs)
  }, [brewLogs])

  useEffect(() => {
    saveCollection(STORAGE_KEYS.recipes, recipes)
  }, [recipes])

  return {
    ownedBeans,
    setOwnedBeans,
    equipments,
    setEquipments,
    brewLogs,
    setBrewLogs,
    recipes,
    setRecipes,
  }
}
