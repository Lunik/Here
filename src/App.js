import React from 'react'
import './App.css'

import firebaseApp from './components/firebase/app'
import Login from './components/view/login'
import Profile from './components/view/profile'
import Friend from './components/view/friend'
import NotificationContainer from './components/notification/container'

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
        var view
        if(this.state.user) {
            if(this.state.hash){
                view = (
                   <Friend uid={this.state.hash} />
                )
            } else {
                view = (
                    <Profile user={this.state.user}/>
                )
            }
        } else {
            view = (
                <Login setUser={(user) => this.setUser(user)}/>
            )
        }

        return (
            <div className="App">
                {view}
                <NotificationContainer />
            </div>
        )
    }
}

export default App;
