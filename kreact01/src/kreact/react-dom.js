import { scheduleUpdateOnFiber } from "./ReactFiberWorkloop";

// element 为 jsx 转成的vnode节点， constainer为要渲染的根节点容器dom
function render(element, container) {
  // 根fiber
  const FiberRoot = {
    type: container.nodeName.toLocaleLowerCase(), // 根容器的类型
    props: { children: element }, // 根fiber的孩子为传入的jsx生成的vnode
    stateNode: container, // 原生标签则是dom节点，类组件则是类实例
  };

  // 递归深度优先更新子fiber
  scheduleUpdateOnFiber(FiberRoot);
}

export default { render };
