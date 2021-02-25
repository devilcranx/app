import React, { useState, useEffect, useCallback } from 'react'
import Dialog from '@santiment-network/ui/Dialog'
import { useTrackEvents } from '../../../hooks/tracking'
import PageLoader from '../../../components/Loader/PageLoader'
import LoginPopup from '../../../components/banners/feature/PopupBanner'
import {
  NoSignal,
  signalModalTrigger,
  TriggerModalTitle
} from './SignalDialogComponents'
import styles from './SignalMasterModalForm.module.scss'

const SignalDialog = ({
  dialogOpenState,
  setDialogOpenState,
  onCloseMainModal,
  closeDialog,
  dialogTrigger,
  enabled,
  label,
  isError,
  isShared,
  isLoggedIn,
  dialogProps,
  isLoading,
  trigger,
  formChangedCallback,
  canRedirect,
  metaFormSettings,
  buttonParams,
  SignalMaster
}) => {
  const [dialogTitle, onSetDialogTitle] = useState('')
  const [isAnonWarning, setAnonWarning] = useState(false)
  const [openSharedForm, setOpenForm] = useState(isShared)
  const [trackEvent] = useTrackEvents()

  const { variant, border } = buttonParams

  const toggleAnon = useCallback(
    (warn = true) => {
      setAnonWarning(warn)
    },
    [setAnonWarning]
  )

  useEffect(() => toggleAnon(!isLoggedIn), [isLoggedIn])

  useEffect(
    () => {
      if (isLoading) {
        toggleAnon(false)
      }
    },
    [isLoading]
  )

  useEffect(
    () => {
      if (openSharedForm !== isShared) {
        setOpenForm(isShared)
      }
    },
    [isShared]
  )

  useEffect(
    () => {
      openSharedForm && onSetDialogTitle('Alert details')
    },
    [openSharedForm]
  )

  const canOpen = (isLoggedIn || isShared) && !isAnonWarning

  if ((isAnonWarning || !canOpen) && !isLoggedIn) {
    return (
      <LoginPopup>
        {dialogTrigger || signalModalTrigger(enabled, label, variant, border)}
      </LoginPopup>
    )
  }

  return (
    <Dialog
      defaultOpen={dialogOpenState}
      open={dialogOpenState}
      withAnimation={false}
      onOpen={() => {
        // Track opening New signal Dialog
        trackEvent(
          {
            category: 'user',
            action: 'alerts',
            method: 'create_new_alert'
          },
          ['ga', 'intercom', 'sanapi']
        )
        setDialogOpenState(true)
      }}
      onClose={onCloseMainModal}
      trigger={
        dialogTrigger || signalModalTrigger(enabled, label, variant, border)
      }
      title={
        <TriggerModalTitle
          showSharedBtn={isShared && !openSharedForm}
          isError={isError}
          dialogTitle={dialogTitle}
          isLoggedIn={isLoggedIn}
        />
      }
      classes={styles}
      {...dialogProps}
    >
      <Dialog.ScrollContent className={styles.TriggerPanel}>
        {isError && <NoSignal />}

        {!isError && isLoading && <PageLoader className={styles.loading} />}

        {!isError && !isLoading && (
          <>
            {canOpen && (
              <SignalMaster
                setOpenSharedForm={setOpenForm}
                openSharedForm={openSharedForm}
                isShared={isShared}
                trigger={trigger}
                setTitle={onSetDialogTitle}
                onClose={closeDialog}
                canRedirect={canRedirect}
                metaFormSettings={metaFormSettings}
                formChangedCallback={formChangedCallback}
                toggleAnon={toggleAnon}
              />
            )}
          </>
        )}
      </Dialog.ScrollContent>
    </Dialog>
  )
}

export default SignalDialog
