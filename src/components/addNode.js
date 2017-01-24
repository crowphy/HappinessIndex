// import React from 'react';
// import { Form, Input, Icon, Button } from 'antd/lib';
var Form = require('antd/lib/form');
var Input = require('antd/lib/input');
var Icon = require('antd/lib/icon');
var Button = require('antd/lib/button');
import React, { Component, PropTypes } from 'react';
import './addNode.scss';

const FormItem = Form.Item;

let uuid = 0;
let infoTree = {
  0: {
    id: 0,
    parentId: null,
    position: {
      top: 300,
      left: 50
    },
    childNum: 0,
    children: []
  }
};

class AddNode extends Component {

  setHeightRange(parentId, highest, lowest) {
    if(parentId === null) return;
    infoTree[parentId].childHighest = Math.min(highest, infoTree[parentId].childHighest);
    infoTree[parentId].childLowest = Math.max(lowest, infoTree[parentId].childLowest);
    this.setHeightRange(infoTree[parentId].parentId, infoTree[parentId].childHighest, infoTree[parentId].childLowest)
  }

  // 设置兄弟节点的位置
  setSiblingPos(id, top, infoTree) {

    let firstChildId = infoTree[id].children[0];
    infoTree[id].childHighest = infoTree[firstChildId].position.top;
    infoTree[id].childLowest = top;

    this.setHeightRange(infoTree[id].parentId, infoTree[id].childHighest, infoTree[id].childLowest);

    if(id !== 0) {
      let siblingIds = infoTree[infoTree[id].parentId].children;
      for(let i = 0; i < siblingIds.length; i++) {
        if(infoTree[siblingIds[i]].id !== id) {
          if(infoTree[siblingIds[i]].position.top < infoTree[id].childHighest) {
            infoTree[siblingIds[i]].position.top -= 15;
          } else if(infoTree[siblingIds[i]].position.top > infoTree[id].childLowest) {
            infoTree[siblingIds[i]].position.top += 15;
          }
        }
      }
    }
  }

  add(id) {
    uuid++;
    // 设置子节点的位置
    let siblingNum = infoTree[id].childNum++;
    infoTree[id].children.push(uuid);
    let left = infoTree[id].position.left + 180;
    let top = infoTree[id].position.top + 15 * siblingNum;
    
    for(let i = 0; i < siblingNum; i++) {
      let childId = infoTree[id].children[i];
      infoTree[childId].position.top -= 15;
    }
    
    let nodeId = {
      id: uuid,
      parentId: id,
      position: {
        top: top,
        left: left
      },
      childNum: 0,
      children: []
    }

    infoTree[uuid] = nodeId;

    this.setSiblingPos(id, top, infoTree);
    console.log(infoTree[0].childHighest);
    const { form } = this.props;
    const keys = form.getFieldValue('keys');
    const nextKeys = keys.concat(nodeId);
    
    form.setFieldsValue({
      keys: nextKeys
    });
    
  };
  
  
  render() {

    const { getFieldDecorator, getFieldValue } = this.props.form;
    getFieldDecorator('keys', { initialValue: [] });
    const keys = getFieldValue('keys');
    const formItems = keys.map((nodeId, index) => {
      return (
        <FormItem
          key={nodeId.id}
          className='node-item' 
          style={{ top: infoTree[nodeId.id].position.top, left: infoTree[nodeId.id].position.left }}
        >
        {getFieldDecorator(`names-${nodeId.id}`, {
            validateTrigger: ['onChange', 'onBlur'],
            // rules: [{
            //   required: true,
            //   whitespace: true,
            //   message: "Please input passenger's name or delete this field.",
            // }],
            initialValue: nodeId.id
          })(
            <div>
              <Button type="dashed" onClick={(e) => this.remove(e)}>
                <Icon type="del" />-
              </Button>
              <Input placeholder="" style={{ width: '60%', marginRight: 8 }} />
              <Button type="dashed" onClick={(e) => this.add(nodeId.id)}>
                <Icon type="plus" key={nodeId.id}/>+
              </Button>
            </div>
          )}
        </FormItem>
      )
    })
    return (
      <Form className='node-add'>
        <FormItem className='node-item' style={{ top: 300, left: 50 }}>
          <div>
            <Input placeholder="" style={{ width: '60%', marginRight: 8 }} />
            <Button type="dashed" onClick={(e) => this.add(0)}>
              <Icon type="plus"  key={0}/>+
            </Button>
          </div>
        </FormItem>
        {formItems}
      </Form>
    )
  }
  
}

AddNode.propTypes = {
  onAddClick: PropTypes.func.isRequired
}

const AddNodeWrapper = Form.create({
  onFieldsChange(props, fields) {
    console.log('onFieldsChange', fields);

  },
})(AddNode);
export default AddNodeWrapper;