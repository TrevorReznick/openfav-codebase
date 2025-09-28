import { atom } from 'nanostores'

/* @@ navigation @@ */

export const currentPath = atom<string>('/')
export const previousPath = atom<string>('/')

/* @@ test @@ */
export const testUsername = atom<string>("Guest")
export const counter = atom<number>(0)
export const theme = atom<"light" | "dark">("light")

export const counterStore = atom<number>(0)

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

