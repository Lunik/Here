/**
 * Created by lunik on 07/06/2017.
 */

import React from 'react'
import ReactDOM from 'react-dom'
import Notification from './default'

function notify (options) {
  options.title = options.title || 'Title'
  options.content = options.content || 'Content'
  options.timeout = options.timeout || 4000

  var notification = document.createElement('div')

  document.getElementById('notificationContainer').appendChild(notification)
  ReactDOM.render(
    <Notification title={options.title}
      type={options.type}
      timeout={options.timeout}
      onRemove={() => {
        try {
          document.getElementById('notificationContainer').removeChild(notification)
        } catch (e) {

        }
      }}>
      {options.content}
    </Notification>,
        notification)
}

export { notify }
