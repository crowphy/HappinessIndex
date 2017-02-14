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
    children: [],
    ancestorIds: []
  }
};

let nodeGap = 15;

class AddNode extends Component {

  // 遍历整棵树的节点并调整位置，自身及直系祖先除外
  setOthersPos(ancestorIds) {

    if(ancestorIds.length === 1) return;

    for(let i = 1; i < ancestorIds.length; ) {
      let childIds = infoTree[ancestorIds[i-1]].children;
      for(let j = 0; j < childIds.length; j++) {
        let sibling = infoTree[childIds[j]],
            ancestor = infoTree[ancestorIds[i]];
        if(sibling.position.top < ancestor.position.top) {
          sibling.position.top -= nodeGap;
          this.setChildPos(sibling, -nodeGap);
        } else if(sibling.position.top > ancestor.position.top) {
          sibling.position.top += nodeGap;
          this.setChildPos(sibling, nodeGap);
        }
      }
      i++;
    }
  }

  // 递归调整各个子节点的位置
  setChildPos(sibling, gap) {
    let siblingChildren = sibling.children;
    if(siblingChildren.length === 0) {
      return;
    } else {
      for(let k = 0; k < siblingChildren.length; k++) {
        infoTree[siblingChildren[k]].position.top += gap;
        this.setChildPos(infoTree[siblingChildren[k]], gap);
      }
    }
  }
  


  add(id) {
    uuid++;
    // 设置子节点的位置
    let childNum = infoTree[id].childNum++;
    infoTree[id].children.push(uuid);
    let left = infoTree[id].position.left + 180;
    let top = infoTree[id].position.top + nodeGap * childNum;
    for(let i = 0; i < childNum; i++) {
      let childId = infoTree[id].children[i];
      infoTree[childId].position.top -= nodeGap;
    }
    let ancestorIds = infoTree[id].ancestorIds.slice(0);
    ancestorIds.push(id);
    
    let child = {
      id: uuid,
      parentId: id,
      position: {
        top: top,
        left: left
      },
      childNum: 0,
      children: [],
      ancestorIds: ancestorIds
    }

    infoTree[uuid] = child;

    console.log(infoTree);

    if(childNum !== 0) {
      this.setOthersPos(ancestorIds);
    }
    const { form } = this.props;
    
    form.setFieldsValue({
      keys: infoTree
    });
    
  };

  deleteChildren(id, nodeToDelete) {
    for(let i = 0; i < infoTree[id].children.length; i++) {
      console.log('i', i);
      nodeToDelete.push(infoTree[id].children[i]);
      let tempId = infoTree[id].children[i];
      this.deleteChildren(tempId, nodeToDelete);  
      delete infoTree[tempId];
    }
  }

  remove(id) {

    const { form } = this.props;
    const keys = form.getFieldValue('keys');
    let nodeToDelete = [];
    this.deleteChildren(id, nodeToDelete);
    nodeToDelete.push(id);
    let parentId = infoTree[id].parentId;
    infoTree[parentId].childNum--;
    let index = infoTree[parentId].children.indexOf(id);
    infoTree[parentId].children.splice(index, 1);

    delete infoTree[id];
    form.setFieldsValue({
      keys: infoTree
    });
  }
  
  render() {

    const { getFieldDecorator, getFieldValue } = this.props.form;
    getFieldDecorator('keys', { initialValue: [] });
    const keys = getFieldValue('keys');
    const formItems =[] 
    for(let i in keys) {
      let node = infoTree[i];
      let item = 
      <FormItem
          key={node.id}
          className='node-item' 
          style={{ top: node.position.top, left: node.position.left }}
        >
        {getFieldDecorator(`names-${node.id}`, {
            validateTrigger: ['onChange', 'onBlur'],
            initialValue: node.id
          })(
            <div>
              <Button type="dashed" onClick={(e) => this.remove(node.id)}>
                <Icon type="del" />-
              </Button>
              <Input placeholder="" style={{ width: '60%', marginRight: 8 }} />
              <Button type="dashed" onClick={(e) => this.add(node.id)}>
                <Icon type="plus" key={node.id}/>+
              </Button>
            </div>
          )}
        </FormItem>
        if(node.id !== 0) {
          formItems.push(item);
        }
    }
    console.log(formItems);
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

const AddNodeWrapper = Form.create()(AddNode);
export default AddNodeWrapper;