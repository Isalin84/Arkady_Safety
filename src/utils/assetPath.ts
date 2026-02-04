/**
 * Utility to get correct asset paths for GitHub Pages deployment.
 * Uses Vite's BASE_URL which is '/' locally and '/Arkady_Safety/' on GitHub Pages.
 */
export function getAssetPath(path: string): string {
  const base = import.meta.env.BASE_URL
  const cleanPath = path.startsWith('/') ? path.slice(1) : path
  return `${base}${cleanPath}`
}
