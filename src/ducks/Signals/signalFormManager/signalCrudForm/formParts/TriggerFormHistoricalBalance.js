import React, { useState, useEffect } from 'react'
import { compose } from 'redux'
import { graphql } from 'react-apollo'
import PropTypes from 'prop-types'
import cx from 'classnames'
import FormikLabel from '../../../../../components/formik-santiment-ui/FormikLabel'
import {
  ALL_ERC20_PROJECTS_QUERY,
  allProjectsForSearchGQL
} from '../../../../../pages/Projects/allProjectsGQL'
import { ASSETS_BY_WALLET_QUERY } from '../../../../HistoricalBalance/common/queries'
import { mapAssetsHeldByAddressToProps } from '../../../utils/utils'
import { TriggerProjectsSelector } from './projectsSelector/TriggerProjectsSelector'
import FormikSelect from '../../../../../components/formik-santiment-ui/FormikSelect'
import styles from '../signal/TriggerForm.module.scss'

const isInHeldAssets = (heldAssets, checking) => {
  return checking.every(({ value: chValue, slug: chSlug }) =>
    heldAssets.some(({ slug }) => slug === chSlug || slug === chValue)
  )
}

const isErc20Assets = (target, allErc20Projects) =>
  target.value === 'ethereum' ||
  (Array.isArray(target)
    ? isInHeldAssets(allErc20Projects, target)
    : isInHeldAssets(allErc20Projects, [target]))

const mapAssetsToAllProjects = (all, heldAssets) =>
  heldAssets.reduce((acc, { slug: itemSlug, value: itemValue }) => {
    const foundInAll = all.find(
      ({ slug }) => slug === itemSlug || slug === itemValue
    )
    if (foundInAll) {
      acc.push(foundInAll)
    }
    return acc
  }, [])

const propTypes = {
  metaFormSettings: PropTypes.any,
  values: PropTypes.any.isRequired,
  target: PropTypes.any,
  setFieldValue: PropTypes.func.isRequired,
  byAddress: PropTypes.any,
  assets: PropTypes.array
}

const getFromAll = (allList, { value, slug }) =>
  allList.find(
    ({ slug: currentSlug }) => currentSlug === value || currentSlug === slug
  )

const TriggerFormHistoricalBalance = ({
  data: { allErc20Projects = [], allProjects = [] } = {},
  metaFormSettings: { ethAddress: metaEthAddress, target: metaTarget },
  assets = [],
  setFieldValue,
  values,
  isLoading = false
}) => {
  const { target, ethAddress } = values

  const [erc20List, setErc20] = useState(allErc20Projects)
  const [allList, setAll] = useState(allProjects)
  const [heldAssets, setHeldAssets] = useState(assets)

  const isMulti = target && Array.isArray(target)

  const metaMappedToAll = mapAssetsToAllProjects(
    allList,
    Array.isArray(metaTarget.value) ? metaTarget.value : [metaTarget.value]
  )

  const validateTarget = () => {
    let asset
    if (isMulti && target.length === 1 && !target[0].slug) {
      asset = getFromAll(allList, target[0])
    } else if (!isMulti && target && !target.slug) {
      asset = getFromAll(allList, target)
    }

    asset && setFieldValue('target', ethAddress ? asset : [asset])
  }

  const setAddress = address => setFieldValue('ethAddress', address)

  const validateAddressField = assets => {
    if (erc20List.length && !isErc20Assets(assets, erc20List)) {
      setAddress('')
      return
    }

    if (assets.length > 1) {
      setAddress('')
      return
    }

    if (metaEthAddress && !ethAddress) {
      if (assets.length === 1) {
        if (
          isInHeldAssets(metaMappedToAll, assets) ||
          isInHeldAssets(heldAssets, assets)
        ) {
          setAddress(metaEthAddress)
        } else {
          setAddress('')
        }
      }
    } else if (disabledWalletField) {
      setAddress('')
    }
  }

  useEffect(
    () => {
      allErc20Projects && allErc20Projects.length && setErc20(allErc20Projects)
      allProjects && allProjects.length && setAll(allProjects)
      assets && assets.length && setHeldAssets(assets)
    },
    [allErc20Projects, allProjects, assets]
  )

  useEffect(
    () => {
      validateTarget()
    },
    [target, ethAddress]
  )

  useEffect(
    () => {
      validateAddressField(target)
    },
    [target]
  )

  useEffect(
    () => {
      if (!ethAddress) {
        if (!Array.isArray(target)) {
          setFieldValue('target', [target])
        }
      }
    },
    [ethAddress]
  )

  const disabledWalletField =
    (!ethAddress && (isMulti && target.length > 1)) ||
    (erc20List.length && !isErc20Assets(target, erc20List))

  const selectableProjects =
    ethAddress && !disabledWalletField
      ? mapAssetsToAllProjects(allList, heldAssets)
      : allList

  return (
    <>
      <div className={cx(styles.row, styles.rowTop)}>
        <div className={cx(styles.Field, styles.fieldFilled)}>
          <FormikLabel text='Wallet' />
          <FormikSelect
            disabled={!!disabledWalletField}
            isCreatable
            multi
            name='ethAddress'
            placeholder={
              disabledWalletField
                ? 'Only for single ETH and ERC20 asset'
                : 'Wallet address'
            }
          />
        </div>
      </div>
      <div className={styles.row}>
        <div className={cx(styles.Field, styles.fieldFilled)}>
          {isMulti && (
            <TriggerProjectsSelector
              name='target'
              values={values}
              projects={selectableProjects}
              setFieldValue={setFieldValue}
            />
          )}
          {!isMulti && (
            <FormikSelect
              name='target'
              disalbed={isLoading}
              isLoading={isLoading}
              isClearable={false}
              placeholder='Pick an asset'
              options={selectableProjects}
              valueKey='slug'
              labelKey='slug'
            />
          )}
        </div>
      </div>
    </>
  )
}

const mapDataToProps = ({
  Projects: { allErc20Projects, allProjects, loading },
  ownProps
}) => {
  const { data = {} } = ownProps
  return {
    ...ownProps,
    data: {
      allErc20Projects: allErc20Projects || data.allErc20Projects,
      allProjects: allProjects || data.allProjects
    },
    isLoading: loading
  }
}

const enhance = compose(
  graphql(allProjectsForSearchGQL, {
    name: 'Projects',
    props: mapDataToProps,
    options: () => {
      return {
        errorPolicy: 'all'
      }
    }
  }),
  graphql(ALL_ERC20_PROJECTS_QUERY, {
    name: 'Projects',
    props: mapDataToProps,
    options: () => {
      return {
        errorPolicy: 'all'
      }
    }
  }),
  graphql(ASSETS_BY_WALLET_QUERY, {
    name: 'assetsByWallet',
    props: mapAssetsHeldByAddressToProps,
    skip: ({ byAddress }) =>
      !byAddress || (Array.isArray(byAddress) && byAddress.length > 1),
    options: ({ byAddress }) => {
      return {
        variables: {
          address: Array.isArray(byAddress) ? byAddress[0].value : byAddress
        },
        errorPolicy: 'all'
      }
    }
  })
)

TriggerFormHistoricalBalance.propTypes = propTypes

export default enhance(TriggerFormHistoricalBalance)