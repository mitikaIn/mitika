export type ToastType = "info" | "success" | "warning" | "error";

export interface Toast {
    id: string;
    message: string;
    type: ToastType;
}

const toasts: Ref<Toast[]> = ref([]);

let counter = 0;

export function useToast() {
    function show(message: string, type: ToastType = "info", duration = 3000) {
        const id = `toast-${counter++}`;
        const toast: Toast = { id, message, type };
        toasts.value.push(toast);

        if (duration > 0) {
            setTimeout(() => {
                remove(id);
            }, duration);
        }
    }

    function remove(id: string) {
        const index = toasts.value.findIndex((t) => t.id === id);
        if (index !== -1) {
            toasts.value.splice(index, 1);
        }
    }

    return {
        toasts,
        show,
        remove,
    };
}
