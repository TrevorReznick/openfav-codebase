import { atom } from 'nanostores'

/* @@ test @@ */

export const counterStore = atom(0)

/* @@ navigation @@ */

export const currentPath = atom<string>('/')
export const previousPath = atom<string>('/')

/* @@ notification @@ */

type Message = string;

export const notifications = atom<Message[]>([])
export const messageStore = atom<string>('')

/* @@ auth store @@ */
export const userStore = atom<any>(null) // Stato dell'utente (null se non autenticato)
export const loadingStore = atom(true) // Inizialmente true, indica che il caricamento è in

/* @@ theme store @@ */
// Imposto il tema scuro come predefinito
export const themeStore = atom({
  theme: 'dark',
  systemTheme: 'dark'
})
export function useLoading() {
  return {
    isLoading: loadingStore.get(),
    message: messageStore.get()
  };
}

