/**
 * NgStyles interface that component styles interface extends.
 */
interface NgStyles {
  [p: string]: string;
}
/**
 * Tree View Component Styles Interface
 */
export interface FuiTreeViewComponentStyles extends NgStyles {
  width: string;
  height: string;
}

/**
 * Wrapped Promise Interface to cancel Promise
 */
export interface WrappedPromise<T> extends Promise<T> {
  cancel: () => void;
}

/**
 * Tree View design indent padding for tree nodes
 */
export const TREE_VIEW_INDENTATION_PADDING: number = 20;
