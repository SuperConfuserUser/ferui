import { ChangeDetectorRef, Injectable } from '@angular/core';

import {
  FuiTreeviewNodeSelectionEnum,
  PagedTreeNodeDataRetriever,
  TreeNode,
  TreeNodeData,
  TreeNodeDataRetriever
} from './interfaces';

/**
 * Fui TreeView MultiSelect Service
 * Handler logic to keep track of all checked/partially checked nodes for Fui TreeView Component User
 */
@Injectable()
export class FuiTreeViewMultiSelectService<T> {
  private checkedNodes: Array<TreeNode<T>> = []; // list of all currently checked nodes
  private partiallyCheckedNodes: Array<TreeNode<T>> = []; // list of all currently partially checked nodes
  private autoCheck: boolean = false;
  private selectionType: FuiTreeviewNodeSelectionEnum;
  private disableChildren: boolean = true; // on Server-Side we disable children when parent node is checked by default

  /**
   * Get the checked nodes list
   * @returns {Array<TreeNode<T>>}
   */
  getCheckedNodes(): Array<TreeNode<T>> {
    return this.checkedNodes;
  }

  /**
   * Get the partially checked nodes list
   * @returns {Array<TreeNode<T>>}
   */
  getPartialCheckedNodes(): Array<TreeNode<T>> {
    return this.partiallyCheckedNodes;
  }

  /**
   * Sets the Auto-Check property for Multi-Select feature.
   * On Client-side auto check can be either true/false to auto check a TreeNode's descendants
   * On Server-side auto check will always be false
   * @param value {boolean}
   */
  setAutoCheck(value: boolean): void {
    this.autoCheck = value;
  }

  /**
   * Get Auto Check value of TreeView
   * @returns {boolean} whether auto check feature is on or off for tree view
   */
  isAutoCheck(): boolean {
    return this.autoCheck;
  }

  /**
   * Sets the Node Selection type of Tree View
   * @param type
   */
  setNodeSelection(type: FuiTreeviewNodeSelectionEnum): void {
    this.selectionType = type;
  }

  /**
   * Gets the Node Selection type of Tree View
   */
  getNodeSelection(): FuiTreeviewNodeSelectionEnum {
    return this.selectionType;
  }

  /**
   * Set disable children for Server-Side tree view if dev wishes to overwrite default behavior
   * @param value {boolean}
   */
  setDisableChildren(value: boolean): void {
    this.disableChildren = value;
  }

  /**
   * Get disable children value for Server-Side tree view
   */
  getDisableChildren(): boolean {
    return this.disableChildren;
  }

  /**
   * Handles a checked node by ensuring its checked/indeterminate status and adds it to the checked nodes list
   * as well as handles its side effects of updating its descendants/ancestors accordingly
   * @param node {TreeNode<T>} the checked on node
   * @param cd {ChangeDetectorRef}
   * @param isServerSide {boolean} whether it is a Server-Side Tree View
   * @param dataRetriever {TreeNodeDataRetriever<T> | PagedTreeNodeDataRetriever<T>}
   * @param createNodes {(t: TreeNodeData<T>, p: TreeNode<T> | null) => TreeNode<T>}
   * @param checkedNodes {Array<TreeNode<T>>} optional checked nodes params
   */
  async handleCheckedNode(
    node: TreeNode<T>,
    cd: ChangeDetectorRef,
    isServerSide: boolean,
    dataRetriever: TreeNodeDataRetriever<T> | PagedTreeNodeDataRetriever<T>,
    createNodes: (t: TreeNodeData<T>, p: TreeNode<T> | null) => TreeNode<T>,
    checkedNodes?: Array<TreeNode<T>>
  ): Promise<void> {
    // Need to use a timeout to ensure model and view sync up
    setTimeout(async () => {
      node.checked = true;
      node.indeterminate = false;
      this.checkedNodes.push(node);
      // Depending on if we are dealing with a server side tree view we treat a nodes descendants differently
      if (!isServerSide && this.autoCheck && this.selectionType === FuiTreeviewNodeSelectionEnum.MULTIPLE) {
        // On client side we get all TreeNode Descendants and check any that are not visually present on TreeView
        const allDescendants: Array<TreeNode<T>> = await this.getAllDescendants(node, dataRetriever, createNodes);
        const allVisibleDescendants: Array<TreeNode<T>> = this.getAllVisibleDescendants(node);
        const allNonVisibleDescendants = allDescendants.filter(descendant => {
          return !allVisibleDescendants.find(it => it.id === descendant.id);
        });
        this.checkedNodes.push(...allNonVisibleDescendants);
        this.handleNodeCheckedDescendants(node, true);
        this.handleNodeCheckedAncestors(node);
      } else if (isServerSide && this.selectionType === FuiTreeviewNodeSelectionEnum.MULTIPLE) {
        this.handleVisibleServerSideChildren(node, true);
        this.handleNonVisibleServerSideChildren(node);
      }
      if (this.selectionType === FuiTreeviewNodeSelectionEnum.SINGLE) {
        // Deselect all nodes in Tree View except current node at hand
        this.uncheckAllNodes(checkedNodes);
        this.checkedNodes = [node];
      }
      cd.markForCheck();
    });
  }

