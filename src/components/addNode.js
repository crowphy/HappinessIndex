// import React from 'react';
// import { Form, Input, Icon, Button } from 'antd/lib';
var Form = require('antd/lib/form');
var Input = require('antd/lib/input');
var Icon = require('antd/lib/icon');
var Button = require('antd/lib/button');
import React, { Component, PropTypes } from 'react';
import './addNode.scss';

const FormItem = Form.Item;

let uid = 0;
let infoTree = {
  0: {
    id: 0,
    parentId: null,
    position: {
      top: 300,
      left: 50
    },
    sonNum: 0,
    children: [],
    ancestorIds: [],
    leafNodeNum: 1,
    isLeafNode: true
  }
};

let nodeGap = 15;

class AddNode extends Component {

  // 遍历整棵树的节点并调整位置，自身及直系祖先除外
  setOthersPos(ancestorIds, numToChange) {
    console.log(ancestorIds);
    if(ancestorIds.length === 1) return;

    let gap = nodeGap * numToChange;
    // 从根节点开始遍历与同级直系祖先节点比较
    for(let i = 1; i < ancestorIds.length; ) {
      let childIds = infoTree[ancestorIds[i-1]].children,
          ancestor = infoTree[ancestorIds[i]];
      for(let j = 0; j < childIds.length; j++) {
        let ancestorSibling = infoTree[childIds[j]];
        // 递归调整所以子节点
        if(ancestorSibling.position.top < ancestor.position.top) {
          ancestorSibling.position.top -= gap;
          this.setChildPos(ancestorSibling, -gap);
        } else if(ancestorSibling.position.top > ancestor.position.top) {
          ancestorSibling.position.top += gap;
          this.setChildPos(ancestorSibling, gap);
        }
      }
      i++;
    }
  }

  // 递归调整各个子节点的位置
  setChildPos(node, gap) {

    // console.log(node);
    let nodeChildren = node.children;
    if(nodeChildren.length === 0) return;  
    for(let i of nodeChildren) {
      infoTree[i].position.top += gap;
      this.setChildPos(infoTree[i], gap);
    }
    
  }

  add(id) {
    uid++;
    // 设置子节点的位置
    let sonNum = infoTree[id].sonNum++;
    this.setChildPos(infoTree[id], -nodeGap);
    infoTree[id].children.push(uid);
    
    let leafNodeNum = infoTree[id].leafNodeNum;
    if(!sonNum) {
      leafNodeNum = 0;
    }
    let left = infoTree[id].position.left + 180;
    let top = infoTree[id].position.top + nodeGap * leafNodeNum;

    infoTree[id].isLeafNode = false;

    let ancestorIds = infoTree[id].ancestorIds.slice(0);
    ancestorIds.push(id);

    if(infoTree[id].sonNum > 1) {
      for(let i of ancestorIds) {
        infoTree[i].leafNodeNum++;
      }
    }

    let child = {
      id: uid,
      parentId: id,
      position: {
        top: top,
        left: left
      },
      sonNum: 0,
      children: [],
      ancestorIds: ancestorIds,
      leafNodeNum: 1,
      isLeafNode: true
    }

    infoTree[uid] = child;

    if(sonNum !== 0) {
      this.setOthersPos(ancestorIds, 1);
    }
    console.log('sonNum', sonNum);
    // this.updateChildrenNum(ancestorIds, 1);
    console.log(infoTree);
    const { form } = this.props;
    form.setFieldsValue({
      keys: infoTree
    });
    
  };

  deleteChildren(id, nodeToDelete) {
    for(let i = 0; i < infoTree[id].children.length; i++) {
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

    let ancestorIds = infoTree[id].ancestorIds.slice(0);
    ancestorIds.push(id);

    let numToChange = infoTree[id].leafNodeNum;
    // this.updateChildrenNum(ancestorIds, -numToChange);
    this.setOthersPos(ancestorIds, -numToChange);

    let parentId = infoTree[id].parentId;
    if(infoTree[parentId].sonNum > 1) {
      for(let i of ancestorIds) {
        infoTree[i].leafNodeNum -= numToChange;
      } 
    } else {
      for(let i of ancestorIds) {
        infoTree[i].leafNodeNum -= numToChange + 1;
      } 
    }
    infoTree[parentId].sonNum--;
    let index = infoTree[parentId].children.indexOf(id);
    infoTree[parentId].children.splice(index, 1);
    if(infoTree[parentId].sonNum === 0) {
      infoTree[parentId].isLeafNode = true;
    }

    delete infoTree[id];

    console.log(infoTree);
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
              <Input placeholder={node.id} style={{ width: '60%', marginRight: 8 }} />
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