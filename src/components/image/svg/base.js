/**
 * Created by lunik on 06/06/2017.
 */

import React from 'react'

export default class SvgIcon extends React.Component{
    constructor(props) {
        super(props)
        this.props = props
        this.state = {
            onClick: this.props.onClick || function(){}
        }
    }
    set(svg){
        this.state.svg = svg
    }
    render(){
        var className = `icon ${this.props.className}`
        return (
            <span className={className} onClick={(e) => this.state.onClick(e)}>
                {this.state.svg}
            </span>
        )
    }
}