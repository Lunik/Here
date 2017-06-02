/**
 * Created by lunik on 01/06/2017.
 */
import React from 'react'
import firebaseApp from './firebaseApp'
import firebase from 'firebase/app'
import 'firebase/auth'

import GoogleButton from './button/googleButton'
import './css/login.css'

export default class FirebaseLogin extends React.Component{
    constructor(props){
        super(props)
        this.props = props
        this.state = {
            enable: false
        }

        this.initAuth()
    }
    initAuth(){
        firebaseApp.auth().onAuthStateChanged((user) => this.setUser(user))
    }
    setUser(user){
        this.props.setUser(user)
    }
    authGoogle(){
        if (!firebaseApp.auth().currentUser) {
            var provider = new firebase.auth.GoogleAuthProvider()
            provider.addScope('https://www.googleapis.com/auth/firebase.database')
            provider.addScope('https://www.googleapis.com/auth/userinfo.email')
            firebaseApp.auth().signInWithPopup(provider).then((result) => {

                this.setUser(result.user)
            }).catch(function(error) {
                console.error(error)
            })
        }
    }
    render(){
        return (
            <GoogleButton
                type="login"
                onClick={() => this.authGoogle()} />
        )
    }
}