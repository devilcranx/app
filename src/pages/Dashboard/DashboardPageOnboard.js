import React from 'react'
import cx from 'classnames'
import { connect } from 'react-redux'
import Link from 'react-router-dom/es/Link'
import { Label, Panel, Icon, Button } from '@santiment-network/ui'
import { getOnboardingCompletedTasks } from './utils'
import NewWatchlistDialog from '../../components/Watchlists/NewWatchlistDialog'
import Image from './hand.svg'
import styles from './DashboardPageOnboard.module.scss'

const useShown = () => {
  const [state, setState] = React.useState(
    !localStorage.getItem('isOnboardingHidden')
  )
  if (!state) {
    localStorage.setItem('isOnboardingHidden', '+')
  }

  return [state, () => setState(false)]
}

const Task = ({ title, text, icon, iconClassName, isCompleted }) => (
  <Panel className={cx(styles.task, !isCompleted && styles.selectable)}>
    <div className={styles.task__icon}>
      <Icon type={icon} className={iconClassName} />
    </div>
    <div className={styles.task__title}>{title}</div>
    <div className={styles.task__text}>{text}</div>
    <div
      className={cx(
        styles.task__state,
        isCompleted && styles.task__state_completed
      )}
    >
      <Icon type='checkmark' />
    </div>
  </Panel>
)

const DashboardPageOnboard = ({ hasMetamask }) => {
  const [isShown, setShown] = useShown()
  const completedTasks = getOnboardingCompletedTasks()
  return (
    isShown && (
      <Panel className={styles.wrapper}>
        <Label onClick={setShown} className={styles.skip} accent='casper'>
          Skip for now
        </Label>
        <div className={styles.top}>
          <img
            src={Image}
            alt='hello icon'
            width='60'
            height='60'
            className={styles.hand}
          />
          <div className={styles.text}>
            <div className={styles.title}>Great to have you on board!</div>
            <div className={styles.subtitle}>
              You are on your way to better crypto analysis
            </div>
          </div>
        </div>
        <div className={styles.tasks}>
          <NewWatchlistDialog
            trigger={
              <Button
                className={cx(styles.button, styles.default)}
                disabled={completedTasks.includes('watchlist')}
              >
                <Task
                  icon='eye'
                  title='Create your first watchlist'
                  text='You can track your selected assets in one place and check it’s status'
                  isCompleted={completedTasks.includes('watchlist')}
                />
              </Button>
            }
            watchlists={[]}
          />
          <Link to={hasMetamask ? '' : '/account'} className={styles.default}>
            <Task
              icon='connection'
              title='Connect Metamask'
              text='By connecting the Metamask you will be able to deposit SAN tokens to your account'
              iconClassName={styles.icon_connection}
              isCompleted={hasMetamask}
            />
          </Link>
        </div>
      </Panel>
    )
  )
}

const mapStateToProps = ({
  user: {
    data: { ethAccounts = [] }
  }
}) => ({
  hasMetamask: ethAccounts.length > 0 && ethAccounts[0].address
})

export default connect(mapStateToProps)(DashboardPageOnboard)
