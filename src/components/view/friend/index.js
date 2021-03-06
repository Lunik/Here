/**
 * Created by lunik on 04/06/2017.
 */

import React from 'react'
import firebaseApp from '../../firebase/app/index'
import 'firebase/database'
import Spinner from 'react-spinkit'
import { notify } from '../../notification'
import PokeButton from '../../button/poke'

import './style.css'

export default class Friend extends React.Component {
  constructor (props) {
    super(props)
    this.props = props
    this.localStorageKey = 'here:friend'
    this.state = {
      uid: this.props.uid,
      user: JSON.parse(localStorage.getItem(`${this.localStorageKey}:${this.props.uid}`))
    }
  }
  componentWillUnmount () {

  }
  componentDidMount () {
    this.isHeFriendWithMe(this.state.uid, (isFriend) => {
      if (!isFriend) {
        notify({
          type: 'error',
          title: 'User failed',
          content: 'This user is not connected to you.'
        })
        this.returnProfile()
      }
    })
    this.get(this.state.uid, (user) => {
      this.setState({
        user: user
      })
      localStorage.setItem(`${this.localStorageKey}:${this.props.uid}`, JSON.stringify(user))
    })
  }
  isHeFriendWithMe (uid, cb) {
    var database = firebaseApp.database()
    var myUid = firebaseApp.auth().currentUser.uid

    database.ref(`/users/${uid}/connections/${myUid}`).once('value').then((snapshot) => {
      cb(snapshot.val() != null)
    })
  }
  get (uid, cb) {
    var database = firebaseApp.database()
    database.ref(`/users/${uid}/metadata`).once('value').then((snapshot) => {
      var user = snapshot.val()
      if (user) {
        user.uid = uid
        cb(user)
      } else {
        this.returnProfile()
      }
    })
  }
  returnProfile () {
    window.location.hash = ''
  }
  remove (uid) {
    var database = firebaseApp.database()
    var myUid = firebaseApp.auth().currentUser.uid

    database.ref(`/users/${myUid}/connections/${uid}`).set(null)
  }
  render () {
    if (this.state.user) {
      return (
        <div className='friend-profile'>
          <p>Click to send notification to {this.state.user.name}</p>
          <PokeButton timeout={1000} user={this.state.user} />
        </div>
      )
    } else {
      return (
        <div className='friend-profile'>
          <div className='loading'>
            <Spinner
              fadeIn='none'
              name='line-scale' />
          </div>
        </div>

      )
    }
  }
}
