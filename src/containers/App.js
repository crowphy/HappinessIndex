import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { addNode } from '../actions'
import AddNodeWrapper from '../components/AddNode'
// import TodoList from '../components/TodoList'
// import Footer from '../components/Footer'

class App extends Component {
  render() {
    // Injected by connect() call:
    // console.log(this.props);
    const { dispatch } = this.props
    return (
      <div>
        <AddNodeWrapper
          onAddClick={text =>
            dispatch(add(text))
          } />
      </div>
    )
  }
}

export default connect()(App)