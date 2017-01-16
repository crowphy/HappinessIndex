import { combineReducers } from 'redux'
import { ADD_NODE, DEL_NODE } from './actions'

function nodes(state = [], action) {
    switch(action.type) {
        case ADD_NODE:
            return [
                ...state,
                {
                    text: action.text,
                    completed: false
                }
            ]
        default:
            return state
    }
}

const addNode = combineReducers({
  nodes
})

export default addNode