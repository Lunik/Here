/**
 * Created by lunik on 01/06/2017.
 */

import React from 'react'

import FirebaseLogin from '../../firebase/login'
import 'firebase/database'

import Logo from '../../image/logo'

export default class Login extends React.Component {
  constructor (props) {
    super(props)
    this.props = props
  }
  render () {
    return (
      <div className='login'>
        <Logo />
        <FirebaseLogin setUser={(user) => this.props.setUser(user)} />
      </div>
    )
  }
}
