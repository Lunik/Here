/**
 * Created by lunik on 11/06/2017.
 */

import React from 'react'
import ReactDOM from 'react-dom'
import firebaseApp from '../../firebase/app'
import './style.css'
import Poke from '../../image/poke'
import { getColors } from '../../../lib/user'

export default class PokeButton extends React.Component{
    constructor(props){
        super(props)
        this.props = props
        this.state = {
            user: this.props.user,
            timeout: this.props.timeout || 10000,
            lastPoke: (new Date()).getTime() - (this.props.timeout || 10000),
            disabled: false,
            timer: 0
        }
    }
    componentDidMount(){
        var database = firebaseApp.database()
        var myUid = firebaseApp.auth().currentUser.uid

        database.ref(`/users/${myUid}/lastPoke`).once('value', (snapshot) => {
            this.setState({
                lastPoke: snapshot.val() || (new Date()).getTime() - this.state.timeout
            })
        })
    }
    canPoke(){
        return ((new Date()).getTime() - this.state.lastPoke) > this.state.timeout
    }
    updateLastPoke(date){
        var database = firebaseApp.database()
        var myUid = firebaseApp.auth().currentUser.uid

        database.ref(`/users/${myUid}/lastPoke`).set(date)
        this.setState({
            lastPoke: date,
            disabled: true,
            timer: this.state.timeout / 1000
        })

        var interval = setInterval(() => {
            this.setState({
                timer: this.state.timer - 1
            })
        }, 1000)

        setTimeout(() => {
            clearInterval(interval)
            this.setState({
                disabled: false
            })
        }, this.state.timeout)
    }
    sendPoke(){
        if(this.canPoke() && !this.state.disabled) {
            var date = (new Date()).getTime()
            this.updateLastPoke(date)

            var database = firebaseApp.database()
            var myUid = firebaseApp.auth().currentUser.uid

            database.ref(`/users/${this.state.user.uid}/poke`).push({
                from: myUid,
                date: date
            }).then(() => this.sendAnimation())
        } else {
            /*notify({
                type: "warning",
                title: "Spam preventing",
                content: `Wait ${Math.round((this.state.timeout - ((new Date()).getTime() - this.state.lastPoke)) / 1000)}s before sending another poke.`
            })*/
        }
    }
    sendAnimation(){
        const pokeButton = document.querySelector('.poke-button img')
        var notification = document.createElement('div')
        document.getElementById('poke-container').appendChild(notification)
        getColors(this.state.user.avatar, (colors) => {
            ReactDOM.render(<Poke colors={colors}
                                  begin={{
                                      x: pokeButton.x + (Math.random() * (pokeButton.width - 50)),
                                      y: pokeButton.y + (Math.random() * (pokeButton.height - 50))
                                  }}
                                  onRemove={() => {
                                      try {
                                          document.getElementById('poke-container').removeChild(notification)
                                      } catch (e){
                                          return
                                      }
                                  }}/>, notification)
        })
    }
    render(){
        const className = `poke-button ${ this.state.disabled ? 'disabled' : 'enabled'}`
        return (
            <div className={className}>
                <div className="poke-container" id="poke-container"></div>
                <img className="avatar"
                     alt="avatar"
                     src={this.state.user.avatar}
                     onClick={() => this.sendPoke(this.state.user.avatar)}/>
                <p className="timer">Wait {this.state.timer}s</p>
            </div>
        )
    }
}