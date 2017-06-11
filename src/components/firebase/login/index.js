/**
 * Created by lunik on 01/06/2017.
 */
import React from 'react'
import firebaseApp from '../app'
import firebase from 'firebase/app'
import 'firebase/auth'
import LoginButton from '../../button/session'
import '../../view/login/style.css'
import { generateID } from '../../../lib/user'

export default class FirebaseLogin extends React.Component {
  constructor (props) {
    super(props)
    this.props = props
    this.state = {
      enable: false
    }

    this.initAuth()
  }
  componentWillUnmount () {
    var database = firebaseApp.database()
    var myUid = firebaseApp.auth().currentUser.uid
    database.ref(`/users/${myUid}`).off()
  }
  initAuth () {
    firebaseApp.auth().onAuthStateChanged((user) => this.setUser(user))
  }
  setUser (user) {
    this.props.setUser(user)
    if (user) {
      this.saveUser(user)
    }
  }
  getUser (uid, cb) {
    var database = firebaseApp.database()
    database.ref(`/users/${uid}`).once('value').then(cb)
  }
  saveUser (user) {
    var database = firebaseApp.database()
    this.getUser(user.uid, (snapshot) => {
      if (!snapshot.val()) {
        database.ref(`/users/${user.uid}`).set({
          metadata: {
            name: user.displayName,
            avatar: user.photoURL,
            id: generateID(user)
          },
          email: user.email,
          phone: user.phoneNumber,
          uid: user.uid
        })
      } else {
        database.ref(`/users/${user.uid}`).update({
          metadata: {
            name: user.displayName,
            avatar: user.photoURL,
            id: generateID(user)
          },
          email: user.email,
          phone: user.phoneNumber,
          uid: user.uid
        })
      }
    })
  }
  authGoogle () {
    if (!firebaseApp.auth().currentUser) {
      var provider = new firebase.auth.GoogleAuthProvider()
      provider.addScope('https://www.googleapis.com/auth/firebase.database')
      provider.addScope('https://www.googleapis.com/auth/userinfo.email')
      firebaseApp.auth().signInWithPopup(provider).then((result) => {
        this.setUser(result.user)
      }).catch(function (error) {
        console.error(error)
      })
    }
  }
  render () {
    return (
      <LoginButton
        type='login'
        provider='google'
        onClick={() => this.authGoogle()} />
    )
  }
}
