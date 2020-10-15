import React from 'react'
import { formatNumber, upperCaseFirstLetter } from '../../../utils/formatting'
import ValueChange from '../../ValueChange/ValueChange'

export const columns = [
  {
    id: 'owner',
    Header: 'Exchange',
    accessor: 'owner',
    maxWidth: 160,
    sortable: false,
    Cell: ({ value = '' }) => upperCaseFirstLetter(value)
  },
  {
    id: 'balance',
    Header: 'Balance',
    accessor: 'balance',
    minWidth: 120,
    maxWidth: 150,
    sortable: true,
    Cell: ({ value }) => formatNumber(value)
  },
  {
    id: 'balanceChange1d',
    Header: 'Change, 1d',
    accessor: 'balanceChange1d',
    minWidth: 110,
    maxWidth: 140,
    sortable: true,
    Cell: ({ value }) => <ValueChange render={formatNumber} change={value} />
  },
  {
    id: 'balanceChange7d',
    Header: 'Change, 7d',
    accessor: 'balanceChange7d',
    minWidth: 110,
    maxWidth: 140,
    sortable: true,
    Cell: ({ value }) => <ValueChange render={formatNumber} change={value} />
  },
  {
    id: 'balanceChange30d',
    Header: 'Change, 30d',
    accessor: 'balanceChange30d',
    minWidth: 110,
    maxWidth: 140,
    sortable: true,
    Cell: ({ value }) => <ValueChange render={formatNumber} change={value} />
  },
  {
    id: 'daysSinceFirstTransfer',
    Header: 'Since 1st transfer',
    accessor: 'daysSinceFirstTransfer',
    minWidth: 110,
    maxWidth: 140,
    sortable: true,
    Cell: ({ value = '' }) => `${value} day${value === 1 ? '' : 's'}`
  },
  {
    id: 'datetimeOfFirstTransfer',
    Header: '1st transfer at',
    accessor: 'datetimeOfFirstTransfer',
    minWidth: 110,
    maxWidth: 160,
    sortMethod: (a, b) => (new Date(a) > new Date(b) ? 1 : -1)
  }
]