import { Subscription } from 'rxjs';

import { Injectable } from '@angular/core';

import { FeruiUtils } from '../../../utils/ferui-utils';
import { FuiDatagridRowNode } from '../../components/entities/fui-datagrid-row-node';
import { RowModel } from '../../components/row-models/row-model';
import { FuiDatagridEvents, RowSelectedEvent, SelectionChangedEvent } from '../../events';
import { FuiRowSelectionEnum } from '../../types/row-selection.enum';
import { FuiDatagridOptionsWrapperService } from '../datagrid-options-wrapper.service';
import { FuiDatagridEventService } from '../event.service';

@Injectable()
export class FuiDatagridRowSelectionService {
  // Whether or not the service has been initialised. Useful if you want to know if you need to destroy it.
  initialized: boolean = false;
  rowSelection: FuiRowSelectionEnum;

  private selectedNodes: { [key: string]: FuiDatagridRowNode } = {};
  private subscriptions: Subscription[] = [];
  private partialSelection: boolean = true;
  private allFilteredSelected: boolean | null = null;
  private runningInBackground;

  constructor(
    private eventService: FuiDatagridEventService,
    private optionsWrapperService: FuiDatagridOptionsWrapperService,
    private rowModel: RowModel
  ) {}

  /**
   * Initialise the selected nodes.
   * @param selectedNodes
   */
  initSelectedNodes(selectedNodes: FuiDatagridRowNode[]): void {
    if (!selectedNodes || (selectedNodes && selectedNodes.length === 0)) {
      return;
    }
    selectedNodes.forEach(selectedNode => {
      selectedNode.setSelected(true, false);
      this.selectedNodes[selectedNode.id] = selectedNode;
    });
    this.dispatchRowSelectionChanged();
  }

  /**
   * Initialize the service.
   * @param rowSelection
   */
  init(rowSelection: FuiRowSelectionEnum): void {
    this.rowSelection = rowSelection;
    this.initialized = true;
    this.subscriptions.push(
      this.eventService.listenToEvent(FuiDatagridEvents.EVENT_ROW_SELECTED).subscribe(this.onRowSelected.bind(this)),
      this.eventService.listenToEvent(FuiDatagridEvents.EVENT_FILTER_CHANGED).subscribe(this.updateSelectedFiltered.bind(this))
    );
  }

  /**
   * Remove all listeners when we destroy the service.
   */
  destroy(): void {
    this.reset();
    this.initialized = false;
    this.subscriptions.forEach(sub => sub.unsubscribe());
    this.subscriptions = [];
  }

  /**
   * Reset the service.
   */
  reset(): void {
    this.selectedNodes = {};
    this.partialSelection = true;
  }

  /**
   * Select all possible rows.
   */
  selectAll(): void {
    if (this.rowModel.isClientSideRowModel() && this.rowModel.getRowCount() === 0) {
      return;
    }
    let totalRows: FuiDatagridRowNode[] = [];
    if (this.rowModel.isClientSideRowModel()) {
      const nodesMap: { [id: string]: FuiDatagridRowNode } = this.rowModel.getClientSideRowModel().getCopyOfNodesMap();
      for (const nodesMapKey in nodesMap) {
        if (nodesMap.hasOwnProperty(nodesMapKey)) {
          const rowNode: FuiDatagridRowNode = nodesMap[nodesMapKey];
          if (rowNode.selectable) {
            totalRows.push(rowNode);
          }
        }
      }
    } else {
      totalRows = this.rowModel.getDisplayedRows().filter(rowNode => rowNode.selectable === true);
    }
    totalRows.forEach(row => {
      row.setSelected(true, false);
      this.selectedNodes[row.id] = row;
    });
    this.partialSelection = false;
    this.dispatchRowSelectionChanged(true);
  }

  /**
   * Deselect all previously selected rows.
   */
  deselectAll(): void {
    this.partialSelection = true;
    this.deselectRows();
    this.dispatchRowSelectionChanged(true);
  }

  /**
   * Deselect only the currently filtered rows.
   */
  deselectFiltered(): void {
    this.partialSelection = true;
    this.rowModel
      .getDisplayedRows()
      .filter(rowNode => rowNode.selectable === true)
      .forEach(row => {
        row.setSelected(false, false);
        this.deselectNode(row);
      });
    this.dispatchRowSelectionChanged();
  }

  /**
   * Select only the currently filtered rows.
   */
  selectFiltered(): void {
    this.partialSelection = true;
    this.rowModel
      .getDisplayedRows()
      .filter(rowNode => rowNode.selectable === true)
      .forEach(row => {
        row.setSelected(true, false);
        this.selectNode(row);
      });
    this.dispatchRowSelectionChanged();
  }

  /**
   * Whether or not a row is selected.
   * @param rowId
   */
  isNodeSelected(rowId: string): boolean {
    return FeruiUtils.isKeyExistIn(this.selectedNodes, rowId);
  }

