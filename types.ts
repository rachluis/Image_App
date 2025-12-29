
export interface TreeNode {
  id: string;
  value: number;
  left?: TreeNode;
  right?: TreeNode;
}

export type TreeType = 'DECISION' | 'BST' | 'AVL';

export interface TreeProblem {
  id: string;
  title: string;
  description: string;
  type: TreeType;
  initialData: number[];
  steps?: {
    label: string;
    root: TreeNode;
  }[];
}
