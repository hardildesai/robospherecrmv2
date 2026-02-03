# Troubleshooting Guide: White Screen / Styling Issues

If the application is rendering as a plain white screen, the dark theme CSS variables or Tailwind styles are likely not loading correctly.

## 1. Quick Visual Checks

### A. Check the background color
1. Open the browser (http://localhost:5173).
2. Right-click anywhere on the white background -> **Inspect**.
3. Select the `<body>` element.
4. Look at the **Styles** tab.
   - Do you see `background-color: var(--color-void);`?
   - Is it crossed out?
   - If you hover over `--color-void`, does it show a hex color (`#09090b`)?

### B. Check for CSS Errors
1. Open the **Console** tab in Developer Tools (F12).
2. Look for errors like:
   - `[vite] failed to connect to websocket`
   - `Failed to load resource: src/index.css`
   - CSS syntax errors.

## 2. Code Verification Checklists

Since we are using **Tailwind CSS v4**, the configuration is slightly different from v3.

### Check 1: `vite.config.ts`
Ensure the Tailwind Vite plugin is imported and added to plugins.
```typescript
import tailwindcss from '@tailwindcss/vite'
// ...
export default defineConfig({
  plugins: [react(), tailwindcss()],
})
```

### Check 2: `src/index.css`
Ensure the `@import "tailwindcss";` is present and **before** other styles (except font imports).
```css
@import "tailwindcss";

@theme {
  --color-void: #09090b;
  /* ... other variables ... */
}
```

### Check 3: `src/main.tsx`
Ensure proper import order.
```typescript
import './index.css' // Must be imported before App
import App from './App.tsx'
```

## 3. Common Fixes

### Force dependency optimization
Sometimes Vite caches old dependencies.
1. Stop the terminal/server (`Ctrl+C`).
2. Run: 
   ```powershell
   rm -rf node_modules/.vite
   npm run dev
   ```

### Check Tailwind Version
If the `@theme` directive isn't recognized, verify you have v4 installed.
Run `npm list tailwindcss`. It should say `tailwindcss@4.x`.
