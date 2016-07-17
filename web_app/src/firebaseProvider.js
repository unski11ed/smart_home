import Firebase from 'firebase';
import config from './../config/firebase';

let firebaseObject;

export default () => {
    if (!firebaseObject) {
        firebaseObject = Firebase.initializeApp(config);
    }
    return firebaseObject;
}
