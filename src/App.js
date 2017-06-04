import React from 'react'
import './App.css'

import firebaseApp from './components/firebase/firebaseApp'
import Login from './components/login'
import Profile from './components/profile'
import Friend from './components/friend'

class App extends React.Component {
    constructor(props) {
        super(props)
        this.props = props
        this.state = {
            user: firebaseApp.auth().currentUser,
            hash: window.location.hash.slice(1)
        }

        window.onhashchange = () => this.updateHash()
    }
    updateHash(){
        this.setState({
            hash: window.location.hash.slice(1)
        })
    }
    setUser(user){
        this.setState({
            user: user,
        })
    }
    render() {
        if(this.state.user) {
            if(this.state.hash){
                return (
                   <Friend uid={this.state.hash} />
                )
            } else {
                return (
                    <Profile user={this.state.user}/>
                )
            }
        } else {
            return (
                <Login setUser={(user) => this.setUser(user)}/>
            )
        }
    }
}

export default App;
