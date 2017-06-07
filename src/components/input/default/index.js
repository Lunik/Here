/**
 * Created by lunik on 04/06/2017.
 */

import React from 'react'

import './style.css'

export default class Input extends React.Component{
    constructor(props){
        super(props)
        this.props = props
        this.state = {
            value: this.props.value,
            onChange: this.props.onChange || function(){}
        }
    }
    render(){
        var className = `input ${this.props.className} ${this.props.valid ? '' : 'invalid'}`
        return (
            <input id={this.props.id}
                   className={className}
                   type={this.props.type}
                   name={this.props.name}
                   placeholder={this.props.placeholder}
                   value={this.state.value}
                   onChange={(e) => this.state.onChange(e)}/>
        )
    }
}