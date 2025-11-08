'use client'

import { Provider } from 'react-redux';
import { store } from './store';
import React from 'react';
interface ProviderProps{
    children :React.ReactNode;
}
export function Providers({ children }:ProviderProps){
  
     return (
        <Provider store={store}>
            {children}
        </Provider>
    )
}
