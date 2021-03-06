/**
 * Created by lunik on 06/06/2017.
 */

import SvgIcon from './base'
import React from 'react'

export default class ExitIcon extends SvgIcon {
  constructor (props) {
    super(props)
    this.props = props
    this.set((
      <svg height='18px' viewBox='0 0 24 24' width='18px' >
        <g stroke='none' strokeWidth='1'>
          <g transform='translate(-395.000000, -407.000000)'>
            <g transform='translate(215.000000, 119.000000)' />
            <path fill='#757575' d='M396,408 L396,430 L411,430 L411,424 L409,424 L409,428 L398,428 L398,410 L409,410 L409,414 L411,414 L411,408 L396,408 Z M411.636039,415.464466 L413.050253,414.050253 L418,419 L413.050253,423.949747 L411.636039,422.535534 L414.170485,420.001088 L403.000499,420.001088 L403.000499,418.00265 L414.174223,418.00265 L411.636039,415.464466 Z' />
          </g>
        </g>
      </svg>
        ))
  }
}
