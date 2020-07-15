import { useState, useEffect } from 'react'

const DEFAULT_PRESSED_MOFIER = {
  altKey: false,
  shiftKey: false,
  metaKey: false,
  ctrlKey: false,
  // NOTE: cmdKey is the "command" on macOS and the "ctrl" on Windows  [@vanguard | Jul  9, 2020]
  cmdKey: false
}

export function useKeyDown (clb, key) {
  useEffect(() => {
    function onKeyDown (e) {
      if (e.key === key) {
        clb(e)
      }
    }

    window.addEventListener('keydown', onKeyDown)

    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])
}

export function useKeyboardCmdShortcut (key, clb, target = window) {
  useEffect(
    () => {
      function onKeyDown (e) {
        const { ctrlKey, metaKey } = e

        if ((metaKey || ctrlKey) && key === e.key) {
          e.preventDefault()
          clb()
        }
      }

      target.addEventListener('keydown', onKeyDown)

      return () => target.removeEventListener('keydown', onKeyDown)
    },
    [clb, target]
  )
}

export function usePressedModifier () {
  const [pressedModifier, setPressedModifier] = useState(DEFAULT_PRESSED_MOFIER)

  useEffect(() => {
    function onKeyEvent ({ altKey, shiftKey, metaKey, ctrlKey }) {
      setPressedModifier(state =>
        state.altKey === altKey &&
        state.shiftKey === shiftKey &&
        state.metaKey === metaKey &&
        state.ctrlKey === ctrlKey
          ? state
          : {
            altKey,
            shiftKey,
            metaKey,
            ctrlKey,
            cmdKey: metaKey || ctrlKey
          }
      )
    }

    function onBlur () {
      setPressedModifier(DEFAULT_PRESSED_MOFIER)
    }

    window.addEventListener('keydown', onKeyEvent)
    window.addEventListener('keyup', onKeyEvent)
    window.addEventListener('blur', onBlur)

    return () => {
      window.removeEventListener('keydown', onKeyEvent)
      window.removeEventListener('keyup', onKeyEvent)
      window.removeEventListener('blur', onBlur)
    }
  }, [])

  return pressedModifier
}