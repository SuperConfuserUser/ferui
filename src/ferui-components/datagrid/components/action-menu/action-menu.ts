import { Subscription } from 'rxjs';

import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  HostBinding,
  HostListener,
  Input,
  OnDestroy,
  TemplateRef
} from '@angular/core';

import { FuiDatagridEvents } from '../../events';
import { FuiActionMenuService } from '../../services/action-menu/action-menu.service';
import { FuiDatagridOptionsWrapperService } from '../../services/datagrid-options-wrapper.service';
import { FuiDatagridEventService } from '../../services/event.service';
import { FuiDatagridRowSelectionService } from '../../services/selection/datagrid-row-selection.service';
import { FuiDatagridBodyRowContext } from '../../types/body-row-context';

@Component({
  selector: 'fui-datagrid-action-menu',
  template: `
    <ng-container
      *ngIf="getContextForActionMenu().rowNode && getContextForActionMenu().rowNode.data"
      [ngTemplateOutlet]="actionMenuTemplate"
      [ngTemplateOutletContext]="getContextForActionMenu()"
    ></ng-container>
  `,
  host: {
    '[class.fui-datagrid-body-row-action-menu]': 'true',
    '[class.fui-datagrid-action-menu-visible]': 'isActionMenuVisible || isActionMenuDropdownOpen',
    '[class.fui-datagrid-action-menu-open]': 'isActionMenuDropdownOpen',
    '[class.fui-row-selected]': 'isRowSelected'
  },
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FuiDatagridActionMenuComponent implements OnDestroy {
  @Input('actionMenuTemplate') actionMenuTemplate: TemplateRef<FuiDatagridBodyRowContext>;
  @Input() maxDisplayedRows: number;

  isActionMenuVisible: boolean = false;
  isActionMenuDropdownOpen: boolean = false;
  isRowSelected: boolean = false;

  private defaultX: number = 0;
  private defaultY: number = 0;
  private defaultZ: number = 0;
  private subscriptions: Subscription[] = [];
  private _actionMenuTopValue: string = `translate3d(${this.defaultX}px, ${this.defaultY}, ${this.defaultZ})`;
  private forceClose: boolean = false;

  constructor(
    private actionMenuService: FuiActionMenuService,
    private eventService: FuiDatagridEventService,
    private rowSelectionService: FuiDatagridRowSelectionService,
    private cd: ChangeDetectorRef,
    private datagridOptionsWrapper: FuiDatagridOptionsWrapperService
  ) {
    this.isActionMenuVisible = this.actionMenuService.isActionMenuVisible;
    this.isActionMenuDropdownOpen = this.actionMenuService.isActionMenuDropdownOpen;
    this.subscriptions.push(
      this.eventService.listenToEvent(FuiDatagridEvents.EVENT_SELECTION_CHANGED).subscribe(() => {
        this.toggleRowSelection();
        this.cd.markForCheck();
      }),
      this.actionMenuService.actionMenuVisibilityChange().subscribe(isVisible => {
        this.isActionMenuVisible = isVisible;
        this.toggleRowSelection();
        this.cd.markForCheck();
      }),
      this.actionMenuService.actionMenuOpenChange().subscribe(isOpen => {
        this.isActionMenuDropdownOpen = isOpen;
        this.forceClose = !isOpen;
        this.cd.markForCheck();
      }),
      this.actionMenuService.selectedRowContextChange().subscribe(context => {
        if (context) {
          const offsetTopValue: number = this.datagridOptionsWrapper.gridApi.getViewportContentOffsetTop();
          this.actionMenuTopValue = `translate3d(${this.defaultX}px, ${context.rowTopValue + offsetTopValue}px, ${
            this.defaultZ
          })`;
        } else {
          this.actionMenuTopValue = `translate3d(${this.defaultX}px, ${this.defaultY}, ${this.defaultZ})`;
        }
        this.cd.markForCheck();
      })
    );
  }

  get actionMenuTopValue(): string {
    return this._actionMenuTopValue;
  }

  @HostBinding('style.transform')
  set actionMenuTopValue(value: string) {
    this._actionMenuTopValue = value;
    this.cd.markForCheck();
  }

  @HostListener('mouseenter', ['$event'])
  onRowEnter(event) {
    this.actionMenuService.setHoverState(true, event);
  }

  @HostListener('mouseleave', ['$event'])
  onRowLeave(event) {
    this.actionMenuService.setHoverState(false, event);
  }

  ngOnDestroy(): void {
    if (this.subscriptions.length > 0) {
      this.subscriptions.forEach(sub => sub.unsubscribe());
      this.subscriptions = undefined;
    }
  }

  getContextForActionMenu(): FuiDatagridBodyRowContext {
    if (this.actionMenuService) {
      return {
        ...this.actionMenuService.currentlySelectedRowContext,
        forceClose: this.forceClose,
        onDropdownOpen: (isOpen: boolean) => {
          if (this.actionMenuService) {
            this.actionMenuService.isActionMenuDropdownOpen = isOpen;
          }
        }
      };
    }
    return null;
  }

  private toggleRowSelection(): void {
    this.isRowSelected =
      this.getContextForActionMenu() && this.getContextForActionMenu().rowNode
        ? this.rowSelectionService.isNodeSelected(this.getContextForActionMenu().rowNode.id)
        : false;
  }
}
