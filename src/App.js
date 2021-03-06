import React from 'react'
import './App.css'

import firebaseApp from './components/firebase/app'
import { Login, Profile, Friend, Disconnected } from './components/view'
import NotificationContainer from './components/notification/container'

class App extends React.Component {
  constructor (props) {
    super(props)
    this.props = props
    this.state = {
      user: firebaseApp.auth().currentUser,
      hash: window.location.hash.slice(1),
      connected: false
    }
  }
  componentDidMount () {
    window.onhashchange = () => this.updateHash()
    this.updateConnectionStatus()
    this.initNotification()
  }
  componentWillUnmount () {
    window.onhashchange = function () {}
    var database = firebaseApp.database()
    database.ref('.info/connected').off()
  }
  updateConnectionStatus () {
    var database = firebaseApp.database()
    database.ref('.info/connected').on('value', (snap) => {
      this.setState({
        connected: snap.val() || true
      })
    })
  }
  updateHash () {
    this.setState({
      hash: window.location.hash.slice(1)
    })
  }
  setUser (user) {
    this.setState({
      user: user
    })
  }
  initNotification () {
    if ('Notification' in window) {
      if (Notification.permission !== 'granted') {
        Notification.requestPermission((permission) => {
          if (!('permission' in Notification)) {
            Notification.permission = permission
          }
        })
      }
    }
  }
  render () {
    var view
    if (this.state.user) {
      if (this.state.connected) {
        if (this.state.hash) {
          view = (
            <Friend uid={this.state.hash} />
                    )
        } else {
          view = (
            <Profile user={this.state.user} />
                    )
        }
      } else {
        view = (
          <Disconnected />
                )
      }
    } else {
      view = (
        <Login setUser={(user) => this.setUser(user)} />
            )
    }

    return (
      <div className='App'>
        {view}
        <div className='poke-container' />
        <NotificationContainer />
      </div>
    )
  }
}

export default App
