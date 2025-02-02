import { ChangeDetectionStrategy, Component, ContentChildren, HostBinding, OnInit, Optional, QueryList } from '@angular/core';

import { FuiDatagridOptionsWrapperService } from '../../services/datagrid-options-wrapper.service';
import { HeaderRendererService } from '../../services/rendering/header-renderer.service';

import { FuiHeaderCellComponent } from './header-cell';

@Component({
  selector: 'fui-datagrid-header-row',
  template: ` <ng-content select="fui-datagrid-header-cell"></ng-content> `,
  host: {
    '[class.fui-datagrid-header-row]': 'true',
    '[style.top.px]': '0'
  },
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FuiHeaderRowComponent implements OnInit {
  @HostBinding('attr.role') role: string = 'presentation';
  @HostBinding('style.height.px') headerHeight: number = 0;

  @ContentChildren(FuiHeaderCellComponent) cells: QueryList<FuiHeaderCellComponent>;

  constructor(
    @Optional() private headerRowRendererService: HeaderRendererService,
    @Optional() private optionsWrapperService: FuiDatagridOptionsWrapperService
  ) {}

  ngOnInit(): void {
    if (this.headerRowRendererService) {
      this.headerRowRendererService.storeRowElement(this);
    }
    if (this.optionsWrapperService && this.optionsWrapperService.gridOptions) {
      this.headerHeight = this.optionsWrapperService.gridOptions.headerHeight;
    }
  }
}
