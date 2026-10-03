'use client';

import {useState, ReactNode, createContext, ComponentType} from 'react';
import {BaseDialog} from '@/components/ui/dialog';

type DialogComponentProps = {
  closeDialog: () => void;
};

type DialogContextType = {
  openDialog: <P extends object>(
    component: ComponentType<P & DialogComponentProps>,
    props?: P
  ) => void;
  closeDialog: () => void;
};

export const DialogContext = createContext<DialogContextType | null>(null);

export function DialogProvider({children}: {children: ReactNode}) {
  const [open, setOpen] = useState(false);
  const [Component, setComponent] = useState<ComponentType<
    Record<string, unknown> & DialogComponentProps
  > | null>(null);
  const [props, setProps] = useState<Record<string, unknown>>({});

  const openDialog = <P extends object>(
    component: ComponentType<P & DialogComponentProps>,
    componentProps?: P
  ) => {
    setComponent(
      () =>
        component as ComponentType<
          Record<string, unknown> & DialogComponentProps
        >
    );
    setProps(componentProps ?? {});
    setOpen(true);
  };

  const closeDialog = () => {
    setOpen(false);
    setTimeout(() => {
      setComponent(null);
      setProps({});
    }, 200);
  };

  return (
    <DialogContext.Provider value={{openDialog, closeDialog}}>
      {children}

      <BaseDialog open={open} onClose={closeDialog}>
        {Component && <Component {...props} closeDialog={closeDialog} />}
      </BaseDialog>
    </DialogContext.Provider>
  );
}
