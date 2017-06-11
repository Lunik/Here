/**
 * Created by lunik on 11/06/2017.
 */

import React from 'react'
import { HeartIcon } from '../../image/svg'

import './style.css'

export default class Poke extends React.Component{
    constructor(props){
        super(props)
        this.props = props
        this.state = {
            position: {
                x: this.props.begin.x || 0,
                y: this.props.begin.y || 0
            },
            onRemove: this.props.onRemove || function(){},
            color: this.props.colors[Math.floor(Math.random() * (this.props.colors.length - 0))],
            physicsInterval: null
        }
    }
    componentDidMount(){
        this.setState({
            physicsInterval: setInterval(()=> this.physics(), 100)
        })
        this.physics()
    }
    componentWillUnmount(){
        clearInterval(this.state.physicsInterval)
    }
    physics(){
        this.setState({
            position: {
                x: this.state.position.x + (Math.random() * (20 - (-20)) - 20),
                y: this.state.position.y - 30
            }
        })

        if(this.state.position.y < 0){
            this.state.onRemove()
        }
    }
    render(){
        return (
            <HeartIcon className="poke" style={{
                fill: this.state.color,
                top: this.state.position.y,
                left: this.state.position.x
            }}/>
        )
    }
}