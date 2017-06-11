/**
 * Created by lunik on 04/06/2017.
 */

import React from 'react'

import './style.css'

export default class HelpButton extends React.Component {
  constructor (props) {
    super(props)
    this.props = props
    this.state = {
      help: null
    }
  }
  showHelp () {
    this.setState({
      help: true
    })
  }
  hideHelp () {
    this.setState({
      help: false
    })
  }
  getHelp () {
    if (this.state.help) {
      return (
        <p className='text'>
          {this.props.children}
        </p>
      )
    } else {
      return null
    }
  }
  render () {
    return (
      <span className='help'
        onMouseOver={() => this.showHelp()}
        onMouseLeave={() => this.hideHelp()}
        onTouchStart={() => this.showHelp()}
        onTouchEnd={() => this.hideHelp()}>
        <p className='button'>?</p>
        {this.getHelp()}
      </span>
    )
  }
}
