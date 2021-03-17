import { BehaviorSubject, Observable, Subscription } from 'rxjs';

import { CdkPortalOutlet, PortalHostDirective, TemplatePortal } from '@angular/cdk/portal';
import {
  AfterContentChecked,
  ChangeDetectionStrategy,
  Component,
  ComponentFactoryResolver,
  Directive,
  Inject,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
  ViewContainerRef,
  ViewEncapsulation,
  forwardRef
} from '@angular/core';

/**
 * The portal host directive for the contents of the tab.
 */
@Directive({
  selector: '[fuiTabBodyHost]'
})
export class FuiTabBodyPortalDirective extends CdkPortalOutlet implements OnInit, OnDestroy {
  private contentChangeSub = Subscription.EMPTY;

  constructor(
    componentFactoryResolver: ComponentFactoryResolver,
    viewContainerRef: ViewContainerRef,
    // tslint:disable-next-line:no-forward-ref
    @Inject(forwardRef(() => FuiTabBodyComponent)) private _host: FuiTabBodyComponent
  ) {
    super(componentFactoryResolver, viewContainerRef);
  }

  /** Set initial visibility or set up subscription for changing visibility. */
  ngOnInit(): void {
    super.ngOnInit();

    // Each time we select a tab, we need to load its content to the view.
    this.contentChangeSub = this._host._contentChange$.subscribe(content => {
      if (content) {
        // Then we attach the content.
        if (!this.hasAttached()) {
          this.attach(content);
        }
      } else {
        this.detach();
      }
    });
  }

  /** Clean up content change subscription. */
  ngOnDestroy(): void {
    super.ngOnDestroy();
    this.contentChangeSub.unsubscribe();
  }
}

/**
 * Wrapper for the contents of a tab.
 */
@Component({
  selector: 'fui-tab-body',
  templateUrl: 'tab-body.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'fui-tab-body',
    '[class.fui-tab-body-active]': 'content && contentActive'
  }
})
export class FuiTabBodyComponent implements AfterContentChecked {
  /** The portal host inside of this container into which the tab body content will be loaded. */
  @ViewChild(PortalHostDirective) _portalHost: PortalHostDirective;

  /** The tab body content to display. */
  @Input('content')
  get content(): TemplatePortal {
    return this._content;
  }

  set content(value: TemplatePortal) {
    this._content = value;
  }

  @Input('contentActive')
  get contentActive(): boolean {
    return this._contentActive;
  }

  set contentActive(isActive: boolean) {
    this._contentActive = isActive;
  }

  /**
   * Each time the content of the selected tab changes, we need to update the view.
   * We let the fuiTabBodyHost know about the change.
   * Note: It must be a BehaviorSubject. Neither Subject or EventEmitter works.
   */
  get _contentChange$(): Observable<TemplatePortal> {
    return this._contentChangeSubject.asObservable();
  }

  private _contentChangeSubject: BehaviorSubject<TemplatePortal> = new BehaviorSubject<TemplatePortal>(null);

  private _contentActive: boolean = false;
  private _content: TemplatePortal;

  ngAfterContentChecked() {
    if (this.contentActive && this.content) {
      this._contentChangeSubject.next(this._content);
    } else {
      this._contentChangeSubject.next(null);
    }
  }
}
