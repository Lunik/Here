/**
 * Created by lunik on 02/06/2017.
 */

import React from 'react'
import './css/LoginButton.css'
import Button from './button'

export default class LoginButton extends React.Component{
    constructor(props){
        super(props)
        this.props = props
        this.state = {
            type: this.props.type,
            text: this.getText(this.props.type),
            provider: this.props.provider
        }
    }
    getText(type){
        switch (type){
            case 'logout':
                return "Sign out"

            case 'login':
            default:
                return "Sign in"
        }
    }
    getLogo(provider){
        switch (provider){
            case 'google':
                return (
                    <svg width="18px" height="18px" viewBox="0 0 48 48">
                        <g>
                            <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
                            <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
                            <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
                            <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
                            <path fill="none" d="M0 0h48v48H0z"></path>
                        </g>
                    </svg>
                )
            default:
                return (
                    <svg height="18px" viewBox="0 0 24 24" width="18px" >
                        <g fill="none" stroke="none" strokeWidth="1">
                            <g transform="translate(-395.000000, -407.000000)">
                                <g transform="translate(215.000000, 119.000000)"/>
                                    <path fill="#757575" d="M396,408 L396,430 L411,430 L411,424 L409,424 L409,428 L398,428 L398,410 L409,410 L409,414 L411,414 L411,408 L396,408 Z M411.636039,415.464466 L413.050253,414.050253 L418,419 L413.050253,423.949747 L411.636039,422.535534 L414.170485,420.001088 L403.000499,420.001088 L403.000499,418.00265 L414.174223,418.00265 L411.636039,415.464466 Z" />
                            </g>
                        </g>
                    </svg>
                )
        }
    }
    render(){
        const logo = this.getLogo(this.state.provider)
        return (
            <Button
                className='login-button'
                type={this.state.type}
                id={this.state.provider}
                onClick={() => this.props.onClick()}>
                <div className="logo">
                    {logo}
                </div>
                <div className="title">{this.state.text}</div>
            </Button>
        )
    }
}