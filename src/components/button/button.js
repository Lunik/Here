/**
 * Created by lunik on 04/06/2017.
 */

import React from 'react'

import './css/button.css'

export default class Button extends React.Component{
    constructor(props){
        super(props)
        this.props = props
        this.state = {
            onClick: this.props.onClick || function(){}
        }
    }

    render(){
        var className = `button ${this.props.className}`
        return (
            <div className={className}
                onClick={() => this.state.onClick()}
                id={this.props.id}
                type={this.props.type}>
                {this.props.children}
            </div>
        )
    }
}