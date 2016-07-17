import getFirebase from './../../../firebaseProvider';
import _ from 'underscore';

const firebase = getFirebase();
// ------------------------------------
// Constants
// ------------------------------------
export const START_LISTENING = 'temps/START_LISTENING';
export const TEMP_RECEIVED = 'temps/TEMP_RECEIVED';
export const SET_INITIAL_TEMPS = 'temps/SET_INITIAL_TEMPS';

// ------------------------------------
// Actions
// ------------------------------------
export function startListening () {
    return (dispatch, getState) => {
        firebase.database().ref('temperatures').on('child_changed', snapshot => {
            dispatch(tempReceived(snapshot.key, snapshot.val()));
        });

        firebase.database().ref('temperatures').once('value').then(snapshot => {
            const temps = snapshot.val();
            const tempsArray = _.values(temps);
            dispatch(setInitialTemps(tempsArray));
        });
    };
}

export function tempReceived(tempKey, tempVal) {
    return {
        type: TEMP_RECEIVED,
        tempKey,
        tempVal
    };
}

export function setInitialTemps(temps) {
    return {
        type: SET_INITIAL_TEMPS,
        temps
    }
}

export const actions = {
    startListening,
    tempReceived
}

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
    [START_LISTENING]: (state, action) => Object.assign({}, state, { listening: true }),
    [TEMP_RECEIVED]: (state, action) => {
        const copiedTemps = state.temps.slice();
        copiedTemps[action.tempKey] = action.tempVal;
        return Object.assign({}, state, { temps: copiedTemps })
    },
    [SET_INITIAL_TEMPS]: (state, action) => Object.assign({}, state, { temps: action.temps })
}

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = {
    listening: false,
    temps: []
}
export default function counterReducer (state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]

  return handler ? handler(state, action) : state
}
