/**
 * Created by lunik on 02/06/2017.
 */

import React from 'react'
import firebaseApp from '../../firebase/firebaseApp'
import 'firebase/database'
import Spinner from 'react-spinkit'

import './css/friendItem.css'

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
    render(){
        if(this.state.friend) {
            if(this.state.mode === 'action'){
                return (
                    <li className="friend" id="action">
                        <svg className="switch" id="info" onClick={() => this.switchMode('info')} height="18px" viewBox="0 0 24 24" width="18px">
                            <path d="M22.245,4.015c0.313,0.313,0.313,0.826,0,1.139l-6.276,6.27c-0.313,0.312-0.313,0.826,0,1.14l6.273,6.272  c0.313,0.313,0.313,0.826,0,1.14l-2.285,2.277c-0.314,0.312-0.828,0.312-1.142,0l-6.271-6.271c-0.313-0.313-0.828-0.313-1.141,0  l-6.276,6.267c-0.313,0.313-0.828,0.313-1.141,0l-2.282-2.28c-0.313-0.313-0.313-0.826,0-1.14l6.278-6.269  c0.313-0.312,0.313-0.826,0-1.14L1.709,5.147c-0.314-0.313-0.314-0.827,0-1.14l2.284-2.278C4.308,1.417,4.821,1.417,5.135,1.73  L11.405,8c0.314,0.314,0.828,0.314,1.141,0.001l6.276-6.267c0.312-0.312,0.826-0.312,1.141,0L22.245,4.015z"/>
                        </svg>
                        <div className="action" id="remove" onClick={() => this.remove(this.state.friend.uid)}>
                            <p>Remove</p>
                        </div>
                    </li>
                )
            } else {
                return (
                    <li className="friend" id="info" onClick={() => this.showFriend(this.state.friend.uid)}>
                        <img className="avatar" src={this.state.friend.avatar} alt="avatar" />
                        <div className="name">{this.state.friend.name}</div>
                        <svg className="switch" id="action" onClick={() => this.switchMode('action')} viewBox="0 0 32 32" height="18px" width="18px">
                            <path d="M16,1A15,15,0,1,0,31,16,15,15,0,0,0,16,1Zm2,22a2,2,0,0,1-4,0V16a2,2,0,0,1,4,0ZM16,12.19A2.19,2.19,0,1,1,18.19,10,2.19,2.19,0,0,1,16,12.19Z"/>
                        </svg>
                    </li>

                )
            }

        } else {
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