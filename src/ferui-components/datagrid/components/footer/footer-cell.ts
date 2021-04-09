import { Subscription } from 'rxjs';

import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostBinding,
  Input,
  OnDestroy,
  OnInit,
  Self,
  TemplateRef,
  ViewChild
} from '@angular/core';

import { ColumnEvent, FuiDatagridEvents } from '../../events';
import { FuiDatagridDragAndDropService } from '../../services/datagrid-drag-and-drop.service';
import { FuiDatagridOptionsWrapperService } from '../../services/datagrid-options-wrapper.service';
import { FuiDatagridService } from '../../services/datagrid.service';
import { FuiDatagridEventService } from '../../services/event.service';
import { FuiColumnService } from '../../services/rendering/column.service';
import { FuiCssClassApplierService } from '../../services/rendering/css-class-applier.service';
import { FuiColumnDefinitions } from '../../types/column-definitions';
import { FuiDatagridFooterCellContext } from '../../types/footer-cell-context';
import { FuiDatagridBodyDropTarget } from '../entities/body-drop-target';
import { Column } from '../entities/column';

@Component({
  selector: 'fui-datagrid-footer-cell',
  template: `
    <ng-container
      #defaultContainer
      [ngTemplateOutlet]="isTemplateRef(footerCellTemplate) ? footerCellTemplate : defaultCellRenderer"
      [ngTemplateOutletContext]="footerCellTemplateContext"
    ></ng-container>
    <ng-template #defaultCellRenderer>
      <span
        class="fui-datagrid-footer-cell-wrapper"
        *ngIf="footerCellTemplate"
        [innerHTML]="footerCellTemplate | fuiSafeHtml"
      ></span>
    </ng-template>
  `,
  host: {
    '[class.fui-datagrid-footer-cell]': 'true',
    '[class.fui-datagrid-column-visible]': 'column?.isVisible()',
    '[class.with-animation]': 'true',
    '[class.moving]': 'column?.isMoving()'
  },
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FuiFooterCellComponent extends FuiDatagridBodyDropTarget implements OnInit, OnDestroy {
  @HostBinding('attr.role') role: string = 'gridcell';
  @HostBinding('attr.tabindex') tabindex: string = '-1';
  @HostBinding('style.width.px') width: number = 0;
  @HostBinding('style.min-width.px') minWidth: number = 0;
  @HostBinding('style.max-width.px') maxWidth: number = null;
  @HostBinding('style.line-height.px') lineHeight: number = null;

  @ViewChild('defaultCellRenderer', { read: TemplateRef }) cellRenderer: TemplateRef<any>;

  @Input() columnDefinition: FuiColumnDefinitions;

  datagridId: string;
  column: Column = null;

  // Default template variables.
  footerCellTemplate: TemplateRef<FuiDatagridFooterCellContext> | string;
  footerCellTemplateContext: FuiDatagridFooterCellContext;

  private subscriptions: Subscription[] = [];
  private _left: number = 0;
  private _rowHeight: number;

  constructor(
    @Self() public elementRef: ElementRef,
    private cd: ChangeDetectorRef,
    private cssClassApplier: FuiCssClassApplierService,
    private eventService: FuiDatagridEventService,
    private optionsWrapperService: FuiDatagridOptionsWrapperService,
    dragAndDropService: FuiDatagridDragAndDropService,
    protected columnService: FuiColumnService,
    gridPanel: FuiDatagridService
  ) {
    super(gridPanel.eBodyViewport, dragAndDropService, columnService, gridPanel);
  }

  @HostBinding('style.left.px')
  get left(): number {
    return this._left;
  }

  set left(value: number) {
    if (this._left !== value) {
      this._left = value;
      this.cd.markForCheck();
    }
  }

  get rowHeight(): number {
    return this._rowHeight;
  }

  @HostBinding('style.height.px')
  @Input()
  set rowHeight(value: number) {
    if (value !== this._rowHeight) {
      this._rowHeight = value;
      this.cd.markForCheck();
    }
  }

  ngOnInit(): void {
    this.subscriptions.push(
      this.eventService.listenToEvent(FuiDatagridEvents.EVENT_COLUMN_VISIBLE).subscribe((columnEvent: ColumnEvent) => {
        this.onEventAction(columnEvent, () => {
          this.column.setVisible(columnEvent.column.isVisible());
        });
      }),
      this.eventService.listenToEvent(FuiDatagridEvents.EVENT_WIDTH_CHANGED).subscribe((columnEvent: ColumnEvent) => {
        this.onEventAction(columnEvent, () => {
          this.width = columnEvent.column.getActualWidth();
        });
      }),
      this.eventService.listenToEvent(FuiDatagridEvents.EVENT_LEFT_CHANGED).subscribe((columnEvent: ColumnEvent) => {
        this.onEventAction(columnEvent, () => {
          this.left = columnEvent.column.getLeft();
        });
      })
    );
  }

  ngOnDestroy(): void {
    if (this.subscriptions.length > 0) {
      this.subscriptions.forEach(sub => sub.unsubscribe());
      this.subscriptions = undefined;
    }
  }

  /**
   * Returns whether or not the template is a TemplateRef.
   * @param template
   */
  isTemplateRef(template: TemplateRef<FuiDatagridFooterCellContext> | string): boolean {
    return template && template instanceof TemplateRef;
  }

  /**
   * Init the column only if it has not been init already.
   * @param column
   * @private
   */
  private initColumn(column: Column) {
    if (column && !this.column) {
      this.column = column;
      this.left = this.column.getLeft();
      this.width = this.column.getActualWidth();
      this.minWidth = this.column.getMinWidth();
      this.maxWidth = this.column.getMaxWidth();
      this.datagridId = this.optionsWrapperService.getDatagridId();

      if (this.rowHeight) {
        this.lineHeight = this.rowHeight - 1;
      }

      this.footerCellTemplateContext = {
        context: this.column.getFooterTemplateContext() || null,
        column: this.column
      };

      if (this.column.getFooterTemplate()) {
        this.footerCellTemplate = this.column.getFooterTemplate();
      }

      // Apply custom footer cell classes if any.
      this.cssClassApplier.addFooterClassesFromColDef(this.elementRef.nativeElement, this.column);

      this.cd.markForCheck();
    }
  }

  /**
   * Action to run on a specific column event.
   * @param columnEvent
   * @param callback
   * @private
   */
  private onEventAction(columnEvent: ColumnEvent, callback: () => void): void {
    if (columnEvent && columnEvent.column.field === this.columnDefinition.field) {
      this.initColumn(columnEvent.column);
      callback();
      this.cd.markForCheck();
    }
  }
}
