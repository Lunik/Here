/**
 * Created by lunik on 02/06/2017.
 */

import React from 'react'

import LogoImg from './logo.png'
import './style.css'

export default class Logo extends React.Component {
  constructor (props) {
    super(props)
    this.props = props
  }

  render () {
    return (
      <div className='logo' id='main'>
        <img src={LogoImg} alt='logo' />
        <h1 className='title'>Here</h1>
      </div>
    )
  }
}
