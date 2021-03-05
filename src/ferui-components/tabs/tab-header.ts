import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { FocusKeyManager } from '@angular/cdk/a11y';
import { Direction, Directionality } from '@angular/cdk/bidi';
import { coerceNumberProperty } from '@angular/cdk/coercion';
import { END, ENTER, HOME, SPACE, hasModifierKey } from '@angular/cdk/keycodes';
import {
  AfterContentChecked,
  AfterContentInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChildren,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  Optional,
  Output,
  QueryList,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';

import { FuiTabLabelWrapperDirective } from './tab-label-wrapper';

/**
 * The fui-tab-header component that wraps the fui-label.
 * @internal Used only by fui-tabs to wraps the tab labels.
 */
@Component({
  selector: 'fui-tab-header',
  templateUrl: 'tab-header.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'fui-tab-header',
    '[class.fui-tab-header-rtl]': "_getLayoutDirection() === 'rtl'"
  }
})
export class FuiTabHeaderComponent implements AfterContentChecked, AfterContentInit, OnDestroy {
  /** Event emitted when the option is selected (via click or focus). */
  @Output() readonly selectFocusedIndex: EventEmitter<number> = new EventEmitter<number>();

  /** Event emitted when a label is focused. */
  @Output() readonly indexFocused: EventEmitter<number> = new EventEmitter<number>();

  @ContentChildren(FuiTabLabelWrapperDirective) _labelWrappers: QueryList<FuiTabLabelWrapperDirective>;
  @ViewChild('tabListContainer') _tabListContainer: ElementRef;
  @ViewChild('tabList') _tabList: ElementRef;

  /** Whether or not the index value has changed */
  private selectedIndexChanged = false;
  /** Emits when the component is destroyed. */
  private readonly destroyed = new Subject<void>();
  /** Used to manage focus between the tabs. */
  private _keyManager: FocusKeyManager<FuiTabLabelWrapperDirective>;
  /** Cached text content of the header. */
  private currentTextContent: string;
  /** The selected tab index */
  private _selectedIndex: number = 0;

  constructor(
    private elementRef: ElementRef,
    private changeDetectorRef: ChangeDetectorRef,
    @Optional() private dir: Directionality
  ) {}

  /** The index of the active tab. */
  @Input()
  get selectedIndex(): number {
    return this._selectedIndex;
  }

  set selectedIndex(value: number) {
    value = coerceNumberProperty(value);
    this.selectedIndexChanged = this._selectedIndex !== value;
    this._selectedIndex = value;

    if (this._keyManager) {
      this._keyManager.updateActiveItem(value);
    }
  }

  /** Tracks which element has focus; used for keyboard navigation */
  get focusIndex(): number {
    return this._keyManager ? this._keyManager.activeItemIndex! : 0;
  }

  /** When the focus index is set, we must manually send focus to the correct label */
  set focusIndex(value: number) {
    if (!this._isValidIndex(value) || this.focusIndex === value || !this._keyManager) {
      return;
    }

    this._keyManager.setActiveItem(value);
  }

  ngAfterContentChecked(): void {
    if (this.selectedIndexChanged) {
      this.selectedIndexChanged = false;
      this.changeDetectorRef.markForCheck();
    }
  }

  /** Handles keyboard events on the header. */
  _handleKeydown(event: KeyboardEvent) {
    // We don't handle any key bindings with a modifier key.
    if (hasModifierKey(event)) {
      return;
    }

    switch (event.keyCode) {
      case HOME:
        this._keyManager.setFirstItemActive();
        event.preventDefault();
        break;
      case END:
        this._keyManager.setLastItemActive();
        event.preventDefault();
        break;
      case ENTER:
      case SPACE:
        this.selectFocusedIndex.emit(this.focusIndex);
        event.preventDefault();
        break;
      default:
        this._keyManager.onKeydown(event);
    }
  }

  /**
   * Aligns the ink bar to the selected tab on load.
   */
  ngAfterContentInit() {
    this._keyManager = new FocusKeyManager(this._labelWrappers).withHorizontalOrientation(this._getLayoutDirection()).withWrap();
    this._keyManager.updateActiveItem(0);

    // If there is a change in the focus key manager we need to emit the `indexFocused`
    // event in order to provide a public event that notifies about focus changes.
    this._keyManager.change.pipe(takeUntil(this.destroyed)).subscribe(newFocusIndex => {
      this.indexFocused.emit(newFocusIndex);
      this._setTabFocus(newFocusIndex);
    });
  }

  ngOnDestroy() {
    this.destroyed.next();
    this.destroyed.complete();
  }

  /**
   * Callback for when the MutationObserver detects that the content has changed.
   */
  _onContentChanges() {
    const textContent = this.elementRef.nativeElement.textContent;

    // We need to diff the text content of the header, because the MutationObserver callback
    // will fire even if the text content didn't change which is inefficient and is prone
    // to infinite loops if a poorly constructed expression is passed in (see #14249).
    if (textContent !== this.currentTextContent) {
      this.currentTextContent = textContent;
      this.changeDetectorRef.markForCheck();
    }
  }

  /**
   * Determines if an index is valid. If the tabs are not ready yet, we assume that the user is
   * providing a valid index and return true.
   */
  _isValidIndex(index: number): boolean {
    if (!this._labelWrappers) {
      return true;
    }

    const tab = this._labelWrappers ? this._labelWrappers.toArray()[index] : null;
    return !!tab && !tab.disabled;
  }

  /**
   * Sets focus on the HTML element for the label wrapper and scrolls it into the view if
   * scrolling is enabled.
   */
  _setTabFocus(tabIndex: number) {
    if (this._labelWrappers && this._labelWrappers.length) {
      this._labelWrappers.toArray()[tabIndex].focus();
    }
  }

  /** The layout direction of the containing app. */
  _getLayoutDirection(): Direction {
    return this.dir && this.dir.value === 'rtl' ? 'rtl' : 'ltr';
  }
}
