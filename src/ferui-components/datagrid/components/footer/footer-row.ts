import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, HostBinding, Input, OnInit, Self } from '@angular/core';
import { DomSanitizer, SafeStyle } from '@angular/platform-browser';

import { FuiDatagridService } from '../../services/datagrid.service';

@Component({
  selector: 'fui-datagrid-footer-row',
  template: ` <div class="fui-datagrid-footer-row-clipper" [style.width.px]="clipperWidth" [style.height.px]="clipperHeight">
    <ng-content select="fui-datagrid-footer-cell"></ng-content>
  </div>`,
  host: {
    '[class.fui-datagrid-footer-row]': 'true',
    '[style.height]': 'rowHeightStr'
  },
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FuiFooterRowComponent implements OnInit, AfterViewInit {
  @HostBinding('attr.role') role: string = 'row';

  @Input()
  clipperHeight: number = 0;

  @Input()
  set scrollSize(value: number) {
    this._scrollSize = value;
    this.updateRowHeight();
  }

  get scrollSize(): number {
    return this._scrollSize;
  }

  @Input()
  clipperWidth: number = 0;

  // This variable need to be public since it is used within the template.
  rowHeightStr: SafeStyle;

  private _scrollSize: number = 0;

  constructor(@Self() private elementRef: ElementRef, private gridPanel: FuiDatagridService, private sanitizer: DomSanitizer) {}

  ngOnInit() {
    this.updateRowHeight();
  }

  ngAfterViewInit() {
    this.gridPanel.eFooterViewport = this.elementRef.nativeElement;
  }

  /**
   * Update the row height depending on the scrollbar size.
   * @private
   */
  private updateRowHeight(): void {
    this.rowHeightStr = this.sanitizer.bypassSecurityTrustStyle('calc(100% + ' + this.scrollSize + 'px)');
  }
}
