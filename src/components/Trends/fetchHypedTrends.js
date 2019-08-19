import Raven from 'raven-js'
import { Observable } from 'rxjs'
import gql from 'graphql-tag'
import * as actions from './actions'
import { SOCIALVOLUME_DATA_FETCH } from '../SocialVolumeWidget/actions'
import { getTimeIntervalFromToday } from '../../utils/dates'

const TRENDING_WORDS_QUERY = gql`
  query getTrendingWords($from: DateTime!, $to: DateTime!) {
    getTrendingWords(size: 10, from: $from, to: $to) {
      datetime
      topWords {
        score
        word
      }
    }
  }
`

const handleError = error => {
  Raven.captureException(error)
  return Observable.of({
    type: actions.TRENDS_HYPED_FETCH_FAILED,
    payload: error
  })
}

const secretDataTeamHours = [1, 8, 14]

export const selectHypedTrend = action$ =>
  action$
    .ofType(actions.TRENDS_HYPED_WORD_SELECTED)
    .switchMap(({ payload }) => {
      return payload
        ? Observable.from([
          {
            type: SOCIALVOLUME_DATA_FETCH,
            payload
          }
        ])
        : Observable.empty()
    })

const fetchTrends$ = ({ client, data = {} }) => {
  const { from, to } = getTimeIntervalFromToday(-2, 'd')

  const queries = secretDataTeamHours.map(hour => {
    from.setHours(hour, 0, 0)
    return client.query({
      query: TRENDING_WORDS_QUERY,
      variables: {
        to: to.toISOString(),
        from: from.toISOString()
      },
      context: { isRetriable: true }
    })
  })

  return Observable.forkJoin(queries)
    .mergeMap(data => {
      const trends = data
        .reduce((acc, val, index) => {
          const { data = [] } = val
          data.trendingWords.forEach(el => {
            const date = new Date(el.datetime)
            date.setHours(date.getHours() + secretDataTeamHours[index])

            acc.push({
              ...el,
              datetime: date.toISOString()
            })
          })
          return acc
        }, [])
        .sort((a, b) => (new Date(a.datetime) > new Date(b.datetime) ? 1 : -1))
        .reverse()
        .filter((_, index) => index < 3)
        .reverse()
      return Observable.of({
        type: actions.TRENDS_HYPED_FETCH_SUCCESS,
        payload: {
          items: trends,
          isLoading: false,
          error: false
        }
      })
    })
    .catch(handleError)
}

export const fetchHypedTrends = (action$, store, { client }) =>
  action$.ofType(actions.TRENDS_HYPED_FETCH).mergeMap(({ data = {} }) => {
    return Observable.merge(
      Observable.of({
        type: actions.TRENDS_HYPED_FETCH_TICKERS_SLUGS,
        payload: {
          check: 'check'
        }
      }),
      fetchTrends$({ data, client })
    )
  })
