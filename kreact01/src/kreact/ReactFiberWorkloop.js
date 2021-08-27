// wip work in progress当前正在工作中的

import {
  updateFragmentComponent,
  updateFunctionComponent,
  updateHostComponent,
} from "./ReactFiberReconciler";
import { isFn, isStr } from "./utils";
// 当前fiber节点
let wipRoot = null;
// 下一个fiber节点
let nextUnitOfwork = null;
export function scheduleUpdateOnFiber(fiber) {
  wipRoot = fiber;
  nextUnitOfwork = fiber;
}

function performUnitOfWork(wip) {
  // 1. 更新wip
  const { type } = wip;
  if (isStr(type)) {
    // 节点类型是一段字符串
    updateHostComponent(wip);
  } else if (isFn(type)) {
    // 节点类型是函数式组件
    updateFunctionComponent(wip);
  } else {
    // 节点类型是一个片段容器
    updateFragmentComponent(wip);
  }
  // todo
  // 2. 返回下一个要更新的任务 深度优先遍历
  // 有子节点，返回子节点
  if (wip.child) {
    return wip.child;
  }
  let next = wip;
  while (next) {
    // 有兄弟节点，返回兄弟节点，
    if (next.sibling) {
      return next.sibling;
    }
    // 无兄弟返回父节点继续寻找其他兄弟节点
    next = next.return;
  }
  return null;
}

function workLoop(IdleDeadline) {
  // 在空余时间执行
  while (nextUnitOfwork && IdleDeadline.timeRemaining() > 0) {
    // 对下一个fiber节点格式化
    nextUnitOfwork = performUnitOfWork(nextUnitOfwork);
  }
  if (!nextUnitOfwork && wipRoot) {
    commitRoot();
  }
}

requestIdleCallback(workLoop);

function commitRoot() {
  commitWorker(wipRoot.child);
  wipRoot = null;
}

function commitWorker(wip) {
  if (!wip) return;

  // 1。提交自己
  const { stateNode } = wip;
  // fiber可能没有dom节点，比如函数组件类组件
  // 找到上一级dom元素
  let parentNode = getParentNode(wip.return); //wip.return.stateNode; // 父dom节点
  if (stateNode) {
    parentNode.appendChild(stateNode);
  }
  // 2、 子节点
  commitWorker(wip.child);
  // 3.兄弟
  commitWorker(wip.sibling);
}

function getParentNode(fiber) {
  while (fiber) {
    if (fiber.stateNode) {
      return fiber.stateNode;
    }
    fiber = fiber.return;
  }
}
