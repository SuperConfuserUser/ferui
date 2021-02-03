import { Injectable } from '@angular/core';

import { FeruiUtils } from '../../../utils/ferui-utils';
import { FuiDatagridRowNode } from '../../components/entities/fui-datagrid-row-node';
import { FuiDatagridOptionsWrapperService } from '../datagrid-options-wrapper.service';
import { FuiDatagridEventService } from '../event.service';

@Injectable()
export class DatagridRowNodeManagerService {
  private nextId: number = 0;
  private allNodesMap: { [id: string]: FuiDatagridRowNode } = {};

  constructor(private datagridOptionsWrapper: FuiDatagridOptionsWrapperService, private eventService: FuiDatagridEventService) {}

  /**
   * Get a copy of nodes map.
   */
  getCopyOfNodesMap(): { [id: string]: FuiDatagridRowNode } {
    return FeruiUtils.cloneObject(this.allNodesMap);
  }

  /**
   * Create a FuiDatagridRowNode object using the data from the API.
   * @param dataItem
   */
  createNode(dataItem: any): FuiDatagridRowNode {
    const node = new FuiDatagridRowNode(this.datagridOptionsWrapper, this.eventService);
    node.setDataAndId(dataItem, this.nextId.toString());
    this.allNodesMap[node.id] = node;
    this.nextId++;
    return node;
  }

  /**
   * Set the rowData. This function will accept the raw data and map it to an array of RowNodes.
   * @param rowData
   * @param selectedRows
   */
  setRowData(rowData: any[], selectedRows: FuiDatagridRowNode[] = null): FuiDatagridRowNode[] {
    this.nextId = 0;
    this.allNodesMap = {};

    if (!rowData) {
      return;
    }

    const rowNodes: FuiDatagridRowNode[] = [];
    rowData.forEach(dataItem => {
      const node: FuiDatagridRowNode = this.createNode(dataItem);
      if (selectedRows && selectedRows.length > 0 && selectedRows.find(row => row.id === node.id)) {
        node.setSelected(true);
      }
      rowNodes.push(node);
    });
    return rowNodes;
  }
}
