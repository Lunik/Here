/**
 * Created by lunik on 04/06/2017.
 */

import React from 'react'

import './style.css'

import Button from '../default'
import { CrossIcon, TickIcon } from '../../image/svg'

export default class QCMButton extends React.Component{
    constructor(props){
        super(props)
        this.props = props
        this.state = {
            onTrue: this.props.onTrue || function(){},
            onFalse: this.props.onFalse || function(){}
        }
    }
    render(){
        var className = `qcm ${this.props.className}`
        return (
            <div className={className}>
                <Button className="answer" id="false" onClick={() => this.state.onFalse()}>
                    <CrossIcon />
                </Button>
                <Button className="answer" id="true" onClick={() => this.state.onTrue()}>
                    <TickIcon />
                </Button>
            </div>
        )
    }
}