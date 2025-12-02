export const LOCATIONS = [
  { value: 'Zoom Online', label: 'Zoom Online（オンライン）' },
  { value: 'Kawasaki', label: 'Kawasaki（川崎）' },
  { value: 'Kumamoto', label: 'Kumamoto（熊本）' },
  { value: 'Kobe', label: 'Kobe（神戸）' },
  { value: 'Noto', label: 'Noto（能登）' },
  { value: 'Hakui', label: 'Hakui（羽咋）' },
] as const

export type LocationValue = typeof LOCATIONS[number]['value']

export function getLocationLabel(value: string): string {
  const location = LOCATIONS.find(loc => loc.value === value)
  return location?.label || value
}

