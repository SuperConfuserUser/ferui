import { Injectable } from '@angular/core';

import { FuiBodyCellComponent } from '../../components/body/body-cell';
import { FuiBodyRowComponent } from '../../components/body/body-row';
import { Column } from '../../components/entities/column';

@Injectable()
export class RowRendererService {
  private indexPrefix: string = 'bodyRow';
  // This variable will contains only the visible (rendered) rows not all the rows from data-source.
  private rowsByIndex: { [key: string]: FuiBodyRowComponent } = {};

  storeRowElement(rowIndex: number, rowElement: FuiBodyRowComponent): void {
    this.rowsByIndex[this.indexPrefix + rowIndex] = rowElement;
  }

  removeRowElement(rowIndex: number): void {
    delete this.rowsByIndex[this.indexPrefix + rowIndex];
  }

  getAllCellsForColumn(column: Column): FuiBodyCellComponent[] {
    const eCells: FuiBodyCellComponent[] = [];
    for (const key in this.rowsByIndex) {
      if (this.rowsByIndex.hasOwnProperty(key)) {
        const eCell = this.rowsByIndex[key].getCellForCol(column);
        if (eCell) {
          eCells.push(eCell);
        }
      }
    }
    return eCells;
  }

  /**
   * Return the row stored at the specified index.
   * @param index
   */
  getRowByIndex(index: number): FuiBodyRowComponent {
    return this.rowsByIndex[this.indexPrefix + index];
  }
}
