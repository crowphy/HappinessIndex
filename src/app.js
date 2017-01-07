import React from 'react';
import ReactDOM from 'react-dom';
import DynamicFieldSet from './components/inputNode.js'
class App extends React.Component {
    render() {
        return (
            <DynamicFieldSet />
        )
    }
}

ReactDOM.render(<App />, document.getElementById('root'));