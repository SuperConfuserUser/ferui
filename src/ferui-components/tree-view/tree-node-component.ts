import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DoCheck,
  ElementRef,
  EventEmitter,
  HostBinding,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  Self,
  SimpleChanges,
  TemplateRef,
  ViewChild
} from '@angular/core';

import { DomObserver, ObserverInstance } from '../utils/dom-observer/dom-observer';
import { FeruiUtils } from '../utils/ferui-utils';
import { ScrollbarHelper } from '../utils/scrollbar-helper/scrollbar-helper.service';

import {
  FuiTreeviewNodeSelectionEnum,
  PagedTreeNodeDataRetriever,
  TreeNode,
  TreeNodeDataRetriever,
  TreeNodeEvent,
  TreeViewColorTheme,
  TreeViewConfiguration,
  TreeViewEventType
} from './interfaces';
import { TREE_VIEW_INDENTATION_PADDING } from './internal-interfaces';
import { FuiTreeViewMultiSelectService } from './tree-view-multi-select-service';
import { FuiTreeViewUtilsService } from './tree-view-utils-service';

// To understand why we disabled this tslint rule
// See https://stackoverflow.com/questions/39233650/can-you-use-both-onchanges-and-docheck-in-an-angular-2-component?answertab=active#tab-top
/* tslint:disable:no-conflicting-lifecycle */
@Component({
  selector: 'fui-tree-node',
  template: `
    <div class="fui-node-tree" (click)="onSelected()" [ngClass]="{ 'node-tree-selected': node.selected }">
      <div [style.padding-left.px]="padding" class="node-tree" #nodetree>
        <span *ngIf="hasChildren" class="icon-template" (click)="onExpand()">
          <ng-container
            [ngTemplateOutlet]="getIconTemplate() ? getIconTemplate() : defaultIconTemplate"
            [ngTemplateOutletContext]="{ node: node }"
          ></ng-container>
          <ng-template #defaultIconTemplate let-node="node">
            <clr-icon class="expand-icon" *ngIf="node.expanded" shape="fui-less"></clr-icon>
            <clr-icon class="expand-icon" *ngIf="!node.expanded" shape="fui-add"></clr-icon>
          </ng-template>
        </span>
        <span class="label">
          <input
            type="checkbox"
            fuiCheckbox
            *ngIf="treeviewConfig.nodeSelection === selectionType.MULTIPLE && !multiSelectSingleSelection"
            [name]="node.id"
            (ngModelChange)="onChecked()"
            [(ngModel)]="node.checked"
            [disabled]="node.disabled || isNodeUnselectable()"
            [indeterminate]="node.indeterminate"
          />
          <input
            type="radio"
            fuiRadio
            *ngIf="treeviewConfig.nodeSelection === selectionType.SINGLE && multiSelectSingleSelection"
            [value]="true"
            [name]="node.id"
            (click)="onChecked()"
            [(ngModel)]="node.checked"
            [disabled]="node.disabled || isNodeUnselectable()"
          />
          <ng-container
            [ngTemplateOutlet]="getNodeTemplate() ? getNodeTemplate() : defaultNodeRenderer"
            [ngTemplateOutletContext]="{ node: node }"
          ></ng-container>
          <ng-template #defaultNodeRenderer let-node="node">
            <span>{{ node.data.nodeLabel }}</span>
          </ng-template>
        </span>
      </div>
    </div>
    <div [style.margin-left.px]="padding + indentationPadding" #nodeError>
      <clr-icon *ngIf="node.showLoader" class="fui-loader-animation" shape="fui-spinner"></clr-icon>
      <clr-icon *ngIf="node.loadError" class="fui-error-icon" shape="fui-error" aria-hidden="true"></clr-icon>
      <span *ngIf="node.loadError" class="error-msg">Couldn't load content</span>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FuiTreeNodeComponent<T> implements OnInit, OnDestroy, DoCheck, OnChanges {
  @Output() readonly onNodeEvent: EventEmitter<TreeNodeEvent<T>> = new EventEmitter<TreeNodeEvent<T>>();
  @Output() readonly onFirstLevelNodeHasChildren: EventEmitter<boolean> = new EventEmitter<boolean>();

  @Input() node: TreeNode<T>;
  @Input() theme: TreeViewColorTheme;
  @Input() dataRetriever: TreeNodeDataRetriever<T> | PagedTreeNodeDataRetriever<T>;
  @Input() treeviewConfig: TreeViewConfiguration;
  @Input() siblingHasChildren: boolean;

  @HostBinding('class') themeClass;
  @HostBinding('class.fui-tree-node-component') nodeComponent: boolean = true;
  @HostBinding('class.borders') @Input() borders: boolean = false;

  @ViewChild('nodetree', { read: ElementRef }) nodeTreeElement: ElementRef;

  @ViewChild('nodeError', { read: ElementRef }) nodeErrorElement: ElementRef;

  // Hierarchical level to show parent-child relationship
  level: number = 0;
  // Indicates node can be expanded
  hasChildren: boolean = false;
  // left padding dependent of node tree hierarchical level
  padding: number;
  indentationPadding: number = TREE_VIEW_INDENTATION_PADDING;
  multiSelectSingleSelection: boolean; // if on selection feature check if node should have radio button or checkbox
  selectionType: typeof FuiTreeviewNodeSelectionEnum = FuiTreeviewNodeSelectionEnum;

  private domObservers: ObserverInstance[] = [];
  private errorWidthChange: boolean;

  constructor(
    @Self() private element: ElementRef,
    private scrollbarHelper: ScrollbarHelper,
    private cd: ChangeDetectorRef,
    private treeViewUtils: FuiTreeViewUtilsService,
    private fuiTreeViewMultiSelectService: FuiTreeViewMultiSelectService<T>
  ) {}

  /**
   * Initiates Tree Node component by setting its hierarchical level
   * based on the number of parents it has and if any node has any children
   */
  ngOnInit() {
    this.themeClass = this.theme;
    let parent = this.node.parent;
    while (parent != null) {
      parent = parent.parent;
      this.level++;
    }
    if (this.treeviewConfig.nodeSelection) {
      this.multiSelectSingleSelection =
        this.fuiTreeViewMultiSelectService.getNodeSelection() === FuiTreeviewNodeSelectionEnum.SINGLE;
      if (
        this.fuiTreeViewMultiSelectService.isAutoCheck() &&
        this.fuiTreeViewMultiSelectService.getNodeSelection() !== FuiTreeviewNodeSelectionEnum.SINGLE
      ) {
        // Check if parent is checked, then we check node as well
        if (this.node.parent && this.node.parent.checked && !this.node.parent.indeterminate) {
          this.node.checked = true;
        }
      } else if (this.dataRetriever.hasOwnProperty('getPagedChildNodeData')) {
        // On Server Side select if parent is checked, we check and disable child
        if (this.node.parent && this.node.parent.checked && this.fuiTreeViewMultiSelectService.getDisableChildren()) {
          this.node.checked = true;
          this.node.disabled = true;
        }
      }
    }
    this.dataRetriever.hasChildNodes(this.node.data).then((hasChildren: boolean) => {
      this.hasChildren = hasChildren;
      if (this.level === 0) {
        this.onFirstLevelNodeHasChildren.emit(this.hasChildren);
      }
      this.setVirtualScrollerWidth();
    });

    // Once the node is visible on screen we need to re-calculate the virtual scroller width.
    const headerViewport: Element = this.element.nativeElement;
    this.domObservers.push(
      DomObserver.observe(headerViewport, entities => {
        entities.forEach(entity => {
          if (entity.isIntersecting) {
            this.setVirtualScrollerWidth();
          }
        });
      })
    );
  }

  /**
   * Checks to ensure node is updated.
   * DoCheck needed since parent component constantly changes input {showLoader, loadError and selected} properties
   */
  ngDoCheck(): void {
    this.handlePossibleNodeErrorWidth();
    this.cd.markForCheck();
  }

  ngOnDestroy() {
    this.domObservers.forEach(observerInstance => DomObserver.unObserve(observerInstance));
    this.domObservers = undefined;
  }

  /**
   * On any input siblingHasChildren property change of nodes, we will recalculate padding
   * @param changes
   */
  ngOnChanges(changes: SimpleChanges) {
    if (changes.siblingHasChildren) {
      this.padding = this.calculatePadding();
    }
  }

  /**
   * Invokes the node event based on the host Tree Node and its expanded or collapsed state
   */
  onExpand(): void {
    this.onNodeEvent.emit({
      getNode: () => {
        return this.node;
      },
      getType: () => {
        return !this.node.expanded ? TreeViewEventType.NODE_EXPANDED : TreeViewEventType.NODE_COLLAPSED;
      }
    });
  }

  /**
   * Invokes the node event based on the host Tree Node click event
   */
  onSelected(): void {
    this.onNodeEvent.emit({
      getNode: () => {
        return this.node;
      },
      getType: () => {
        return TreeViewEventType.NODE_CLICKED;
      }
    });
  }

  /**
   * Invokes the node event based on the host Tree Node and its checked or unchecked state
   */
  onChecked(): void {
    this.onNodeEvent.emit({
      getNode: () => {
        return this.node;
      },
      getType: () => {
        // we first check if checkbox was partially checked
        if (this.node.indeterminate) {
          return TreeViewEventType.NODE_UNCHECKED;
        }
        return !this.node.checked ? TreeViewEventType.NODE_CHECKED : TreeViewEventType.NODE_UNCHECKED;
      }
    });
  }

  /**
   * Gets the icon template reference the developer can use on a Tree Node with its current state
   */
  getIconTemplate(): TemplateRef<any> | null {
    return this.dataRetriever.hasOwnProperty('getIconTemplate') ? this.dataRetriever.getIconTemplate() : null;
  }

  /**
   * Gets the node template reference the developer can use on the Tree Node with its current state
   */
  getNodeTemplate(): TemplateRef<any> | null {
    return this.dataRetriever.hasOwnProperty('getNodeTemplate') ? this.dataRetriever.getNodeTemplate() : null;
  }

  /**
   * If on multi-select feature, we check if developer wish to make a node unselectable
   */
  isNodeUnselectable(): boolean {
    return this.dataRetriever.hasOwnProperty('isNodeUnselectable')
      ? this.dataRetriever.isNodeUnselectable(this.node.data)
      : false;
  }

  /**
   * Calculates the needed padding based on nodes level and if it has children
   * 20 for the indentation pixels per level
   * 10 pixels if has children to add equal 5 pixel margin around icon
   * 30 pixels if no children to add margin from beginning of node text to beginning of left hand tree view
   */
  private calculatePadding(): number {
    // On first level, we check if any sibling nodes have children, if not we only add 10px padding and not 30 for icons
    const padding = this.level === 0 ? (this.siblingHasChildren ? 30 : 10) : 30;
    return this.hasChildren ? this.level * this.indentationPadding + 10 : this.level * this.indentationPadding + padding;
  }

  /**
   * Set virtual scroller width depending on node width or config width.
   */
  private setVirtualScrollerWidth() {
    this.padding = this.calculatePadding();
    // At this particular time the view isn't updated fast enough so we calculate the node width to include:
    // Node text width, padding and if icons exists take a value of 16 into consideration
    const iconPadding = this.hasChildren ? 16 : 0;
    this.node.width = this.getNodeWidth() + iconPadding + this.padding + this.indentationPadding;
    const configWidth: number = this.treeviewConfig ? parseInt(this.treeviewConfig.width, 10) : 0;
    // For users with scrollbars visible, we need to take the scrollbar width into account.
    const scrollbarWidth: number = this.scrollbarHelper.getWidth();
    this.treeViewUtils.virtualScrollerWidth =
      configWidth > this.node.width
        ? this.borders
          ? configWidth
          : configWidth - (this.indentationPadding + scrollbarWidth)
        : this.node.width;
    // 20 = 2 times padding of 10px.
    this.cd.markForCheck();
  }

  /**
   * Gets the Node Tree width
   * Take the nodeLabel width only as we add icon padding on the setVirtualScrollerWidth method
   */
  private getNodeWidth(): number {
    return this.nodeTreeElement.nativeElement.children[1]
      ? this.nodeTreeElement.nativeElement.children[1].offsetWidth
      : this.nodeTreeElement.nativeElement.children[0].offsetWidth;
  }

  /**
   * Handle any possible width change the tree node may need if the error message shows up
   * Reset widths if previously changed by an error
   */
  private handlePossibleNodeErrorWidth(): void {
    // XXX: FER-93 We need to change the way we display the treeNodes within the Treeview to rely on pure HTML + CSS
    // The only part that should be added via JS is the padding left (since we need to know about the data hierarchy)
    if (this.node.loadError && !this.errorWidthChange) {
      const errorNodeWidth = FeruiUtils.getPreferredWidthForItem(
        this.nodeErrorElement.nativeElement,
        this.nodeTreeElement.nativeElement,
        20 + this.padding + this.indentationPadding
      );
      if (errorNodeWidth > this.treeViewUtils.virtualScrollerWidth) {
        this.node.width = this.treeViewUtils.virtualScrollerWidth = errorNodeWidth;
        this.errorWidthChange = true;
      }
    } else if (!this.node.loadError && this.errorWidthChange) {
      this.node.width = this.getNodeWidth() + (this.hasChildren ? 16 : 0) + this.padding + this.indentationPadding;
      this.treeViewUtils.defaultScrollerWidth = Number(this.treeviewConfig.width);
      this.treeViewUtils.treeViewScrollWidthChange.emit();
      this.errorWidthChange = false;
    }
  }
}