  /**
   * Get the count value of all selected rows.
   */
  getSelectionCount(): number {
    return Object.keys(this.selectedNodes).length;
  }

  /**
   * Check whether or not we have partially selected all rows.
   */
  isPartialSelection(): boolean {
    // We check if the count of selected items is equal to the count of totalRows we have in datagrid.
    const totalRows: number | null = this.rowModel.isClientSideRowModel()
      ? this.rowModel.getClientSideRowModel().getTotalRowCount()
      : this.rowModel.getRowCount();
    return !FeruiUtils.isNullOrUndefined(totalRows) ? !(totalRows <= this.getSelectionCount()) : this.partialSelection;
  }

  /**
   * Get the selected RowNodes.
   */
  getSelectedNodes(): FuiDatagridRowNode[] {
    const selectedNodes: FuiDatagridRowNode[] = [];
    for (const nodeId in this.selectedNodes) {
      if (this.selectedNodes.hasOwnProperty(nodeId)) {
        selectedNodes.push(this.selectedNodes[nodeId]);
      }
    }
    return selectedNodes;
  }

  /**
   * Get the selected rows data.
   */
  getSelectedRows(): any[] {
    const selectedData: any[] = [];
    for (const nodeId in this.selectedNodes) {
      if (this.selectedNodes.hasOwnProperty(nodeId)) {
        selectedData.push(this.selectedNodes[nodeId].data);
      }
    }
    return selectedData;
  }

  /**
   * Whether or not all filtered items are selected.
   */
  isAllFilteredSelected(): boolean {
    return !!this.allFilteredSelected;
  }

  /**
   * Deselect all rows.
   * @private
   */
  private deselectRows(): void {
    if (Object.keys(this.selectedNodes).length > 0) {
      for (const id in this.selectedNodes) {
        if (this.selectedNodes.hasOwnProperty(id)) {
          this.selectedNodes[id].setSelected(false, false);
        }
      }
    }
    this.selectedNodes = {};
  }

  /**
   * Select a specific row.
   * @param rowNode
   * @private
   */
  private selectNode(rowNode: FuiDatagridRowNode): void {
    if (this.optionsWrapperService.getRowSelection() === FuiRowSelectionEnum.SINGLE) {
      this.deselectRows();
    }
    this.selectedNodes[rowNode.id] = rowNode;
    if (this.rowModel.isClientSideRowModel() && Object.keys(this.selectedNodes).length === this.rowModel.getRowCount()) {
      this.partialSelection = false;
    }
  }

  /**
   * Deselect a specific FuiDatagridRowNode.
   * @param rowNode
   * @private
   */
  private deselectNode(rowNode: FuiDatagridRowNode): void {
    this.partialSelection = true;
    this.selectedNodes[rowNode.id] = undefined;
    delete this.selectedNodes[rowNode.id];
  }

  /**
   * Callback function called whenever a row is selected.
   * This function will select/deselected the specific row.
   * @param event
   * @private
   */
  private onRowSelected(event: RowSelectedEvent): void {
    const rowNode = event.rowNode;
    if (!rowNode.selectable) {
      return;
    }
    if (rowNode.selected) {
      this.selectNode(rowNode);
    } else {
      this.deselectNode(rowNode);
    }
    this.dispatchRowSelectionChanged();
  }

  /**
   * Dispatch the EVENT_SELECTION_CHANGED event.
   * @private
   */
  private dispatchRowSelectionChanged(selectAll: boolean = false): void {
    const evt: SelectionChangedEvent = {
      type: FuiDatagridEvents.EVENT_SELECTION_CHANGED,
      selectedItems: this.selectedNodes
    };
    this.eventService.dispatchEvent(evt);
    // If we select (or deselect) everything, there is no need to call the updateSelectedFiltered function.
    // Instead, we just reset allFilteredSelected variable to null (default value).
    if (!selectAll) {
      // Run this in the background.
      this.updateSelectedFiltered();
    } else {
      this.allFilteredSelected = null;
    }
  }

  /**
   * Update the allFilteredSelected variable and set it to true if all filtered rows are selected.
   * NOTE: Because of its purpose, this method can take some time to run. You should call this function only once after the
   * filters has changed.
   * @private
   */
  private updateSelectedFiltered(): void {
    if (this.runningInBackground) {
      clearTimeout(this.runningInBackground);
    }
    this.runningInBackground = setTimeout(() => {
      let allFilteredSelected = true;
      for (const rowNode of this.rowModel.getDisplayedRows()) {
        if (rowNode.selectable && this.getSelectedNodes().indexOf(rowNode) === -1) {
          allFilteredSelected = false;
          break;
        }
      }
      this.allFilteredSelected = allFilteredSelected;
    }, 0);
  }
}
