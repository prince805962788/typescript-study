import { createFiber } from "./createFiber";
import { isArray, isStr, updateNode } from "./utils";
// 更新字符串类型的组件
export function updateHostComponent(wip) {
  // stateNode = null，为原生标签
  if (!wip.stateNode) {
    // 新建一个dom节点并赋值
    wip.stateNode = document.createElement(wip.type);
    // 更新节点
    updateNode(wip.stateNode, wip.props);
  }

  reconcileChildren(wip, wip.props.children);
}
export function updateFunctionComponent(wip) {
  // wip.type 是函数组件的导出函数
  // children 为传入props后并执行了函数后的结果
  const children = wip.type(wip.props);
  reconcileChildren(wip, children);
}

export function updateFragmentComponent(wip) {
  reconcileChildren(wip, wip.props.children);
}
function reconcileChildren(returnFiber, children) {
  // returnFiber为父节点
  // 子节点为文本，直接返回
  if (isStr(children)) {
    return;
  }
  const newChildren = isArray(children) ? children : [children];
  // 新建一个前驱fiber节点
  let previosNewFiber = null;
  for (let i = 0; i < newChildren.length; i++) {
    const newChild = newChildren[i];
    // 创建一个新fiber
    const newFiber = createFiber(newChild, returnFiber);
    if (previosNewFiber === null) {
      // 不存在前驱节点，新fiber节点赋值给父节点的child
      returnFiber.child = newFiber;
    } else {
      // 存在前驱节点，新fiber节点赋值给前驱节点的下一个兄弟节点
      previosNewFiber.sibling = newFiber;
    }
    // 新fiber节点设置为前驱节点
    previosNewFiber = newFiber;
  }
}
