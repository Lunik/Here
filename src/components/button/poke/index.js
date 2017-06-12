/**
 * Created by lunik on 11/06/2017.
 */

import React from 'react'
import ReactDOM from 'react-dom'
import firebaseApp from '../../firebase/app'
import './style.css'
import Poke from '../../image/poke'
import { getColors } from '../../../lib/user'

export default class PokeButton extends React.Component {
  constructor (props) {
    super(props)
    this.props = props
    this.state = {
      user: this.props.user,
      timeout: this.props.timeout || 10000,
      lastPoke: (new Date()).getTime() - (this.props.timeout || 10000),
      disabled: true,
      timer: 0,
      colors: ['#ed588d'],
      timerInterval: null,
      remainTimeout: null
    }
  }
  componentDidMount () {
    var database = firebaseApp.database()
    var myUid = firebaseApp.auth().currentUser.uid

    database.ref(`/users/${myUid}/lastPoke`).once('value', (snapshot) => {
      this.updateLastPoke(snapshot.val() || (new Date()).getTime() - this.state.timeout)
    })

    getColors(this.state.user.avatar, (colors) => {
      this.setState({
        colors: colors
      })
    })
  }
  componentWillUnmount () {
    clearInterval(this.state.timerInterval)
    clearTimeout(this.state.remainTimeout)
  }
  canPoke () {
    return ((new Date()).getTime() - this.state.lastPoke) > this.state.timeout
  }
  updateLastPoke (date) {
    var database = firebaseApp.database()
    var myUid = firebaseApp.auth().currentUser.uid

    database.ref(`/users/${myUid}/lastPoke`).set(date)

    var remainingTime = Math.round(this.state.timeout - ((new Date()).getTime() - date))
    this.setState({
      lastPoke: date,
      disabled: true,
      timer: Math.round(remainingTime / 1000)
    })

    var timerInterval = setInterval(() => {
      try {
        this.setState({
          timer: this.state.timer - 1
        })
      } catch (e) {
        clearInterval(timerInterval)
      }
    }, 1000)
    var timeoutInterval = setTimeout(() => {
      clearInterval(this.state.timerInterval)
      this.setState({
        disabled: false
      })
    }, remainingTime)

    this.setState({
      timerInterval: timerInterval,
      remainTimeout: timeoutInterval
    })
  }
  sendPoke () {
    if (this.canPoke() && !this.state.disabled) {
      var date = (new Date()).getTime()
      this.updateLastPoke(date)

      var database = firebaseApp.database()
      var myUid = firebaseApp.auth().currentUser.uid

      database.ref(`/users/${this.state.user.uid}/poke`).push({
        from: myUid,
        date: date
      }).then(() => this.sendAnimation())
    } else {
            /* notify({
                type: "warning",
                title: "Spam preventing",
                content: `Wait ${Math.round((this.state.timeout - ((new Date()).getTime() - this.state.lastPoke)) / 1000)}s before sending another poke.`
            }) */
    }
  }
  sendAnimation () {
    const pokeButton = document.querySelector('.poke-button img')
    var notification = document.createElement('div')
    document.querySelector('.poke-container').appendChild(notification)
    ReactDOM.render(<Poke colors={this.state.colors}
      begin={{
        x: pokeButton.x + (Math.random() * (pokeButton.width - 50)),
        y: pokeButton.y + (Math.random() * (pokeButton.height - 50))
      }}
      onRemove={() => {
        try {
          document.querySelector('.poke-container').removeChild(notification)
        } catch (e) {

        }
      }} />, notification)
  }
  render () {
    const className = `poke-button ${this.state.disabled ? 'disabled' : 'enabled'}`
    return (
      <div className={className}>
        <img className='avatar'
          alt='avatar'
          src={this.state.user.avatar}
          onClick={() => this.sendPoke(this.state.user.avatar)} />
        <p className='timer'>Wait {this.state.timer}s</p>
      </div>
    )
  }
}
