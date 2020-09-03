import { Injectable } from '@angular/core';

import { Column } from '../../components/entities/column';
import { FuiHeaderCellComponent } from '../../components/header/header-cell';
import { FuiHeaderRowComponent } from '../../components/header/header-row';

@Injectable()
export class HeaderRendererService {
  private headerRow: FuiHeaderRowComponent;

  public storeRowElement(rowElement: FuiHeaderRowComponent): void {
    this.headerRow = rowElement;
  }

  getCellForCol(column: Column): FuiHeaderCellComponent {
    let cell: FuiHeaderCellComponent = null;
    this.headerRow.cells.forEach(item => {
      if (item.colId === column.getId()) {
        cell = item;
      }
    });

    return cell;
  }

  public getCellForColumn(column: Column): FuiHeaderCellComponent {
    return this.getCellForCol(column);
  }
}
