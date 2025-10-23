import toast from 'react-hot-toast';

interface ToastOptions {
  title?: string;
  description?: string;
  variant?: 'default' | 'destructive' | 'success';
  [key: string]: any;
}

export function useToast() {
  return {
    toast: (options: string | ToastOptions) => {
      if (typeof options === 'string') {
        return toast(options);
      }
      
      const { title, description, variant = 'default', ...toastOptions } = options;
      
      let message = title || '';
      if (description) {
        message = title ? `${title}\n${description}` : description;
      }
      
      switch (variant) {
        case 'destructive':
          return toast.error(message, toastOptions);
        case 'success':
          return toast.success(message, toastOptions);
        default:
          return toast(message, toastOptions);
      }
    }
  };
}
