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
import LogoIcon from '../../../../image/logo/logo.png'

import './style.css'

export default class Friend extends React.Component{
    constructor(props){
        super(props)
        this.props = props
        this.state = {
            friend: null,
            mode: 'info',
            status: this.props.status
        }
    }
    componentDidMount(){
        this.get(this.props.uid, (user) => {
            this.setState({
                friend: user
            })
            this.handlePoke()
        })
        this.triggerUpdate()
    }
    triggerUpdate(){
        var database = firebaseApp.database()
        var myUid = firebaseApp.auth().currentUser.uid

        // Trigger accept invitations
        if(this.state.status === 'pending' || this.state.status === 'friend'){
            database.ref(`/users/${this.props.uid}/invitations/${myUid}`).on('value', (snaphot) => {
                var invitationStatus = snaphot.val()
                database.ref(`/users/${this.props.uid}/connections/${myUid}`).once('value').then((snapshot) => {
                    if(snapshot.val()){
                        this.changeStatus('friend')
                    } else if(!invitationStatus && !snapshot.val()){
                        this.props.removeFriend()
                    }
                })
            })
        }
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
            getColors(user.avatar, (colors) => {
                user.colors = colors
                cb(user)
            })
        })
    }
    remove(){
        this.props.removeFriend()
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

        if (response){
            this.changeStatus('friend')
        } else {
            this.props.removeFriend(this.state.friend.uid)
        }
    }
    changeStatus(status){
        const values = ['pending', 'friend', 'invitation']
        if(values.indexOf(status) !== -1){
            this.setState({
                status: status
            })
        }
    }
    handlePoke(){
        var database = firebaseApp.database()
        var myUid = firebaseApp.auth().currentUser.uid

        database.ref(`/users/${myUid}/poke`).on('child_added', (snapshot) => {
            if(snapshot.val().from === this.state.friend.uid){
                this.sendNotification()
                this.pokeAnimation(snapshot.val())
                database.ref(`users/${myUid}/poke/${snapshot.key}`).set(null)
            }
        })
    }
    pokeAnimation(poke){
        const friendDiv = document.querySelector(`li.friend#${poke.from} .avatar`)
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
                                  } catch (e){
                                      return
                                  }
                              }}/>, notification)
    }
    sendNotification(){
        if(Notification.permission === 'granted'){
            try {
                var notification = new Notification("Poke", {
                    body: `${this.state.friend.name} send you a poke. Click here to send one back.`,
                    icon: LogoIcon
                })
                notification.onclick = () => {
                    window.location.hash = `#${this.state.friend.uid}`
                }
            } catch (e){
                navigator.serviceWorker.ready.then(function(registration) {
                    registration.showNotification('Poke', {
                        body: `${this.state.friend.name} send you a poke. Click here to send one back.`,
                        icon: LogoIcon,
                        vibrate: [200, 100, 200, 100, 200, 100, 200]
                    })
                })
            }
        }
    }
    render(){
        if(this.state.friend) {
            if(this.state.mode === 'action'){
                // Action panel
                return (
                    <li className="friend action" id={this.state.friend.uid}>
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
                switch (this.state.status){
                    case 'pending':
                        // Pending friend
                        return (
                            <li className="friend info" id={this.state.friend.uid} type={this.props.status}>
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
                            <li className="friend info" id={this.state.friend.uid} type={this.props.status}>
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
                            <li className="friend info" id={this.state.friend.uid} type={this.state.status} onClick={() => this.showFriend(this.state.friend.uid)}>
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
                <li className="friend" onClick={() => this.showFriend(this.state.friend.uid)}>
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