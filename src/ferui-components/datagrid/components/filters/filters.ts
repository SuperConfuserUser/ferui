import { AfterViewInit, Component, ElementRef, EventEmitter, Input, Output, Self } from '@angular/core';

@Component({
  selector: 'fui-datagrid-filters',
  template: `
    <div class="container-fluid">
      <div class="row">
        <div class="col-auto col-left">
          <fui-datagrid-search-filter-button *ngIf="displayFilters"></fui-datagrid-search-filter-button>
        </div>
        <div class="col col-right">
          <fui-datagrid-filter-column-visibility *ngIf="displayColumnVisibility"></fui-datagrid-filter-column-visibility>
          <ng-content></ng-content>
        </div>
      </div>
    </div>
  `,
  host: {
    class: 'fui-datagrid-filters'
  }
})
export class FuiDatagridFiltersComponent implements AfterViewInit {
  @Output() readonly heightChange: EventEmitter<number> = new EventEmitter<number>();

  @Input() displayFilters: boolean = true;
  @Input() displayColumnVisibility: boolean = true;

  private _height: number = 0;

  constructor(@Self() public elementRef: ElementRef) {}

  ngAfterViewInit(): void {
    this.height = this.elementRef.nativeElement.offsetHeight;
  }

  //////////// PUBLIC API ////////////
  get height(): number {
    return this._height;
  }

  /**
   * Set the component height
   * @param value
   */
  set height(value: number) {
    if (this._height !== value) {
      this._height = value;
      this.heightChange.emit(this._height);
    }
  }

  getElementHeight(): number {
    return this.height;
  }
}
