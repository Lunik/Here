/**
 * Created by lunik on 02/06/2017.
 */

import React from 'react'
import './style.css'
import Button from '../default'
import { ExitIcon, GoogleIcon } from '../../image/svg'

export default class LoginButton extends React.Component {
  constructor (props) {
    super(props)
    this.props = props
    this.state = {
      type: this.props.type,
      text: this.getText(this.props.type),
      provider: this.props.provider
    }
  }
  getText (type) {
    switch (type) {
      case 'logout':
        return 'Sign out'

      case 'session':
      default:
        return 'Sign in'
    }
  }
  getLogo (provider) {
    switch (provider) {
      case 'google':
        return (
          <GoogleIcon />
        )
      default:
        return (
          <ExitIcon />
        )
    }
  }
  render () {
    const logo = this.getLogo(this.state.provider)
    return (
      <Button
        className='login-button'
        type={this.state.type}
        id={this.state.provider}
        onClick={() => this.props.onClick()}>
        <div className='logo'>
          {logo}
        </div>
        <div className='title'>{this.state.text}</div>
      </Button>
    )
  }
}
