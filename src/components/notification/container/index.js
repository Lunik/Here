/**
 * Created by lunik on 06/06/2017.
 */


import React from 'react'

import './style.css'

export default class NotificationContainer extends React.Component{
    constructor(props){
        super(props)
        this.props = props

        this.state = {
            position: this.parsePostion(this.props.position)
        }
    }
    parsePostion(position){
        const positions = ['topRight', 'topLeft', 'bottomLeft', 'bottomRight']
        if(positions.indexOf(position) !== -1){
            return position
        } else {
            return positions[0]
        }
    }
    render(){
        var className = `notificationContainer ${this.state.position} ${this.props.className}`
        return(
            <div className={className} id="notificationContainer">
                {this.props.children}
            </div>
        )
    }
}