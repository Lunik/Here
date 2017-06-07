/**
 * Created by lunik on 02/06/2017.
 */

import React from 'react'
import firebaseApp from '../../../../firebase/app/index'
import 'firebase/database'
import Spinner from 'react-spinkit'
import { InfoIcon, CrossIcon } from '../../../../image/svg/index'
import QCMButton from '../../../../button/qcm'

import './style.css'

export default class Friend extends React.Component{
    constructor(props){
        super(props)
        this.props = props
        this.state = {
            friend: null,
            mode: 'info'
        }
        this.get(this.props.uid, (user) => {
            this.setState({
                friend: user
            })
        })
    }
    switchMode(mode){
        this.setState({
            mode: mode
        })
    }
    get(uid, cb){
        var database = firebaseApp.database()
        database.ref(`/users/${uid}/metadata`).once('value').then((snapshot) => {
            var user = snapshot.val()
            user.uid = uid
            cb(user)
        })
    }
    remove(uid){
        this.props.removeFriend(uid)
        this.switchMode('info')
    }
    showFriend(uid){
        window.location.hash = `#${uid}`
    }
    invitationResponse(response){
        var database = firebaseApp.database()
        const myUid = firebaseApp.auth().currentUser.uid

        database.ref(`/users/${myUid}/connections/${this.state.friend.uid}`).set(response ? true : null).then(() => {
            database.ref(`/users/${myUid}/invitations/${this.state.friend.uid}`).set(null)
        })

        if (!response){
            this.props.removeFriend(this.state.friend.uid)
        }
    }
    render(){
        if(this.state.friend) {
            if(this.state.mode === 'action'){
                // Action panel
                return (
                    <li className="friend" id="action">
                        <CrossIcon className="switch" id="info" onClick={(e) => {
                            e.stopPropagation()
                            this.switchMode('info')
                        }} />
                        <div className="action" id="remove" onClick={(e) => {
                            e.stopPropagation()
                            this.remove(this.state.friend.uid)
                        }}>
                            <p>Remove</p>
                        </div>
                    </li>
                )
            } else {
                switch (this.props.status){
                    case 'pending':
                        // Pending friend
                        return (
                            <li className="friend" id="info" type={this.props.status}>
                                <InfoIcon className="switch" id="action" onClick={(e) => {
                                    e.stopPropagation()
                                    this.switchMode('action')
                                }} />
                                <img className="avatar" src={this.state.friend.avatar} alt="avatar" />
                                <div className="name">{this.state.friend.name}</div>
                                <div className="pending">Pending...</div>
                            </li>

                        )
                    case 'invitation':
                        // Invitation QCM
                        return (
                            <li className="friend" id="info" type={this.props.status}>
                                <img className="avatar" src={this.state.friend.avatar} alt="avatar" />
                                <div className="name">{this.state.friend.name}</div>
                                <QCMButton onFalse={() => this.invitationResponse(false)}
                                           onTrue={() => this.invitationResponse(true)}/>
                            </li>

                        )
                    case 'friend':
                    default:
                        // default friend
                        return (
                            <li className="friend" id="info" type={this.props.status} onClick={() => this.showFriend(this.state.friend.uid)}>
                                <InfoIcon className="switch" id="action" onClick={(e) => {
                                    e.stopPropagation()
                                    this.switchMode('action')
                                }} />
                                <img className="avatar" src={this.state.friend.avatar} alt="avatar" />
                                <div className="name">{this.state.friend.name}</div>
                            </li>

                        )
                }
            }

        } else {
            // loading
            return (
                <li className="friend" id="info" onClick={() => this.showFriend(this.state.friend.uid)}>
                    <div className="loading">
                        <Spinner
                            fadeIn="none"
                            name="line-scale" />
                    </div>
                </li>
            )
        }
    }
}