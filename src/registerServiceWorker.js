// In production, we register a service worker to serve assets from local cache.

// This lets the app load faster on subsequent visits in production, and gives
// it offline capabilities. However, it also means that developers (and users)
// will only see deployed updates on the "N+1" visit to a page, since previously
// cached resources are updated in the background.

// To learn more about the benefits of this model, read https://goo.gl/KwvDNy.
// This link also includes instructions on opting out of this behavior.
import firebaseApp from './components/firebase/app'
import 'firebase/auth'
import LogoIcon from './components/image/logo/logo.png'

export default function register () {
  if (/* process.env.NODE_ENV === 'production' && */'serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      const swUrl = `${process.env.PUBLIC_URL}/service-worker.js`
      console.log(swUrl)
      navigator.serviceWorker
        .register(swUrl)
        .then(registration => {
          // Setup notifications on poke
          const database = firebaseApp.database()
          firebaseApp.auth().onAuthStateChanged((user) => {
            database.ref(`/users/${user.uid}/poke/`).on('value', (friendsSnapshot) => {
              var friends = friendsSnapshot.val()
              if (friends === null) {
                return
              }
              Object.keys(friends).map((friendUid) => {
                var friendPoke = friends[friendUid]

                Object.keys(friendPoke).map((pokeId) => {
                  var name = friendPoke[pokeId]
                  sendPokeNotification({
                    name: name,
                    uid: friendUid
                  })
                  return 0
                })

                return 0
              })
            })
          })

          registration.onupdatefound = () => {
            const installingWorker = registration.installing
            installingWorker.onstatechange = () => {
              if (installingWorker.state === 'installed') {
                if (navigator.serviceWorker.controller) {
                  // At this point, the old content will have been purged and
                  // the fresh content will have been added to the cache.
                  // It's the perfect time to display a "New content is
                  // available; please refresh." message in your web app.
                  console.log('New content is available; please refresh.')
                } else {
                  // At this point, everything has been precached.
                  // It's the perfect time to display a
                  // "Content is cached for offline use." message.
                  console.log('Content is cached for offline use.')
                }
              }
            }
          }
        })
        .catch(error => {
          console.error('Error during service worker registration:', error)
        })
    })
  }
}

function sendPokeNotification (friend) {
  if (Notification.permission === 'granted') {
    navigator.serviceWorker.ready.then((registration) => {
      registration.getNotifications({tag: `poke_${friend.uid}`}).then((notifications) => {
        let count = 1
        if (notifications.length > 0) {
          count += notifications[0].data.count
        }
        registration.showNotification('Poke', {
          body: `${friend.name} send you ${count} poke.`,
          tag: `poke_${friend.uid}`,
          badge: LogoIcon,
          data: {
            count: count
          },
          icon: LogoIcon//,
          //vibrate: [200, 100, 200, 100, 200, 100, 200]
        })
      })
    })
  }
}

export function unregister () {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready.then(registration => {
      registration.unregister()
    })
  }
}
