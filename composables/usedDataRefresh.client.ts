interface DataRefreshEvents {
  'users:created': { userId: string, userData: any }
  'users:updated': { userId: string; userData: any }
  'users:deleted': { userId: string }
  'users:refresh': { force?: boolean }
  'roles:updated': { roleId: string }
}

type EventKey = keyof DataRefreshEvents
type EventData<K extends EventKey> = DataRefreshEvents[K]

export const useDataRefreshClient = () => {

  const eventBus = ref(new Map<EventKey, Set<Function>>())
  // Subscribe to events
  const on = <K extends EventKey>(event: K, callback: (data: EventData<K>) => void) => {
    if (!eventBus.value.has(event)) {
      eventBus.value.set(event, new Set())
    }
    eventBus.value.get(event)!.add(callback)

    // Return unsubscribe function
    return () => {
      const callbacks = eventBus.value.get(event)
      if (callbacks) {
        callbacks.delete(callback)
      }
    }
  };

  const emit = <K extends EventKey>(event: K, data: EventData<K>) => {
    const callbacks = eventBus.value.get(event)
    if (callbacks) {
      callbacks.forEach(callback => {
        try {
          callback(data)
        } catch (error) {
          console.error(`Error in event callback for ${event}:`, error)
        }
      })
    }
  };

  // Convenience methods for common events
  const notifyUserCreated = (userId: string, userData: any) => {
    emit('users:created', { userId, userData })
    emit('users:refresh', { force: true })
  }

  const notifyUserUpdated = (userId: string, userData: any) => {
    emit('users:updated', { userId, userData })
    emit('users:refresh', { force: true })
  }

  const notifyUserDeleted = (userId: string) => {
    emit('users:deleted', { userId })
    emit('users:refresh', { force: true })
  }

  const notifyUsersRefresh = (force: boolean = false) => {
    emit('users:refresh', { force })
  }


  // Auto-cleanup on component unmount
  onBeforeUnmount(() => {
    eventBus.value.clear()
  })

  return {
    on,
    emit,
    notifyUserCreated,
    notifyUserUpdated,
    notifyUserDeleted,
    notifyUsersRefresh
  }

}

