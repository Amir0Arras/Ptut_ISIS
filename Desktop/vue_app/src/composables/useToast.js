import { ref } from 'vue'

const toasts = ref([])
let toastId = 0

export function useToast() {
  const toast = ({ title, description, variant = 'default', className = '' }) => {
    const id = ++toastId
    toasts.value.push({ id, title, description, variant, className })

    setTimeout(() => {
      toasts.value = toasts.value.filter(t => t.id !== id)
    }, 4000)
  }

  const dismiss = (id) => {
    toasts.value = toasts.value.filter(t => t.id !== id)
  }

  return { toast, toasts, dismiss }
}
