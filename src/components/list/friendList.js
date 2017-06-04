/**
 * Created by lunik on 02/06/2017.
 */

import React from 'react'
import FriendItem from './item/friendItem'
import firebaseApp from '../firebase/firebaseApp'
import 'firebase/database'

import './css/friendList.css'

export default class FriendList extends React.Component{
   constructor(props){
       super(props)
       this.props = props
       this.state = {
           friends: []
       }

       this.getFriends((uid) => {
           if(this.state.friends.indexOf(uid) === -1) {
               var friends = this.state.friends.concat([uid])
               this.setState({
                   friends: friends
               })
           }
       })
   }
   removeFriend(uid){
       var database = firebaseApp.database()
       var myUid = firebaseApp.auth().currentUser.uid

       database.ref(`/users/${myUid}/connections/${uid}`).set(null)
       var friends = this.state.friends.concat([])
       delete friends[friends.indexOf(uid)]
       this.setState({
           friends: friends
       })
   }
   isHeFriendWithMe(uid, cb){
       var database = firebaseApp.database()
       var myUid = firebaseApp.auth().currentUser.uid

       database.ref(`/users/${uid}/connections`).once('value').then((snapshot) => {
           var count = 0
           var isFriend = false
           snapshot.forEach((childSnapshot) => {
               if(myUid === childSnapshot.key && childSnapshot.val()){
                   isFriend = true
                   cb(isFriend)
               }
               count++
               if(count === snapshot.numChildren() && !isFriend){
                   cb(isFriend)
               }
           })
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
                           cb(childSnapshot.key)
                       }
                   })
               }
           })
       })
   }

   render(){
       const listItems = this.state.friends.map((uid) => <FriendItem removeFriend={(uid) => this.removeFriend(uid)}
                                                                     uid={uid} />)
       return (
           <div className="friends">
               <h2>Friends</h2>
               <ul>{listItems}</ul>
           </div>
       )
   }
}