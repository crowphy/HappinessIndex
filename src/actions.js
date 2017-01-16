/*
 * action
 */

export const ADD_NODE = 'ADD_NODE'
export const DEL_NODE = 'DEL_NODE'

/**
 * action 创建函数
*/

export function addNode(text) {
    return {
        type: ADD_NODE,
        text
    }
}

export function delNode(text) {
    return {
        type: DEL_NODE,
        text
    }
}