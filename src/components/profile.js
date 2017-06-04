/**
 * Created by lunik on 01/06/2017.
 */
import React from 'react'
//import QRCode from 'qrcode.react'

import firebaseApp from './firebase/firebaseApp'
import LoginButton from './button/LoginButton'
import FriendList from './list/friendList'

import './css/profile.css'

export default class Profile extends React.Component {
    constructor(props){
        super(props)
        this.props = props
    }
    logout(){
        firebaseApp.auth().signOut()
    }
    //<QRCode value={this.props.user.uid} />
    render(){
        return (
            <div className="profile">
                <img alt="avatar" src={this.props.user.photoURL}/>
                <p>Hi {this.props.user.displayName} !</p>
                <FriendList/>
                <LoginButton
                    type="logout"
                    onClick={() => this.logout()} />
            </div>
        )
    }
}