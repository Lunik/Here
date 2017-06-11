/**
 * Created by lunik on 08/06/2017.
 */

import React from 'react'
import Spinner from 'react-spinkit'

import './style.css'

export default class Disconnected extends React.Component {
  constructor (props) {
    super(props)
    this.props = props
  }
  render () {
    return (
      <div className='disconnected'>
        <h1>Connecting</h1>
        <p>Waiting for internet connection...</p>
        <Spinner fadeIn='none'
          name='line-scale' />
      </div>
    )
  }
}
