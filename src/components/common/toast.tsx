import {toast as baseToast} from 'sonner';

type ToastOptions = Parameters<typeof baseToast>;
const defaultClass = 'text-sm leading-normal font-medium';
const toast = {
  success: (Message: ToastOptions[0], options?: ToastOptions[1]) => {
    baseToast.success(
      <h6 className={defaultClass}>
        {typeof Message === 'function' ? <Message /> : Message}
      </h6>,
      options
    );
  },
  error: (Message: ToastOptions[0], options?: ToastOptions[1]) => {
    baseToast.error(
      <h6 className={defaultClass}>
        {typeof Message === 'function' ? <Message /> : Message}
      </h6>,
      options
    );
  },
  info: (Message: ToastOptions[0], options?: ToastOptions[1]) => {
    baseToast.info(
      <h6 className={defaultClass}>
        {typeof Message === 'function' ? <Message /> : Message}
      </h6>,
      options
    );
  },
  warning: (Message: ToastOptions[0], options?: ToastOptions[1]) => {
    baseToast.warning(
      <h6 className={defaultClass}>
        {typeof Message === 'function' ? <Message /> : Message}
      </h6>,
      options
    );
  }
};

export {toast};
