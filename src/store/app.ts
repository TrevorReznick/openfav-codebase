import { atom } from "nanostores"

export const testUsername = atom<string>("Guest")
export const counter = atom<number>(0)
export const theme = atom<"light" | "dark">("light")
