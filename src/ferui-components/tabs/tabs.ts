import { AfterContentInit, Component, ContentChildren, QueryList } from '@angular/core';

import { FuiTabComponent } from './tab';

@Component({
  selector: 'fui-tabs',
  host: {
    '[class.fui-tabs]': 'true'
  },
  template: `
    <ul class="nav nav-pills mb-3" role="tablist">
      <li class="nav-item" role="tab" *ngFor="let tab of tabs; let i = index">
        <button (click)="selectTab(tab)" class="btn" [class.btn-link]="!tab.active" [class.btn-primary]="tab.active">
          <ng-container
            *ngIf="tab.titleTemplateOutletRef"
            [ngTemplateOutlet]="tab.titleTemplateOutletRef"
            [ngTemplateOutletContext]="tab.titleTemplateOutletContext"
          ></ng-container>
          <span *ngIf="!tab.titleTemplateOutletRef && tab.title">{{ tab.title }}</span>
          <span *ngIf="!tab.titleTemplateOutletRef && !tab.title">Tab {{ i }}</span>
        </button>
      </li>
    </ul>
    <div class="tab-content">
      <ng-content></ng-content>
    </div>
  `
})
export class FuiTabsComponent implements AfterContentInit {
  @ContentChildren(FuiTabComponent) tabs: QueryList<FuiTabComponent>;

  ngAfterContentInit() {
    const activeTabs = this.tabs.filter(tab => tab.active);
    // if there is no active tab set, activate the first
    if (activeTabs.length === 0) {
      this.selectTab(this.tabs.first);
    }
  }

  selectTab(tab: FuiTabComponent) {
    if (!tab) {
      return;
    }
    // deactivate all tabs
    this.tabs.toArray().forEach(t => (t.active = false));

    // activate the tab the user has clicked on.
    tab.active = true;
  }
}
