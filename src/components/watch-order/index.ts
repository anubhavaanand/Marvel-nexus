export { default as WatchOrderClient } from './WatchOrderClient'
export { default as WatchOrderTable } from './WatchOrderTable'
export { default as WatchItemCard } from './WatchItemCard'
// #822: the curated dataset is server-only; client entry points get metadata.
export type { WatchItem } from './meta'
export { phaseColors } from './meta'
