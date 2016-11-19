import getFirebase from './../../../firebaseProvider';
import _ from 'underscore';

const firebase = getFirebase();
// ------------------------------------
// Constants
// ------------------------------------
export const START_LISTENING = 'temps/START_LISTENING';
export const TEMP_RECEIVED = 'temps/TEMP_RECEIVED';
export const SET_INITIAL_BOARDS = 'temps/SET_INITIAL_BOARDS';

// ------------------------------------
// Actions
// ------------------------------------
export function startListening () {
    return (dispatch, getState) => {
        /*firebase.database().ref('boards').on('child_changed', snapshot => {
            const boards = snapshot.val();
            dispatch(setBoardsNode(boards));
        });
*/      const updateState = snapshot => {
            const boards = snapshot.val();
            dispatch(setBoardsNode(boards));
        };

        const boardsRef = firebase.database().ref('boards');

        boardsRef.on('value', snapshot => updateState(snapshot))
        boardsRef.once('value', snapshot => updateState(snapshot));
    };
}

export function tempReceived(tempKey, tempVal) {
    return {
        type: TEMP_RECEIVED,
        tempKey,
        tempVal
    };
}

export function setBoardsNode(boards) {
    return {
        type: SET_INITIAL_BOARDS,
        boards
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
    [SET_INITIAL_BOARDS]: (state, action) => Object.assign({}, state, { boards: action.boards })
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
