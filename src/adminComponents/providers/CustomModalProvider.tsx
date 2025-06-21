import React from 'react';
import { ModalProvider, ModalContainer } from '@faceless-ui/modal';

const CustomModalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <ModalProvider>
      {children}
      <ModalContainer />
    </ModalProvider>
  );
};

export default CustomModalProvider;