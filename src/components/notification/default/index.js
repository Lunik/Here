/**
 * Created by lunik on 06/06/2017.
 */

import React from 'react'
import { InfoIcon, WarningIcon, ErrorIcon } from '../../image/svg'

import './style.css'

export default class Notification extends React.Component {
  constructor (props) {
    super(props)
    this.props = props
    this.state = {
      type: this.parseType(this.props.type),
      timeout: this.props.timeout || this.getDefaultTimeout(this.props.type),
      onRemove: this.props.onRemove || function () {}
    }

    if (this.state.timeout) {
      this.timeout = setTimeout(() => this.remove(), this.state.timeout)
    }
  }
  remove () {
    clearTimeout(this.timeout)

    this.setState({
      mounted: false
    })
    this.state.onRemove()
  }
  getDefaultTimeout (type) {
    switch (type) {
      case 'error':
        return null

      case 'warning':
        return 10000

      case 'info':
      default:
        return 5000
    }
  }
  parseType (type) {
    const types = ['info', 'warning', 'error']
    if (types.indexOf(type) !== -1) {
      return type
    } else {
      return types[0]
    }
  }
  getIcon (type) {
    switch (type) {
      case 'error':
        return (<ErrorIcon />)

      case 'warning':
        return (<WarningIcon />)

      case 'info':
      default:
        return (<InfoIcon />)
    }
  }
  render () {
    var className = `notification ${this.props.className}`
    return (
      <div className={className}
        type={this.state.type}
        id={this.props.id} onClick={() => this.remove()}>
        {this.getIcon(this.state.type)}
        <h3 className='title'>{this.props.title}</h3>
        <div className='content'>
          {this.props.children}
        </div>
      </div>
    )
  }
}
