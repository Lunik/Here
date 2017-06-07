/**
 * Created by lunik on 06/06/2017.
 */

import SvgIcon from './base'
import React from 'react'

export default class ErrorIcon extends SvgIcon{
    constructor(props){
        super(props)
        this.props = props
        this.set((
            <svg height="18px" viewBox="0 0 16 16" width="18px">
                <g stroke="none" strokeWidth="1">
                    <g transform="translate(-96.000000, -432.000000)">
                        <path d="M103,443 L103,445 L105,445 L105,443 Z M104,448 C99.5817218,448 96,444.418278 96,440 C96,435.581722 99.5817218,432 104,432 C108.418278,432 112,435.581722 112,440 C112,444.418278 108.418278,448 104,448 Z M103,435 L103,442 L105,442 L105,435 Z M103,435" id="Oval 208 copy"/>
                    </g>
                </g>
            </svg>
        ))
    }
}