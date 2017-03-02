import React from 'react'
import { render } from 'react-dom'
import AddNodeWrapper from './components/AddNode'

let rootElement = document.getElementById('root')

render(
    <AddNodeWrapper />,
    rootElement
)