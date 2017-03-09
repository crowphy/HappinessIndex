
let Form = require('antd/lib/form');
let Input = require('antd/lib/input');
let Icon = require('antd/lib/icon');
let Button = require('antd/lib/button');
// import { Form, Input, Icon, Button } from 'antd';
import React, { Component, PropTypes } from 'react';
import './addNode.scss';
import infoTree from './infoTree';
// import Calculate from './calculate';

const FormItem = Form.Item;
let uid = 0;
let nodeGap = 25;

/**
 * 
 * 
 * @class AddNode
 * @extends {Component}
 */
class AddNode extends Component {

  /**
   * 设置其他节点的位置，遍历整棵树的节点，自身及直系祖先除外
   * 
   * @param {any} ancestorIds 直系祖先节点
   * @param {any} numToChange 影响高度的节点数量
   * @returns 
   * 
   * @memberOf AddNode
   */
  setOthersPos(ancestorIds, numToChange) {

    if (ancestorIds.length === 1) return;
    let gap = nodeGap * numToChange;
    // 从根节点开始遍历与同级直系祖先节点比较
    for (let i = 1; i < ancestorIds.length;) {
      let childIds = infoTree[ancestorIds[i - 1]].sonIds,
        ancestor = infoTree[ancestorIds[i]];
      for (let j = 0; j < childIds.length; j++) {
        let ancestorSibling = infoTree[childIds[j]];
        // 递归调整所以子节点
        if (ancestorSibling.position.top < ancestor.position.top) {
          ancestorSibling.position.top -= gap;
          this.setChildPos(ancestorSibling, -gap);
        } else if (ancestorSibling.position.top > ancestor.position.top) {
          ancestorSibling.position.top += gap;
          this.setChildPos(ancestorSibling, gap);
        }
        ancestorSibling.lineY = infoTree[ancestor['parentId']].position.top - ancestorSibling.position.top;
      }
      i++;
    }
  }

  /**
   * 递归调整各个子节点的位置
   * 
   * @param {any} node 
   * @param {any} gap 
   * @returns 
   * 
   * @memberOf AddNode
   */
  setChildPos(node, gap) {

    let sonNodes = node.sonIds;
    if (sonNodes.length === 0) return;
    for (let i of sonNodes) {
      infoTree[i].position.top += gap;
      infoTree[i].lineY = node.position.top - infoTree[i].position.top;
      this.setChildPos(infoTree[i], gap);
    }
  }


  /**
   * 添加节点
   * 
   * @param {any} id 
   * 
   * @memberOf AddNode
   */
  add(id) {
    uid++;
    // 设置子节点的位置
    let sonNum = infoTree[id].sonNum++;
    this.setChildPos(infoTree[id], -nodeGap);
    infoTree[id].sonIds.push(uid);

    let leafNodeNum = infoTree[id].leafNodeNum;
    if (!sonNum) {
      leafNodeNum = 0;
    }

    let left = infoTree[id].position.left + 180;
    let top = infoTree[id].position.top + nodeGap * leafNodeNum;
    infoTree[id].isLeafNode = false;

    let ancestorIds = infoTree[id].ancestorIds.slice(0);
    ancestorIds.push(id);

    if (infoTree[id].sonNum > 1) {
      for (let i of ancestorIds) {
        infoTree[i].leafNodeNum++;
      }
    }
    // 待绘制两点之间的落差
    let lineY = infoTree[id].position.top - top;

    let child = {
      id: uid,
      parentId: id,
      position: {
        top: top,
        left: left
      },
      sonNum: 0,
      sonIds: [],
      ancestorIds: ancestorIds,
      leafNodeNum: 1,
      isLeafNode: true,
      weight: '',
      defaultWeight: 0,
      value: 0,
      lineY: lineY
    }

    infoTree[uid] = child;

    if (sonNum !== 0) {
      this.setOthersPos(ancestorIds, 1);
    }

    const { form } = this.props;
    form.setFieldsValue({
      keys: infoTree
    });
  };

