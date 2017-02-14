/*'use strict';


function bar() {console.log(this)}

bar();
function Person() {
  // 构造函数 Person() 定义的 `this` 就是新实例对象自己
  this.age = 0;
console.log(this)
  setTimeout(function growUp() {
    console.log(this)
    this.age++; 
  }, 1000);
}

var p = new Person();*/
var a = b => c => {
  console.log(b, c);
}
a(1)(2)

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

    // if(id !== 0) {
    //   let siblingIds = infoTree[infoTree[id].parentId].children;
    //   for(let i = 0; i < siblingIds.length; i++) {
    //     if(infoTree[siblingIds[i]].id !== id) {
    //       if(infoTree[siblingIds[i]].position.top < infoTree[id].childHighest) {
    //         infoTree[siblingIds[i]].position.top -= nodeGap;
    //       } else if(infoTree[siblingIds[i]].position.top > infoTree[id].childLowest) {
    //         infoTree[siblingIds[i]].position.top += nodeGap;
    //       }
    //     }
    //   }
    // }
  }

  const formItems =[] 
    for(let node of keys) {
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
        formItems.push(item);
    }

        // keys.forEach(function(item, index) {
    //   console.log(nodeToDelete, item.id);
    //   console.log('index', index);
    //   if(nodeToDelete.indexOf(item.id) > -1) {
    //     console.log('te');
    //     keys.splice(index, 1);
    //   }
    // })
    // let len = keys.length;
    // let flag = 0;
    // console.log(nodeToDelete);
    // for(let i = 0; i < len; i++) {
    //   console.log('len', len);
    //   console.log('id', keys[i].id);
    //   if(nodeToDelete.indexOf(keys[i].id) > -1) {
    //     // keys.splice(i, 1);
    //     delete keys[i];
    //     flag++;
    //   }
    // }
    // keys.length -=flag;
    // console.log('keys', keys);

        // const keys = form.getFieldValue('keys');
    // const nextKeys = keys.concat(child);
    