/**
 * Created by lunik on 01/06/2017.
 */
import React from 'react'
//import QRCode from 'qrcode.react'
import firebaseApp from '../../firebase/app'
import LoginButton from '../../button/session'
import FriendList from '../../list/friend'
import './style.css'

export default class Profile extends React.Component {
    constructor(props){
        super(props)
        this.props = props
    }
    componentDidMount(){

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
                <p className="id">ID: {this.props.user.uid}</p>
                <FriendList/>
                <LoginButton
                    type="logout"
                    onClick={() => this.logout()} />
            </div>
        )
    }
}