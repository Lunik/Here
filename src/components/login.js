/**
 * Created by lunik on 01/06/2017.
 */

import React from 'react'

import Profile from './profile'
import FirebaseLogin from './firebaseLogin'
import firebaseApp from './firebaseApp'
import 'firebase/database'

export default class Login extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            profile: firebaseApp.auth().currentUser
        }
    }
    setUser(user){
        this.setState({
            profile: user,
        })
        this.saveUser(user)
    }
    getUser(uid, cb){
        var database = firebaseApp.database()
        database.ref(`/users/${uid}`).once('value').then(cb)
    }
    saveUser(user){
        var database = firebaseApp.database()
        this.getUser(user.uid, (data) => {
            if(!data.val()){
                database.ref(`/users/${user.uid}`).set({
                    name: user.displayName,
                    email: user.email,
                    avatar: user.photoURL,
                    phone: user.phoneNumber,
                    uid: user.uid
                })
            } else {
                database.ref(`/users/${user.uid}`).update({
                    name: user.displayName,
                    email: user.email,
                    avatar: user.photoURL,
                    phone: user.phoneNumber,
                    uid: user.uid
                })
            }
        })
    }
    render(){
        if(this.state.profile){
            return (
                <Profile user={this.state.profile} />
            )
        } else {
            return (
                <FirebaseLogin setUser={(user) => this.setUser(user)}/>
            )
        }
    }
}
