import type { DynamicStack } from "../../Stack";
import type { BSTDataNode } from "../../DataNode";
import type { BST } from "..";
export const CallDFS = <T extends any, AbstractBSTDataNode extends BSTDataNode>(
  tree: BST<T>,
  S: DynamicStack<AbstractBSTDataNode | null>,
  callback: (node: AbstractBSTDataNode, tree: BST<T>) => void,
): void => {
  if (S.isEmpty) return;
  const node: AbstractBSTDataNode = S.pop() as AbstractBSTDataNode;
  if (node.right) S.push(node.right as AbstractBSTDataNode);
  if (node.left) S.push(node.left as AbstractBSTDataNode);
  callback(node, tree);

  return CallDFS(tree, S, callback);
};
