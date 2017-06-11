/**
 * Created by lunik on 02/06/2017.
 */
import firebase from 'firebase/app'

const config = {
  apiKey: 'AIzaSyDoUInYUhuZcXLDujbC4gfTFOLOUYMT5P0',
  authDomain: 'here-155c5.firebaseapp.com',
  databaseURL: 'https://here-155c5.firebaseio.com',
  projectId: 'here-155c5',
  storageBucket: 'here-155c5.appspot.com',
  messagingSenderId: '556838730466'
}

export default firebase.initializeApp(config)
