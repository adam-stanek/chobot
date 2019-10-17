import { regExpFilter } from './regExpFilter'

/**
 * Default RX filter (allow everything except for [/?#])
 */
export const defaultFilter = regExpFilter(/[^\/\#\?]+/)
