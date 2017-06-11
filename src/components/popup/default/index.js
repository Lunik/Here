/**
 * Created by lunik on 04/06/2017.
 */

import React from 'react'
import { CrossIcon } from '../../image/svg'

import './style.css'

export default class Popup extends React.Component {
  constructor (props) {
    super(props)
    this.props = props
    this.state = {
      onRemove: this.props.onRemove || function () {}
    }
  }
  render () {
    var className = `popup ${this.props.className}`
    return (
      <div className={className}>
        <div className='shadow'>
          <div className='container'>
            <CrossIcon className='close-popup' onClick={(e) => {
              e.stopPropagation()
              this.state.onRemove()
            }} />
            {this.props.children}
          </div>
        </div>
      </div>
    )
  }
}
