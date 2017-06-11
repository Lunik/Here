/**
 * Created by lunik on 04/06/2017.
 */

import React from 'react'

import './style.css'

import Button from '../default'
import { PlusIcon } from '../../image/svg'

export default class AddFriendButton extends React.Component {
  constructor (props) {
    super(props)
    this.props = props
  }
  render () {
    return (
      <Button className='add-friend-button' onClick={() => this.props.onClick()}>
        <div className='logo'>
          <PlusIcon />
        </div>
        <div className='title'>Add</div>
      </Button>
    )
  }
}
