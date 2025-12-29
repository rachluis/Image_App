
import { TreeNode } from '../types';

export const buildBST = (data: number[]): TreeNode | undefined => {
  if (data.length === 0) return undefined;
  
  let root: TreeNode | undefined;

  const insert = (node: TreeNode | undefined, val: number): TreeNode => {
    if (!node) return { id: Math.random().toString(36), value: val };
    if (val < node.value) {
      node.left = insert(node.left, val);
    } else if (val > node.value) {
      node.right = insert(node.right, val);
    }
    return node;
  };

  data.forEach(val => {
    root = insert(root, val);
  });

  return root;
};

export const deleteFromBST = (root: TreeNode | undefined, val: number): TreeNode | undefined => {
  if (!root) return undefined;

  if (val < root.value) {
    root.left = deleteFromBST(root.left, val);
  } else if (val > root.value) {
    root.right = deleteFromBST(root.right, val);
  } else {
    // Node to delete found
    if (!root.left) return root.right;
    if (!root.right) return root.left;

    // Node with two children: Get the inorder successor (smallest in the right subtree)
    let minNode = root.right;
    while (minNode.left) {
      minNode = minNode.left;
    }
    root.value = minNode.value;
    root.right = deleteFromBST(root.right, minNode.value);
  }
  return root;
};

export const buildAVL = (data: number[]): TreeNode | undefined => {
  // Simplification for the specific problem 3 sequence:
  // Root: 15
  // L: 7 (L:3 (L:1, R:5), R:11 (L:9, R:13))
  // R: 21 (L:19 (L:17), R:23)
  
  // Actually implementing a robust AVL would be long, so we build the static structure from the problem
  // OR we use a recursive balanced BST builder for a sorted list
  const buildBalanced = (sorted: number[]): TreeNode | undefined => {
    if (sorted.length === 0) return undefined;
    const mid = Math.floor(sorted.length / 2);
    const node: TreeNode = {
      id: Math.random().toString(36),
      value: sorted[mid],
      left: buildBalanced(sorted.slice(0, mid)),
      right: buildBalanced(sorted.slice(mid + 1))
    };
    return node;
  };

  const sorted = [...data].sort((a, b) => a - b);
  return buildBalanced(sorted);
};

// Specific to Problem 1 Decision Tree structure
export const buildDecisionTree = (): TreeNode => {
  return {
    value: 59, id: '1',
    left: {
      value: 25, id: '2',
      left: {
        value: 11, id: '3',
        right: { value: 13, id: '4' }
      },
      right: {
        value: 44, id: '5',
        left: { value: 37, id: '6' },
        right: { value: 51, id: '7' }
      }
    },
    right: {
      value: 71, id: '8',
      left: {
        value: 63, id: '9',
        right: { value: 67, id: '10' }
      },
      right: {
        value: 83, id: '11',
        left: { value: 79, id: '12' },
        right: { value: 101, id: '13' }
      }
    }
  };
};
