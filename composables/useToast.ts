export const useToast = () => {
  const addToast = inject('addToast') as ((options: any) => string) | undefined
  const removeToast = inject('removeToast') as ((id: string) => void) | undefined
  const clearAllToasts = inject('clearAllToasts') as (() => void) | undefined

  const success = (message: string, options?: { title?: string; duration?: number; action?: any }) => {
    return addToast?.({
      type: 'success',
      message,
      ...options
    })
  }

  const error = (message: string, options?: { title?: string; duration?: number; action?: any }) => {
    return addToast?.({
      type: 'error',
      message,
      ...options
    })
  }

  const warning = (message: string, options?: { title?: string; duration?: number; action?: any }) => {
    return addToast?.({
      type: 'warning',
      message,
      ...options
    })
  }

  const info = (message: string, options?: { title?: string; duration?: number; action?: any }) => {
    return addToast?.({
      type: 'info',
      message,
      ...options
    })
  }

  const remove = (id: string) => {
    removeToast?.(id)
  }

  const clear = () => {
    clearAllToasts?.()
  }

  return {
    success,
    error,
    warning,
    info,
    remove,
    clear
  }
}