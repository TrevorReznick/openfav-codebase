# PRD: Utilizzo di Tailwind, Tailwind Config, Globals e Design Tokens

## Obiettivi
- Standardizzare colori, spaziatura e tipografia tramite design tokens.
- Centralizzare la personalizzazione del tema in `globals.css` e `tailwind.config.ts`.
- Garantire coerenza tra classi Tailwind (utility-first) e variabili CSS (tokens).

## Stack e Struttura
- Framework: `astro` con componenti `react`.
- Styling: `tailwindcss` con plugin (`@tailwindcss/typography`, `forms`, `aspect-ratio`, `tailwindcss-animate`).
- Token helpers: `src/lib/tokens.ts`.
- Global styles: `src/styles/globals.css`.
- Config: `tailwind.config.ts`.

## Tailwind Config
- Modalità dark: `darkMode: "class"` (`tailwind.config.ts:5`).
- Scansione contenuti: `content` su `./src`, `./components`, `./app` (`tailwind.config.ts:6-10`).
- `extend.spacing`: collega eventuali token di spaziatura (`tailwind.config.ts:20-22`).
- `extend.fontFamily`: usa variabili CSS `--font-sans`, `--font-mono` (`tailwind.config.ts:24-27`).
- `extend.colors`:
  - Palette tokenizzata esposta come colori Tailwind (chiavi descrittive come `primary-color`, `card-bg`) (`tailwind.config.ts:31-46`).
  - Mappa colori shadcn/ui basati su variabili `--primary`, `--secondary` (`tailwind.config.ts:48-76`).
- Plugin attivi (`tailwind.config.ts:104-109`).

## Variabili Globali (Globals)
- Definite in `:root` dentro `src/styles/globals.css` (`src/styles/globals.css:46-64`).
- Palette esposta come variabili `--color-*` puntate a valori `hsl(...)`, ad es.:
  - `--color-primary-color`, `--color-secondary-color`, `--color-accent-color`.
  - `--color-card-bg`, `--color-card-border`.
  - `--color-background-color`, `--color-text-color`.
- Scala di spaziatura `--spacing-*` (`src/styles/globals.css:66-79`).
- Tipografia: `--font-sans`, `--font-mono`, `--font-size-*` (`src/styles/globals.css:80-84`).

## Design Tokens e Helpers
- File: `src/lib/tokens.ts`.
- `getColor(key)`: ritorna `var(--color-${key})` (`src/lib/tokens.ts:33-35`).
- `getSpacing(key)`: ritorna `var(--spacing-${key})` (`src/lib/tokens.ts:29-31`).
- Nota: i colori sono già in formato utilizzabile come CSS variable; non avvolgerli in `hsl(...)` quando si usa `getColor`.

## Modalità d’Uso
- Con Tailwind (preferito):
  - Usa le classi predefinite o estese dal tema: `bg-primary`, `text-foreground`, oppure i colori descrittivi mappati in config, es. `bg-[color:var(--color-primary-color)]` dove serve.
  - Per palette tokenizzata esposta in `tailwind.config.ts:31-46`, puoi usare classi come `text-[color:var(--color-text-color)]` quando non esiste una utility dedicata.
- Con CSS variables in React:
  - Colori: `style={{ backgroundColor: getColor('primary-color') }}`.
  - Spaziatura: `style={{ padding: getSpacing(4) }}`.
  - Bordo card: `style={{ backgroundColor: 'var(--color-card-bg)', border: '1px solid var(--color-card-border)' }}`.
- Con shadcn/ui:
  - Componenti usano variabili come `--primary` mappate a `hsl(var(--primary))` in config (`tailwind.config.ts:48-52`).

## Convenzioni di Naming
- Palette di progetto (docs): usa chiavi descrittive: `primary-color`, `secondary-color`, `accent-color`, `background-color`, `text-color`, `card-bg`, `card-border`.
- Helper `getColor`: accetta la stessa chiave usata in `globals.css` senza aggiunta di `hsl(...)`.
- Evitare conflitti con set shadcn (`--primary`, `--secondary`): mantieni prefisso `*-color` per palette di progetto.

## Aggiungere Nuovi Token
1. Aggiungi la variabile in `src/styles/globals.css` sotto `:root` (es. `--color-brand-contrast: hsl(…)`).
2. Se vuoi esporla come colore Tailwind, aggiungi la chiave corrispondente in `extend.colors` (`tailwind.config.ts`).
3. Se serve negli helper, usa direttamente `getColor('brand-contrast')` (nessun `hsl(...)`).
4. Aggiorna eventuali esempi/test e documentazione.

## Best Practices
- Preferisci classi Tailwind per layout e tipografia; usa tokens per colori/spaziatura custom.
- Usa `getColor`/`getSpacing` per inline styles in React, mantenendo chiavi allineate ai `--color-*`/`--spacing-*` di `globals.css`.
- Non incapsulare `var(--color-*)` in `hsl(...)` se la variabile contiene già `hsl(...)`.
- Evita duplicazioni di definizioni colore; centralizza in `globals.css` e referenzia dal config.

## Esempi
```tsx
// Colore card con bordo
<div
  className="rounded-lg"
  style={{
    backgroundColor: 'var(--color-card-bg)',
    border: '1px solid var(--color-card-border)'
  }}
/>

// Spaziatura via token
<div style={{ padding: getSpacing(4) }} />

// Tipografia Tailwind
<p className="font-sans text-lg">Testo</p>
```

## Testing e Debug
- Verifica la resa dei token con componenti test come `TokenTest` e `TokenView`.
- Se un colore non appare, controlla:
  - La chiave esposta in `globals.css` (`src/styles/globals.css:46-64`).
  - La mappatura in `tailwind.config.ts` (`tailwind.config.ts:31-46`).
  - L’uso corretto di `getColor(key)` senza `hsl(...)`.
