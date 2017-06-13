/**
 * Created by lunik on 02/06/2017.
 */

import React from 'react'
import ReactDOM from 'react-dom'
import firebaseApp from '../../../../firebase/app/index'
import 'firebase/database'
import Spinner from 'react-spinkit'
import { InfoIcon, CrossIcon } from '../../../../image/svg/index'
import QCMButton from '../../../../button/qcm'
import Poke from '../../../../image/poke'
import { getColors } from '../../../../../lib/user'

import './style.css'

export default class Friend extends React.Component {
  constructor (props) {
    super(props)
    this.props = props
    this.localStorageKey = 'here:friend'
    this.state = {
      friend: JSON.parse(localStorage.getItem(`${this.localStorageKey}:${this.props.uid}`)) || {},
      mode: 'info',
      status: this.props.status
    }
  }
  componentDidMount () {
    this.get(this.props.uid, (user) => {
      try {
        this.setState({
          friend: user
        })
        localStorage.setItem(`${this.localStorageKey}:${this.props.uid}`, JSON.stringify(user))
        this.handlePoke(this.props.uid)
      } catch (e) {

      }
    })
    this.triggerUpdate()
  }
  componentWillMount () {
    var database = firebaseApp.database()
    var myUid = firebaseApp.auth().currentUser.uid

    database.ref(`/users/${myUid}/poke/${this.props.uid}`).off()
    database.ref(`/users/${this.props.uid}/invitations/${myUid}`).off()
  }
  triggerUpdate () {
    var database = firebaseApp.database()
    var myUid = firebaseApp.auth().currentUser.uid

        // Trigger accept invitations
    if (this.state.status === 'pending' || this.state.status === 'friend') {
      database.ref(`/users/${this.props.uid}/invitations/${myUid}`).on('value', (snaphot) => {
        var invitationStatus = snaphot.val()
        database.ref(`/users/${this.props.uid}/connections/${myUid}`).once('value').then((snapshot) => {
          if (snapshot.val()) {
            this.changeStatus('friend')
          } else if (!invitationStatus && !snapshot.val()) {
            this.props.removeFriend()
          }
        })
      })
    }
  }
  switchMode (mode) {
    this.setState({
      mode: mode
    })
  }
  get (uid, cb) {
    var database = firebaseApp.database()
    database.ref(`/users/${uid}/metadata`).once('value').then((snapshot) => {
      var user = snapshot.val()
      user.uid = uid
      getColors(user.avatar, (colors) => {
        user.colors = colors
        cb(user)
      })
    })
  }
  remove () {
    localStorage.removeItem(`${this.localStorageKey}:${this.props.uid}`)
    this.props.removeFriend()
    this.switchMode('info')
  }
  showFriend (uid) {
    window.location.hash = `#${uid}`
  }
  invitationResponse (response) {
    var database = firebaseApp.database()
    const myUid = firebaseApp.auth().currentUser.uid

    database.ref(`/users/${myUid}/connections/${this.state.friend.uid}`).set(response ? true : null).then(() => {
      database.ref(`/users/${myUid}/invitations/${this.state.friend.uid}`).set(null)
    })

    if (response) {
      this.changeStatus('friend')
    } else {
      this.props.removeFriend(this.state.friend.uid)
    }
  }
  changeStatus (status) {
    const values = ['pending', 'friend', 'invitation']
    if (values.indexOf(status) !== -1) {
      this.setState({
        status: status
      })
      this.props.changeStatus(status)
    }
  }
  handlePoke (uid) {
    var database = firebaseApp.database()
    var myUid = firebaseApp.auth().currentUser.uid

    database.ref(`/users/${myUid}/poke/${uid}`).on('child_added', (snapshot) => {
      this.pokeAnimation()
      setTimeout(() => {
        database.ref(`users/${myUid}/poke/${uid}/${snapshot.key}`).set(null)
      }, 1000)
    })
  }
  pokeAnimation () {
    const friendDiv = document.querySelector(`li.friend#_${this.state.friend.uid} .avatar`)
    if (friendDiv) {
      var notification = document.createElement('div')
      document.querySelector('.poke-container').appendChild(notification)
      ReactDOM.render(<Poke colors={this.state.friend.colors}
        begin={{
          x: friendDiv.x + (Math.random() * (friendDiv.width - 50)),
          y: friendDiv.y + (Math.random() * (friendDiv.height - 50))
        }}
        onRemove={() => {
          try {
            document.querySelector('.poke-container').removeChild(notification)
          } catch (e) {

          }
        }} />, notification)
    }
  }
  render () {
    if (this.state.friend) {
      var id = `_${this.state.friend.uid}`
      if (this.state.mode === 'action') {
                // Action panel
        return (
          <li className='friend action' id={id}>
            <CrossIcon className='switch' id='info' onClick={(e) => {
              e.stopPropagation()
              this.switchMode('info')
            }} />
            <div className='action' id='remove' onClick={(e) => {
              e.stopPropagation()
              this.remove(this.state.friend.uid)
            }}>
              <p>Remove</p>
            </div>
          </li>
        )
      } else {
        switch (this.state.status) {
          case 'pending':
                        // Pending friend
            return (
              <li className='friend info' id={id} type={this.props.status}>
                <InfoIcon className='switch' id='action' onClick={(e) => {
                  e.stopPropagation()
                  this.switchMode('action')
                }} />
                <img className='avatar' src={this.state.friend.avatar} alt='avatar' />
                <div className='name'>{this.state.friend.name}</div>
                <div className='pending'>Pending...</div>
              </li>

            )
          case 'invitation':
                        // Invitation QCM
            return (
              <li className='friend info' id={id} type={this.props.status}>
                <img className='avatar' src={this.state.friend.avatar} alt='avatar' />
                <div className='name'>{this.state.friend.name}</div>
                <QCMButton onFalse={() => this.invitationResponse(false)}
                  onTrue={() => this.invitationResponse(true)} />
              </li>

            )
          case 'friend':
          default:
                        // default friend
            return (
              <li className='friend info' id={id} type={this.state.status} onClick={() => this.showFriend(this.state.friend.uid)}>
                <InfoIcon className='switch' id='action' onClick={(e) => {
                  e.stopPropagation()
                  this.switchMode('action')
                }} />
                <img className='avatar' src={this.state.friend.avatar} alt='avatar' />
                <div className='name'>{this.state.friend.name}</div>
              </li>

            )
        }
      }
    } else {
            // loading
      return (
        <li className='friend' onClick={() => this.showFriend(this.state.friend.uid)}>
          <div className='loading'>
            <Spinner
              fadeIn='none'
              name='line-scale' />
          </div>
        </li>
      )
    }
  }
}
