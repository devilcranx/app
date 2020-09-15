import React, { useMemo } from 'react'
import cx from 'classnames'
import gql from 'graphql-tag'
import { useQuery } from '@apollo/react-hooks'
import Icon from '@santiment-network/ui/Icon'
import Category, { Button } from './Category'
import styles from './Category.module.scss'

const DEFAULT_SUGGESTIONS = []

const fromDate = new Date()
const toDate = new Date()
fromDate.setHours(0, 0, 0, 0)
toDate.setHours(toDate.getHours() + 1, 0, 0, 0)

const TRENDING_WORDS_QUERY = gql`
  query {
    getTrendingWords(size: 20, from: "${fromDate.toISOString()}", to: "${toDate.toISOString()}") {
      topWords {
        word
      }
    }
  }
`

const TREND_LINK = '/labs/trends/explore/'

const propsAccessor = ({ word, key = word, As }) => ({
  key,
  As,
  to: TREND_LINK + word
})

function trendingWordsPredicate (value) {
  const searchTerm = value.toLowerCase()
  return ({ word }) => word.includes(searchTerm)
}

function useTrendingWords () {
  const { data } = useQuery(TRENDING_WORDS_QUERY)
  return data ? data.getTrendingWords[0].topWords : DEFAULT_SUGGESTIONS
}

const TrendingWord = ({ word }) => word

const Lookup = ({ trend, className }) => (
  <Button to={TREND_LINK + trend} className={cx(className, styles.lookup)}>
    <Icon type='fire' className={styles.icon} />
    Lookup as a trend
  </Button>
)

const buildLookupSuggestion = searchTerm => ({
  key: '__lookup__',
  As: ({ className }) => <Lookup trend={searchTerm} className={className} />
})

const TrendingWordsCategory = ({ searchTerm, ...props }) => {
  const trendingWords = useTrendingWords()
  const suggestions = useMemo(
    () =>
      trendingWords
        .filter(trendingWordsPredicate(searchTerm))
        .concat(buildLookupSuggestion(searchTerm))
        .slice(0, 5),
    [searchTerm, trendingWords]
  )

  return (
    <Category
      {...props}
      title='Trending words'
      items={suggestions}
      Item={TrendingWord}
      propsAccessor={propsAccessor}
    />
  )
}

export default TrendingWordsCategory
