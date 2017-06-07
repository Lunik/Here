/**
 * Created by lunik on 04/06/2017.
 */

import React from 'react'
import firebaseApp from '../../firebase/app/index'
import 'firebase/database'
import Spinner from 'react-spinkit'

import './style.css'

export default class Friend extends React.Component{
    constructor(props){
        super(props)
        this.props = props
        this.state = {
            uid: this.props.uid,
            user: null
        }
        this.get(this.state.uid, (user) => {
            this.setState({
                user: user
            })
        })
    }
    get(uid, cb){
        var database = firebaseApp.database()
        database.ref(`/users/${uid}/metadata`).once('value').then((snapshot) => {
            var user = snapshot.val()
            if(user){
                user.uid = uid
                cb(user)
            } else {
                this.returnProfile()
            }
        })
    }
    returnProfile(){
        window.location.hash = ''
    }
    remove(uid){
        var database = firebaseApp.database()
        var myUid = firebaseApp.auth().currentUser.uid

        database.ref(`/users/${myUid}/connections/${uid}`).set(null)
    }
    render(){
        if(this.state.user){
            return (
                <div className="friend-profile">
                    <p>Click to send notification to {this.state.user.name}</p>
                    <img alt="avatar" src={this.state.user.avatar}/>
                </div>
            )
        } else {
            return (
                <div className="friend-profile">
                    <div className="loading">
                        <Spinner
                            fadeIn="none"
                            name="line-scale" />
                    </div>
                </div>

            )
        }
    }
}