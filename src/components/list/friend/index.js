/**
 * Created by lunik on 02/06/2017.
 */

import React from 'react'
import ReactDOM from 'react-dom'
import FriendItem from './item/friend'
import firebaseApp from '../../firebase/app'
import 'firebase/database'
import AddFriendButton from '../../button/addFriend'
import AddFriendPopup from '../../popup/addFriend'

import './index.css'

export default class FriendList extends React.Component{
   constructor(props){
       super(props)
       this.props = props
       this.state = {
           friends: {},
           addFriendPopup: false
       }

       this.getFriends((friend) => {
           if(!this.state.friends[friend.uid]) {
               var friends = Object.assign({}, this.state.friends)
               friends[friend.uid] = friend.status
               this.setState({
                   friends: friends
               })
           }
       })
   }
    showAddFriend(){
        var notification = document.createElement('div')

        document.getElementById('friends-list').appendChild(notification)
        ReactDOM.render(
            <AddFriendPopup onRemove={() => {
                try {
                    document.getElementById('friends-list').removeChild(notification)
                } catch (e){
                    return
                }
            }}/>,
            notification)
   }
   removeFriend(uid){
       var database = firebaseApp.database()
       var myUid = firebaseApp.auth().currentUser.uid

       database.ref(`/users/${myUid}/connections/${uid}`).set(null)
       var friends = Object.assign({}, this.state.friends)
       delete friends[uid]
       this.setState({
           friends: friends
       })
   }
   isHeFriendWithMe(uid, cb){
       var database = firebaseApp.database()
       var myUid = firebaseApp.auth().currentUser.uid

       database.ref(`/users/${uid}/connections/${myUid}`).once('value').then((snapshot) => {
           cb(snapshot.val() != null)
       })
   }
   getFriends(cb){
       var database = firebaseApp.database()
       var myUid = firebaseApp.auth().currentUser.uid

       // Look my connections
       database.ref(`/users/${myUid}/connections`).once('value').then((snapshot) => {
           snapshot.forEach((childSnapshot) => {
               if(childSnapshot.val()){
                   this.isHeFriendWithMe(childSnapshot.key, (status) => {
                       if(status){
                           cb({
                               uid: childSnapshot.key,
                               status: 'friend'
                           })
                       } else {
                           cb({
                               uid: childSnapshot.key,
                               status: 'pending'
                           })
                       }
                   })
               }
           })
       })
       database.ref(`/users/${myUid}/invitations`).once('value').then((snapshot) => {
           snapshot.forEach((childSnapshot) => {
               if(childSnapshot.val()){
                   cb({
                       uid: childSnapshot.key,
                       status: 'invitation'
                   })
               }
           })
       })
   }
   generateListItems(){
       var listItems = []
       for(let friendId in this.state.friends) {
           let status = this.state.friends[friendId]

           listItems.push((
               <FriendItem uid={friendId} status={status}
                           removeFriend={(uid) => this.removeFriend(uid)}/>
           ))
       }
       return listItems
   }
   render(){
       return (
           <div className="friends" id="friends-list">
               <h2>Friends</h2>
               <ul>{this.generateListItems()}</ul>
               <AddFriendButton onClick={() => this.showAddFriend()}/>
           </div>
       )
   }
}