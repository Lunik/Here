/**
 * Created by lunik on 01/06/2017.
 */
import React from 'react'

import firebaseApp from './firebaseApp'
import GoogleButton from './button/googleButton'

export default class Profile extends React.Component {
    constructor(props){
        super(props)
        this.props = props
    }
    logout(){
        firebaseApp.auth().signOut()
    }
    render(){
        return (
            <div className="profile">
                <img alt="avatar" src={this.props.user.photoURL}/>
                <p>Bonjour {this.props.user.displayName}</p>

                <GoogleButton
                    type="logout"
                    onClick={() => this.logout()} />
            </div>
        )
    }
}