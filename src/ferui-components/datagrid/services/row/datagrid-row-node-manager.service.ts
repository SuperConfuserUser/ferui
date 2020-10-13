import { Injectable } from '@angular/core';

import { FeruiUtils } from '../../../utils/ferui-utils';
import { RowNode } from '../../components/entities/row-node';
import { FuiDatagridOptionsWrapperService } from '../datagrid-options-wrapper.service';
import { FuiDatagridEventService } from '../event.service';

@Injectable()
export class DatagridRowNodeManagerService {
  private nextId: number = 0;
  private allNodesMap: { [id: string]: RowNode } = {};

  constructor(private datagridOptionsWrapper: FuiDatagridOptionsWrapperService, private eventService: FuiDatagridEventService) {}

  /**
   * Get a copy of nodes map.
   */
  getCopyOfNodesMap(): { [id: string]: RowNode } {
    return FeruiUtils.cloneObject(this.allNodesMap);
  }

  /**
   * Create a RowNode object using the data from the API.
   * @param dataItem
   */
  createNode(dataItem: any): RowNode {
    const node = new RowNode(this.datagridOptionsWrapper, this.eventService);
    node.setDataAndId(dataItem, this.nextId.toString());
    this.allNodesMap[node.id] = node;
    this.nextId++;
    return node;
  }

  /**
   * Set the rowData. This function will accept the raw data and map it to an array of RowNodes.
   * @param rowData
   */
  setRowData(rowData: any[]): RowNode[] {
    this.nextId = 0;
    this.allNodesMap = {};

    if (!rowData) {
      return;
    }
    const rowNodes: RowNode[] = [];
    rowData.forEach(dataItem => {
      const node = this.createNode(dataItem);
      rowNodes.push(node);
    });
    return rowNodes;
  }
}