  /**
   * Handles an unchecked node by ensuring its checked/indeterminate status is updated and removes it to the checked nodes list
   * as well as handles its side effects of updating its descendants/ancestors accordingly
   * @param node {TreeNode<T>} the checked on node
   * @param cd {ChangeDetectorRef}
   * @param isServerSide {boolean} whether it is a Server-Side Tree View
   * @param dataRetriever {TreeNodeDataRetriever<T> | PagedTreeNodeDataRetriever<T>}
   * @param createNodes {(t: TreeNodeData<T>, p: TreeNode<T> | null) => TreeNode<T>}
   */
  async handleUncheckedNode(
    node: TreeNode<T>,
    cd: ChangeDetectorRef,
    isServerSide: boolean,
    dataRetriever: TreeNodeDataRetriever<T> | PagedTreeNodeDataRetriever<T>,
    createNodes: (t: TreeNodeData<T>, p: TreeNode<T> | null) => TreeNode<T>
  ): Promise<void> {
    setTimeout(async () => {
      if (!isServerSide && this.autoCheck && this.selectionType === FuiTreeviewNodeSelectionEnum.MULTIPLE) {
        const allDescendants = await this.getAllDescendants(node, dataRetriever, createNodes);
        const allVisibleDescendants = this.getAllVisibleDescendants(node);
        const allNonVisibleDescendants = allDescendants.filter(descendant => {
          return !allVisibleDescendants.find(it => it.id === descendant.id);
        });
        allNonVisibleDescendants.forEach(descendant => {
          this.removeNodeFromList(descendant, this.checkedNodes);
        });
        this.handleNodeCheckedDescendants(node, false);
        this.handleNodeCheckedAncestors(node);
        if (node.indeterminate) {
          // If node was partially checked we remove from partial checked list
          this.removeNodeFromList(node, this.partiallyCheckedNodes);
          // Remove any possible children/descendants from partially checked array as well
          allNonVisibleDescendants.forEach(descendant => {
            this.removeNodeFromList(descendant, this.partiallyCheckedNodes);
          });
        }
      } else if (isServerSide && this.selectionType === FuiTreeviewNodeSelectionEnum.MULTIPLE) {
        this.handleVisibleServerSideChildren(node, false);
      }
      node.checked = false;
      node.indeterminate = false;
      this.removeNodeFromList(node, this.checkedNodes);
      cd.markForCheck();
    });
  }

  /**
   * Handle all visible descendants and check/uncheck them as well based on the node's checked status
   * @param node {TreeNode<T>}
   * @param isChecked {boolean}
   */
  private handleNodeCheckedDescendants(node: TreeNode<T>, isChecked: boolean): void {
    node.children.forEach(nodeChild => {
      const previouslyChecked = nodeChild.checked;
      nodeChild.checked = isChecked;
      if (isChecked && !previouslyChecked) {
        nodeChild.indeterminate = false;
        this.checkedNodes.push(nodeChild);
      } else if (previouslyChecked && !isChecked) {
        this.removeNodeFromList(nodeChild, this.checkedNodes);
        this.removeNodeFromList(nodeChild, this.partiallyCheckedNodes);
      } else if (isChecked && previouslyChecked && nodeChild.indeterminate) {
        nodeChild.indeterminate = false;
        this.checkedNodes.push(nodeChild);
      }
      this.handleNodeCheckedDescendants(nodeChild, isChecked);
    });
  }