  deleteChildren(id, nodeToDelete) {
    for (let i = 0; i < infoTree[id].sonIds.length; i++) {
      nodeToDelete.push(infoTree[id].sonIds[i]);
      let tempId = infoTree[id].sonIds[i];
      this.deleteChildren(tempId, nodeToDelete);
      delete infoTree[tempId];
    }
  }

  /**
   * 删除节点
   * 
   * @param {any} id 
   * 
   * @memberOf AddNode
   */
  remove(id) {

    const { form } = this.props;
    const keys = form.getFieldValue('keys');
    let nodeToDelete = [];
    this.deleteChildren(id, nodeToDelete);
    nodeToDelete.push(id);

    let ancestorIds = infoTree[id].ancestorIds.slice(0);
    ancestorIds.push(id);

    let numToChange = infoTree[id].leafNodeNum;
    this.setOthersPos(ancestorIds, -numToChange);

    let parentId = infoTree[id].parentId;
    if (infoTree[parentId].sonNum > 1) {
      for (let i of ancestorIds) {
        infoTree[i].leafNodeNum -= numToChange;
      }
    } else {
      for (let i of ancestorIds) {
        infoTree[i].leafNodeNum -= numToChange + 1;
      }
    }
    infoTree[parentId].sonNum--;
    let index = infoTree[parentId].sonIds.indexOf(id);
    infoTree[parentId].sonIds.splice(index, 1);
    if (infoTree[parentId].sonNum === 0) {
      infoTree[parentId].isLeafNode = true;
    }

    delete infoTree[id];

    form.setFieldsValue({
      keys: infoTree
    });
  }

  /**
   *  计算节点权重，使兄弟节点的权重和为1
   * 
   * @param {any} id 
   * @param {any} e 
   * 
   * @memberOf AddNode
   */
  calculateWeight(id, e) {

    const { form } = this.props;

    let preRemainWeight = 100 - infoTree[id].weight;
    infoTree[id].weight = e.target.value || 0;
    let remainWeight = 100 - infoTree[id].weight;
    console.log(preRemainWeight, remainWeight);
    let parentId = infoTree[id].parentId;
    for(let sonId of infoTree[parentId].sonIds) {
      if(sonId !== id) {
        infoTree[sonId].weight = (infoTree[sonId].weight / preRemainWeight * remainWeight).toFixed(2);
      }
    }

    form.setFieldsValue({
      keys: infoTree
    });

  }

  render() {

    const { getFieldDecorator, getFieldValue } = this.props.form;
    getFieldDecorator('keys', { initialValue: [] });
    const keys = getFieldValue('keys');
    const formItems = []
    for (let i in keys) {
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
              <svg id="mysvg" width="80" height="1000">
                <line id="line" x1="0" y1={node.lineY + 521} x2="80" y2="521"/>
              </svg>
              <div>
                <Button className="node-operate" type="dashed" onClick={(e) => this.remove(node.id)}>
                  <Icon type="del" />-
                </Button>
                <div className="node-input-area">
                  <Input className="node-input" placeholder="名称" />
                  <div className="node-number">
                    <Input className="node-input" placeholder="权重" maxLength="4" min="0" max="100" value={node.weight} onChange={(e) => this.calculateWeight(node.id, e)} />
                    <Input className="node-input" placeholder="分数" />
                  </div>
                </div>
                <Button className="node-operate" type="dashed" onClick={(e) => this.add(node.id)}>
                  <Icon type="plus" key={node.id} />+
                </Button>
              </div>
            </div>
            )}
        </FormItem>
      if (node.id !== 0) {
        formItems.push(item);
      }
    }
    return (
      <Form className='node-add'>
        
        <FormItem className='node-item' style={{ top: 300, left: 72 }}>
          <div>
            <div className="node-input-area node-root">
              <Input className="node-input" placeholder="名称" />
              <Input className="node-input" placeholder="得分" />
            </div>
            <Button className="node-operate" type="dashed" onClick={(e) => this.add(0)}>
              <Icon type="plus" key={0} />+
            </Button>
          </div>
        </FormItem>
        {formItems}
      </Form>
    )
  }
}

const AddNodeWrapper = Form.create()(AddNode);
export default AddNodeWrapper;