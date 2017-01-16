import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { addNode } from '../actions'
import AddNode from '../components/AddNode'
// import TodoList from '../components/TodoList'
// import Footer from '../components/Footer'

class App extends Component {
  render() {
    // Injected by connect() call:
    const { dispatch } = this.props
    return (
      <div>
        <AddNode
          onAddClick={text =>
            dispatch(addNode(text))
          } />
      </div>
    )
  }
}

// function selectTodos(todos, filter) {
//   switch (filter) {
//     case VisibilityFilters.SHOW_ALL:
//       return todos
//     case VisibilityFilters.SHOW_COMPLETED:
//       return todos.filter(todo => todo.completed)
//     case VisibilityFilters.SHOW_ACTIVE:
//       return todos.filter(todo => !todo.completed)
//   }
// }

// function select(state) {
//   return {
//     visibleTodos: selectTodos(state.todos, state.visibilityFilter),
//     visibilityFilter: state.visibilityFilter
//   }
// }

export default connect()(App)