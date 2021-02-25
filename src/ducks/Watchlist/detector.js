export const PROJECT = 'PROJECT'
export const BLOCKCHAIN_ADDRESS = 'BLOCKCHAIN_ADDRESS'
export const SCREENER = 'SCREENER'

const EMPTY_OBJ = {}

export function checkIsScreener (watchlist) {
  const isAllProjectsList = watchlist.slug === 'projects'
  const { name } = watchlist.function || EMPTY_OBJ
  const isScreenerFunction = name === 'selector' || name === 'top_all_projects'

  return !isAllProjectsList && isScreenerFunction
}

export function detectWatchlistType (watchlist) {
  if (watchlist.type === BLOCKCHAIN_ADDRESS) {
    return { type: BLOCKCHAIN_ADDRESS, label: 'watchlist' }
  }

  if (checkIsScreener(watchlist)) {
    return { type: SCREENER, label: 'screener' }
  }

  return { type: PROJECT, label: 'watchlist' }
}
