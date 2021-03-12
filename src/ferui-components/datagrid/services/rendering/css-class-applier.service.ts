import { Injectable, Renderer2 } from '@angular/core';

import { Column } from '../../components/entities/column';
import { FuiDatagridRowNode } from '../../components/entities/fui-datagrid-row-node';
import { FuiDatagridCellClassParams } from '../../types/column-definitions';
import { FuiDatagridOptionsWrapperService } from '../datagrid-options-wrapper.service';

/**
 * Service to facilitate the addition of a class to a Datagrid element
 */
@Injectable()
export class FuiCssClassApplierService {
  constructor(private datagridOptionsWrapper: FuiDatagridOptionsWrapperService, private renderer: Renderer2) {}

  /**
   * Add class(es) to datagrid header cell.
   * @param appliedTo
   * @param column
   */
  addHeaderClassesFromColDef(appliedTo: HTMLElement, column: Column): void {
    this.addClassesToElement(column.getColumnDefinition().headerClass, appliedTo, column);
  }

  /**
   * Add class(es) to datagrid body cell.
   * @param appliedTo
   * @param column
   * @param rowNode
   */
  addCellClassesFromColDef(appliedTo: HTMLElement, column: Column, rowNode: FuiDatagridRowNode): void {
    this.addClassesToElement(column.getColumnDefinition().cellClass, appliedTo, column, rowNode);
  }

  /**
   * Generic function that add class(es) coming from the columnDefinition to the desired html element.
   * @param colDefClass
   * @param appliedTo
   * @param column
   * @param rowNode
   * @private
   */
  private addClassesToElement(
    colDefClass: string | string[] | ((params: FuiDatagridCellClassParams) => string | string[]),
    appliedTo: HTMLElement,
    column: Column,
    rowNode?: FuiDatagridRowNode
  ): void {
    if (colDefClass) {
      let classOrClasses: string | string[];

      if (typeof colDefClass === 'function') {
        classOrClasses = colDefClass(this.getDatagridCellClassParams(column, rowNode));
      } else {
        classOrClasses = colDefClass;
      }

      if (Array.isArray(classOrClasses)) {
        classOrClasses.forEach(cssClass => {
          this.renderer.addClass(appliedTo, cssClass);
        });
      } else {
        this.renderer.addClass(appliedTo, classOrClasses);
      }
    }
  }

  /**
   * Format/get the params object to use as a function argument to get the class (allowing conditional class addition)
   * @param column
   * @param rowNode
   * @private
   */
  private getDatagridCellClassParams(column: Column, rowNode?: FuiDatagridRowNode): FuiDatagridCellClassParams {
    return {
      // The row (from the rowData array, where value was taken) been rendered.
      data: rowNode ? rowNode.data : null,
      // The node associated to this row
      node: rowNode ? rowNode : null,
      // The index of the row about to be rendered
      rowIndex: rowNode ? rowNode.rowIndex : null,
      // The column definition been rendered
      colDef: column.getColumnDefinition(),
      // The value to be rendered.
      value: rowNode ? rowNode.data[column.field] : null
    };
  }
}
