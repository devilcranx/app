import React from 'react'
import { Link } from 'react-router-dom'
import Button from '@santiment-network/ui/Button'
import styles from './SignalAnon.module.scss'

const SignalAnon = () => (
  <div className={styles.wrapper}>
    <p>Please, log in to use this feature</p>
    <Button
      variant='fill'
      accent='positive'
      fluid
      as={Link}
      to='/login'
      className={styles.btn}
    >
      Login
    </Button>
  </div>
)

export default SignalAnon
