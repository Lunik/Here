/**
 * Created by lunik on 04/06/2017.
 */

import React from 'react'
import Popup from '../default/index'
import Button from '../../button/default'
import Input from '../../input/default'
import HelpButton from '../../button/help'
import firebaseApp from '../../firebase/app'
import { notify } from '../../notification'

import './style.css'

export default class AddFriendPopup extends React.Component{
    constructor(props){
        super(props)
        this.props = props
        this.state = {
            uid: '',
            valid: true,
            onRemove: this.props.onRemove || function(){}
        }
    }
    onRemove(uid){
        this.setState({
            mounted: false
        })
        this.state.onRemove(uid)
    }
    updateUid(uid){
        this.setState({
            uid: uid.replace(/[^0-9^a-z]/g, '')
        })
    }
    isUserExist(uid, cb){
        var database = firebaseApp.database()
        database.ref(`/users/${this.state.uid}/metadata`).once('value').then((snapshot) => cb(snapshot.val() != null))
    }
    areTheyFriends(uid1, uid2, cb){
        var database = firebaseApp.database()
        database.ref(`/users/${uid1}/connections/${uid2}`).once('value').then((snapshot) => {
            if(snapshot.val()){
                database.ref(`/users/${uid2}/connections/${uid1}`).once('value').then((snapshot) => {
                    cb(snapshot.val() !== null)
                })
            } else {
                cb(false)
            }
        })
    }
    sendInvitation(from, to, cb){
        var database = firebaseApp.database()
        database.ref(`/users/${to}/invitations/${from}`).set(true).then(() => {
            database.ref(`/users/${from}/connections/${to}`).set(true).then(cb)
        })
    }
    submit(){
        var valid = this.state.uid !== '' && this.state.uid !== firebaseApp.auth().currentUser.uid
        this.setState({
            valid: valid
        })
        if(valid){
            this.isUserExist(this.state.uid, (exist) => {
                if(exist){
                    this.areTheyFriends(this.state.uid, firebaseApp.auth().currentUser.uid, (friends) => {
                        if(!friends){
                            this.sendInvitation(firebaseApp.auth().currentUser.uid, this.state.uid, () => {
                                notify({
                                    type: 'info',
                                    title: 'Invitation',
                                    content: 'Your invitation have been send.'
                                })
                                console.log('Invitation send')
                                this.onRemove(this.state.uid)
                            })
                        } else {
                            notify({
                                type: 'warning',
                                title: 'Form error',
                                content: 'This user is already your friend.'
                            })
                            console.log(`${this.state.uid} and ${firebaseApp.auth().currentUser.uid} already friends`)
                        }
                    })
                } else {
                    notify({
                        type: 'warning',
                        title: 'Form error',
                        content: 'This user don\'t exist.'
                    })
                    console.log(`${this.state.uid} don't exist`)
                }
            })
        } else {
            notify({
                type: 'warning',
                title: 'Form error',
                content: 'ID is not valid.'
            })
        }
    }
    render(){
        return(
            <Popup onRemove={() => this.onRemove(null)} className="addFriend">
                <h2 className="title">Adding a friend</h2>
                <Input className="friend-id"
                       type="text"
                       name="friend-id"
                       placeholder="Friend id..."
                       valid={this.state.valid}
                       onChange={(e) => this.updateUid(e.target.value)}/>
                <HelpButton>
                    <span>It is located just below your profile picture. Yours is: "{firebaseApp.auth().currentUser.uid}"</span>
                </HelpButton>
                <Button className="submit-button"
                        onClick={() => this.submit()}>
                    <div className="title">Add</div>
                </Button>
            </Popup>
        )
    }
}