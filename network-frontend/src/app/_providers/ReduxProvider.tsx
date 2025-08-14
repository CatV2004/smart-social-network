// 'use client';

// import React from 'react';
// import { Provider } from 'react-redux';
// import { store } from '@/redux/store';

// interface Props {
//   children: React.ReactNode;
// }

// export const ReduxProvider = ({ children }: Props) => {
//   return <Provider store={store}>{children}</Provider>;
// };

// app/_providers/ReduxProvider.tsx
"use client";

import React from "react";
import { Provider } from "react-redux";
import { store, persistor } from "@/redux/store";
import { PersistGate } from "redux-persist/integration/react";

interface Props {
  children: React.ReactNode;
}

export const ReduxProvider = ({ children }: Props) => {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        {children}
      </PersistGate>
    </Provider>
  );
};
