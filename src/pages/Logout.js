import React from 'react'
import { connect } from 'react-redux'
import { push } from 'react-router-redux'
import * as actions from './../actions/types'

class LogoutPage extends React.Component {
  static defaultProps = {
    to: '/'
  }

  componentDidMount () {
    this.props.logout()
    setTimeout(() => this.props.redirect(this.props.to), 3000)
  }

  render () {
    return (
      <section className='page'>
        <h1>Goodbuy...</h1>
      </section>
    )
  }
}

const mapDispatchToProps = dispatch => ({
  logout: () => {
    dispatch({
      type: actions.USER_LOGOUT_SUCCESS
    })
  },
  redirect: (path = '/') => {
    dispatch(push(path))
  }
})

export default connect(
  null,
  mapDispatchToProps
)(LogoutPage)
