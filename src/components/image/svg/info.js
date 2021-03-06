/**
 * Created by lunik on 06/06/2017.
 */

import SvgIcon from './base'
import React from 'react'

export default class InfoIcon extends SvgIcon {
  constructor (props) {
    super(props)
    this.props = props
    this.set((
      <svg viewBox='0 0 32 32' height='18px' width='18px' >
        <path d='M16,1A15,15,0,1,0,31,16,15,15,0,0,0,16,1Zm2,22a2,2,0,0,1-4,0V16a2,2,0,0,1,4,0ZM16,12.19A2.19,2.19,0,1,1,18.19,10,2.19,2.19,0,0,1,16,12.19Z' />
      </svg>
        ))
  }
}
