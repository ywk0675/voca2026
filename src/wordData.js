// Aggregated word-data API used by App.jsx.
import { BOOK_SERIES, getUnitInfo } from './wordCatalog.js'
import { WW5_WORDS } from './wordDataWw5.js'
import { BEW_WORDS_DB } from './wordDataBew.js'
import { NEW_BOOKS_DB } from './wordDataNew.js'
import { WWP_WORDS_DB } from './wordDataWwp.js'

export { BOOK_SERIES, getUnitInfo }

export function getWordsForUnit(bookId, unitNum) {
  if (bookId === 'ww5') return WW5_WORDS.filter((w) => w.unit === unitNum)
  if (bookId.startsWith('wwp')) return WWP_WORDS_DB[`${bookId}_${unitNum}`] || []
  if (bookId.startsWith('bew')) return BEW_WORDS_DB[`${bookId}_${unitNum}`] || []
  return NEW_BOOKS_DB[`${bookId}_${unitNum}`] || []
}