  /**
   * Handle a nodes ancestors and their checked status
   * When a node has been checked, we check its parent and its siblings
   * if the rest of the siblings are also checked we check the parent now too
   * if at least one sibling is checked we partially check the parent now too
   * @param node {TreeNode<T>}
   */
  private handleNodeCheckedAncestors(node: TreeNode<T>): void {
    if (node.parent) {
      const totalChildren = node.parent.children.length;
      const checkedChildren = node.parent.children.filter(child => child.checked === true);
      const partialChildren = checkedChildren.filter(it => it.indeterminate === true);
      const checkedOnlyChildren = checkedChildren.length - partialChildren.length;
      node.parent.indeterminate = checkedChildren.length > 0 && checkedOnlyChildren < totalChildren;
      node.parent.checked = checkedChildren.length > 0;
      if (node.parent.checked && !node.parent.indeterminate) {
        if (!this.checkedNodes.find(it => it.id === node.parent.id)) {
          this.checkedNodes.push(node.parent);
        }
      } else {
        this.removeNodeFromList(node.parent, this.checkedNodes);
      }
      // parent is partially checked
      if (node.parent.checked && node.parent.indeterminate) {
        if (!this.partiallyCheckedNodes.find(it => it.id === node.parent.id)) {
          this.partiallyCheckedNodes.push(node.parent);
        }
      } else {
        this.removeNodeFromList(node.parent, this.partiallyCheckedNodes);
      }
      this.handleNodeCheckedAncestors(node.parent);
    }
  }

  /**
   * Handle any visible Server Side Children on node according to their parent being checked or unchecked
   * @param node {TreeNode<T>} parent node
   * @param shouldBeChecked {boolean} whether child should visually be checked/disabled
   */
  private handleVisibleServerSideChildren(node: TreeNode<T>, shouldBeChecked: boolean): void {
    node.children.forEach(child => {
      if (child.checked) {
        this.removeNodeFromList(child, this.checkedNodes);
      }
      child.checked = shouldBeChecked;
      child.disabled = shouldBeChecked;
      this.handleVisibleServerSideChildren(child, shouldBeChecked);
    });
  }

  /**
   * On Server Side some children may no longer be in the view but still checked so we remove any left over that were
   * descendants of the parent node
   * @param node {TreeNode<T>}
   */
  private handleNonVisibleServerSideChildren(node: TreeNode<T>): void {
    this.checkedNodes = this.checkedNodes.filter(checkedNode => {
      let ancestor = checkedNode.parent;
      let isAncestor = false;
      while (ancestor !== null) {
        isAncestor = ancestor.id === node.id;
        if (isAncestor) {
          break;
        }
        ancestor = ancestor.parent;
      }
      return !ancestor;
    });
  }

  /**
   * Get all descendants of a TreeNode
   * @param node {TreeNode<T>}
   * @param dataRetriever {TreeNodeDataRetriever<T>} client side data retriever only
   * @param createNode {(t: TreeNodeData<T>, p: TreeNode<T> | null) => TreeNode<T>}
   * @returns {Promise<Array<TreeNode<T>>>}
   */
  private async getAllDescendants(
    node: TreeNode<T>,
    dataRetriever: TreeNodeDataRetriever<T>,
    createNode: (t: TreeNodeData<T>, p: TreeNode<T> | null) => TreeNode<T>
  ): Promise<Array<TreeNode<T>>> {
    const hasChildren = await dataRetriever.hasChildNodes(node.data);
    if (hasChildren) {
      const treeNodeChildrenList = (await dataRetriever.getChildNodeData(node.data)).map(it => createNode(it, node));
      const childrenPromises = [];
      treeNodeChildrenList.forEach(treeNode => {
        childrenPromises.push(this.getAllDescendants(treeNode, dataRetriever, createNode));
      });
      const all = await Promise.all(childrenPromises).then(results => {
        const children = [];
        results.map(allLists => children.push(...allLists));
        return children;
      });
      return treeNodeChildrenList.concat(all);
    }
    return [];
  }

  /**
   * Get all currently visible TreeNodes of a parent from the TreeView UI
   * @param node {TreeNode<T>} node to get children from
   * @returns {Array<TreeNode<T>>} the flatten list of all children/descendants of the TreeNode
   */
  private getAllVisibleDescendants(node: TreeNode<T>): Array<TreeNode<T>> {
    return node.children.concat(...node.children.map(child => this.getAllVisibleDescendants(child)));
  }

  /**
   * Safely removes a Node from the partially checked or checked list array
   * @param node {TreeNode<T>} node to remove
   * @param list {Array<TreeNode<T>>} list of tree nodes
   */
  private removeNodeFromList(node: TreeNode<T>, list: Array<TreeNode<T>>): void {
    const index = list.findIndex(it => it.id === node.id);
    if (index >= 0) {
      list.splice(index, 1);
    }
  }

  /**
   * Uncheck all previously checked nodes
   * @param checkedNodes {Array<TreeNode<T>>}
   */
  private uncheckAllNodes(checkedNodes: Array<TreeNode<T>>): void {
    checkedNodes.forEach(it => {
      it.checked = false;
      it.indeterminate = false;
    });
  }
}
