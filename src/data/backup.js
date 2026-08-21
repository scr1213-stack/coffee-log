const BACKUP_APP_NAME = 'coffee-log'
const BACKUP_VERSION = 1

function isValidRecordArray(value) {
  return (
    Array.isArray(value) &&
    value.every(
      (item) =>
        item !== null &&
        typeof item === 'object' &&
        !Array.isArray(item) &&
        typeof item.id === 'string' &&
        item.id.length > 0,
    )
  )
}

export function createBackup({ ownedBeans, equipments, recipes, brewLogs }) {
  return {
    app: BACKUP_APP_NAME,
    version: BACKUP_VERSION,
    exportedAt: new Date().toISOString(),
    data: {
      beans: ownedBeans,
      equipments,
      recipes,
      brewLogs,
    },
  }
}

export function parseBackupFile(contents) {
  const backup = JSON.parse(contents)

  if (
    backup?.app !== BACKUP_APP_NAME ||
    backup?.version !== BACKUP_VERSION ||
    !backup.data ||
    !isValidRecordArray(backup.data.beans) ||
    !isValidRecordArray(backup.data.equipments) ||
    !isValidRecordArray(backup.data.recipes) ||
    !isValidRecordArray(backup.data.brewLogs)
  ) {
    throw new Error('지원하지 않는 백업 파일입니다.')
  }

  return backup.data
}
