import getFirebase from './../../../firebaseProvider';
import { push } from 'react-router-redux';

const firebase = getFirebase();
const firebaseAuth = firebase.auth();
// ------------------------------------
// Constants
// ------------------------------------
export const START_AUTHENTICATE = 'login/START_AUTHENTICATE';
export const CLEAR_ERROR_MESSAGE = 'login/CLEAR_ERROR_MESSAGE';
export const AUTHENTICATE_FAILED = 'login/AUTHENTICATE_FAILED';
export const AUTHENTICATE_SUCCESS = 'login/AUTHENTICATE_SUCCESS';

// ------------------------------------
// Actions
// ------------------------------------
export function authenticate (email, password) {
    return (dispatch, getState) => new Promise(resolve => {
        dispatch(startAuthenticate());

        firebaseAuth.signInWithEmailAndPassword(email, password)
            .then(userData => {
                dispatch(authenticationSuccess(userData.uid));
                resolve();
            })
            .catch(error => {
                dispatch(authenticationFailed(error.message));
                resolve();
            });
    });
}

export function clearErrorMessage() {
    return {
        type: CLEAR_ERROR_MESSAGE
    }
}

export function startAuthenticate() {
    return {
        type: START_AUTHENTICATE
    }
}

export function authenticationFailed(fb_message) {
    return {
        type: AUTHENTICATE_FAILED,
        message: fb_message
    }
}

export function authenticationSuccess(userToken) {
    return {
        type: AUTHENTICATE_SUCCESS,
        userToken
    }
}

export const actions = {
    authenticate,
    startAuthenticate,
    authenticationFailed,
    authenticationSuccess
}

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
    [START_AUTHENTICATE]: (state, action) => Object.assign({}, state, { authInProgress: true }),
    [AUTHENTICATE_SUCCESS]: (state, action) => Object.assign({}, state, {
        authInProgress: false,
        userToken: action.userToken
    }),
    [AUTHENTICATE_FAILED]: (state, action) => Object.assign({}, state, {
        authInProgress: false,
        userToken: null,
        errorMessage: action.message
    }),
    [CLEAR_ERROR_MESSAGE]: (state, action) => Object.assign({}, state, {
        errorMessage: null
    })
}

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = {
    authInProgress: false,
    userToken: firebaseAuth.currentUser ? firebaseAuth.currentUser.uid : null,
    errorMessage: null
};

export default function loginReducer (state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]

  return handler ? handler(state, action) : state
}
