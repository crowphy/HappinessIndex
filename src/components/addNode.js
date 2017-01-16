// import React from 'react';
// import { Form, Input, Icon, Button } from 'antd/lib';
var Form = require('antd/lib/form');
var Input = require('antd/lib/input');
var Icon = require('antd/lib/icon');
var Button = require('antd/lib/button');
const FormItem = Form.Item;

import React, { Component, PropTypes } from 'react'

export default class AddNode extends Component {
  render() {
    return (
      <div>
        <input type='text' ref='input' />
        <button onClick={(e) => this.handleClick(e)}>
          Add
        </button>
      </div>
    )
  }

  handleClick(e) {
    const node = this.refs.input
    const text = node.value.trim()
    this.props.onAddClick(text)
    console.log(text)
    node.value = ''
  }
}

AddNode.propTypes = {
  onAddClick: PropTypes.func.isRequired
}