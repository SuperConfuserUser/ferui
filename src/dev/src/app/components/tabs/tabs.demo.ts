import { BehaviorSubject } from 'rxjs';

import { Component, OnInit } from '@angular/core';

import { DemoComponentData } from '../../utils/demo-component-data';

interface DemoComponentsList {
  [key: string]: DemoComponentData;
}

@Component({
  selector: 'tabs-demo-example',
  templateUrl: './tabs.demo.html'
})
export class TabsDemoComponent implements OnInit {
  overviewExamples: DemoComponentsList = {};
  examples: Array<DemoComponentData> = [];

  ngOnInit(): void {
    this.overviewExamples = {
      basicExample: new DemoComponentData({
        title: 'Basic use of the fui-tabs',
        htmlSource: `<fui-tabs>
  <fui-tab label="First tab">First tab content</fui-tab>
  <fui-tab label="Second tab">Second tab content</fui-tab>
  <!-- Label can also be a binding -->
  <fui-tab [label]="'Third tab'">Third tab content</fui-tab>
</fui-tabs>`
      }),

      complexLabels: new DemoComponentData({
        title: 'Using tabs with a custom label template',
        htmlSource: `<fui-tabs>
  <fui-tab>
    <ng-template fui-tab-label>
      <clr-icon class="mr-2" shape="fui-document-library"></clr-icon>
      Library
    </ng-template>
    Library content
  </fui-tab>
  <fui-tab>
    <ng-template fuiTabLabel>
      <clr-icon class="mr-2" shape="fui-disk"></clr-icon>
      Disk
    </ng-template>
    Disk content
  </fui-tab>
  <fui-tab>
    <ng-template fui-tab-label>
      <clr-icon class="mr-2" shape="fui-phone"></clr-icon>
      Phone
    </ng-template>
    Phone content
  </fui-tab>
</fui-tabs>`
      }),

      tabsNav: new DemoComponentData({
        title: 'Basic use of the tab nav bar',
        params: { links: ['First', 'Second', 'Third'], activeLink: 'First' },
        htmlSource: `<nav fui-tabs-nav>
  <a fui-tabs-link *ngFor="let link of params.links"
     (click)="params.activeLink = link"
     [active]="params.activeLink === link"> {{link}} </a>
  <a fui-tabs-link disabled>Disabled Link</a>
</nav>
<!-- <div class="route-wrapper">-->
<!--   You can add your router outlet wherever you want and just add the [routerLink] to the links above like you would do usually -->
<!--   <router-outlet></router-outlet>-->
<!-- </div>-->
`
      }),

      lazyLoading: new DemoComponentData({
        title: 'Tab group where the tab content is loaded lazily (when activated)',
        params: {
          tabLoadTimes: [],
          getTimeLoaded: function (index: number) {
            if (!this.tabLoadTimes[index]) {
              this.tabLoadTimes[index] = new Date();
            }
            return this.tabLoadTimes[index];
          }
        },
        htmlSource: `<fui-tabs>
  <fui-tab label="First">
    <ng-template fuiTabContent>
      Content 1 - Loaded: {{params.getTimeLoaded(1) | date:'medium'}}
    </ng-template>
  </fui-tab>
  <fui-tab label="Second">
    <ng-template fui-tab-content>
      Content 2 - Loaded: {{params.getTimeLoaded(2) | date:'medium'}}
    </ng-template>
  </fui-tab>
  <fui-tab label="Third">
    <ng-template fuiTabContent>
      Content 3 - Loaded: {{params.getTimeLoaded(3) | date:'medium'}}
    </ng-template>
  </fui-tab>
</fui-tabs>`
      }),

      labelAlignment: new DemoComponentData({
        title: 'Tabs with aligned labels',
        htmlSource: `<fui-tabs fui-align-tabs="start">
  <fui-tab label="First">Content 1</fui-tab>
  <fui-tab label="Second">Content 2</fui-tab>
  <fui-tab label="Third">Content 3</fui-tab>
</fui-tabs>

<fui-tabs fui-align-tabs="center">
  <fui-tab label="First">Content 1</fui-tab>
  <fui-tab label="Second">Content 2</fui-tab>
  <fui-tab label="Third">Content 3</fui-tab>
</fui-tabs>

<fui-tabs fui-align-tabs="end">
  <fui-tab label="First">Content 1</fui-tab>
  <fui-tab label="Second">Content 2</fui-tab>
  <fui-tab label="Third">Content 3</fui-tab>
</fui-tabs>`
      })
    };

    const examples = [];
    for (const overviewExamplesKey in this.overviewExamples) {
      if (this.overviewExamples.hasOwnProperty(overviewExamplesKey)) {
        examples.push(this.overviewExamples[overviewExamplesKey]);
      }
    }
    examples.push(
      new DemoComponentData({
        title: 'Tabs with asynchronously loading tab contents',
        params: {
          loading: false,
          asyncTabsSubject: new BehaviorSubject<any>([]),
          asyncTabs: function () {
            return this.asyncTabsSubject.asObservable();
          },
          loadTabs: function () {
            this.loading = true;
            this.asyncTabsSubject.next([]);
            setTimeout(() => {
              this.asyncTabsSubject.next([
                { label: 'First', content: 'Content 1' },
                { label: 'Second', content: 'Content 2' },
                { label: 'Third', content: 'Content 3' }
              ]);
              this.loading = false;
            }, 1000);
          }
        },
        htmlSource: `<button class="btn btn-secondary" (click)="params.loadTabs()">Load tabs</button><br />
<ng-container *ngIf="(params.asyncTabs() | async).length === 0 && params.loading">
  Loading tabs...
</ng-container>

<fui-tabs>
  <fui-tab *ngFor="let tab of params.asyncTabs() | async">
    <ng-template fui-tab-label>{{tab.label}}</ng-template>
    <ng-template fui-tab-content>{{tab.content}}</ng-template>
  </fui-tab>
</fui-tabs>`,
        tsSource: `import {Component} from '@angular/core';
import {Observable,  Observer} from 'rxjs';

export interface ExampleTab {
  label: string;
  content: string;
}

/**
 * Tabs with asynchronously loading tab contents
 */
@Component({
  selector: 'tabs-async-example',
  templateUrl: 'tabs-async-example.html'
})
export class TabsAsyncExample {

  private asyncTabsSubject: BehaviorSubject<ExampleTab[]> = new BehaviorSubject<ExampleTab[]>()

  asyncTabs(): Observable<ExampleTab[]> {
    return this.asyncTabsSubject.asObservable();
  }

  loadTabs() {
    this.asyncTabsSubject.next([]);
    setTimeout(() => {
      this.asyncTabsSubject.next([
        { label: 'First', content: 'Content 1' },
        { label: 'Second', content: 'Content 2' },
        { label: 'Third', content: 'Content 3' }
      ]);
    }, 1000);
  }
}
`
      })
    );
    this.examples = examples;
  }
}
