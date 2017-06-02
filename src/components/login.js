/**
 * Created by lunik on 01/06/2017.
 */

import React from 'react'

import Profile from './profile'
import FirebaseLogin from './firebaseLogin'
import firebaseApp from './firebaseApp'

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
