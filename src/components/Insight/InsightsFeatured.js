import React from 'react'
import { graphql } from 'react-apollo'
import InsightCardSmall from './InsightCardSmall'
import { FEATURED_INSIGHTS_QUERY } from './insightsGQL'

const InsightsTrends = ({ data: { insights = [] }, ...props }) => {
  return insights.map(({ id, ...insight }) => (
    <InsightCardSmall
      key={id}
      {...props}
      id={id}
      {...insight}
      withAuthorPic={false}
    />
  ))
}

export default graphql(FEATURED_INSIGHTS_QUERY, {
  fetchPolicy: 'cache-and-network'
})(InsightsTrends)
