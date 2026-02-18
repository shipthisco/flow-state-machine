/**
 * Shared constants for the workflow editor.
 * Change SHEET_SIDE to control the direction all sheets open from.
 */

/** Direction sheets open from: 'bottom' | 'right' | 'left' | 'top' */
export const SHEET_SIDE = 'right'

/** Base width for right-side sheets (vw) */
export const SHEET_BASE_WIDTH = 50

/** Width step increase per nesting level (vw) — nested sheets get narrower */
export const SHEET_NESTING_STEP = 5

/** Minimum sheet width (vw) */
export const SHEET_MIN_WIDTH = 30
