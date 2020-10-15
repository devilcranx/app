import { useState, useMemo } from 'react'
import gql from 'graphql-tag'
import { useQuery } from '@apollo/react-hooks'
import {
  getValidInterval,
  walletMetricBuilder,
  priceMetricBuilder
} from './utils'

export const WALLET_ASSETS_QUERY = gql`
  query assetsHeldByAddress($address: String!) {
    assetsHeldByAddress(address: $address) {
      slug
      balance
    }
  }
`

const DEFAULT_STATE = []

export function getWalletMetrics (walletAssets, priceAssets) {
  const walletMetrics = walletAssets.map(walletMetricBuilder)
  const priceMetrics = priceAssets.map(priceMetricBuilder)
  return walletMetrics.concat(priceMetrics)
}

export const useWalletMetrics = (walletAssets, priceAssets) =>
  useMemo(() => getWalletMetrics(walletAssets, priceAssets), [
    walletAssets,
    priceAssets
  ])

export function useWalletAssets (address) {
  const { data, loading, error } = useQuery(WALLET_ASSETS_QUERY, {
    skip: !address,
    variables: {
      address
    }
  })

  const walletAssets = data ? data.assetsHeldByAddress : DEFAULT_STATE
  return {
    walletAssets,
    isLoading: loading,
    isError: error
  }
}

export function useSettings (defaultSettings) {
  const [settings, setSettings] = useState(defaultSettings)

  function onAddressChange (address) {
    setSettings({
      ...settings,
      address
    })
  }

  function changeTimePeriod (from, to, timeRange) {
    setSettings(state => ({
      ...state,
      timeRange,
      interval: getValidInterval(from, to),
      from: from.toISOString(),
      to: to.toISOString()
    }))
  }

  return {
    settings,
    changeTimePeriod,
    onAddressChange
  }
}