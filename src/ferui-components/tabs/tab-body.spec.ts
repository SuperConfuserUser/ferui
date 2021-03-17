import { PortalModule, TemplatePortal } from '@angular/cdk/portal';
import { CommonModule } from '@angular/common';
import { AfterContentInit, Component, TemplateRef, ViewChild, ViewContainerRef } from '@angular/core';
import { ComponentFixture, TestBed, async } from '@angular/core/testing';

import { FuiTabBodyComponent, FuiTabBodyPortalDirective } from './tab-body';

export default function () {
  describe('FuiTabBodyComponent', () => {
    beforeEach(async(() => {
      TestBed.configureTestingModule({
        imports: [CommonModule, PortalModule],
        declarations: [FuiTabBodyComponent, FuiTabBodyPortalDirective, SimpleTabBodyApp]
      });

      TestBed.compileComponents();
    }));

    describe('basic behavior', () => {
      let fixture: ComponentFixture<SimpleTabBodyApp>;
      let tabBody: FuiTabBodyComponent;

      beforeEach(() => {
        fixture = TestBed.createComponent(SimpleTabBodyApp);
        tabBody = fixture.debugElement.componentInstance.tabBody;
      });

      it('should not display the content by default', () => {
        const tabBodyContent = fixture.nativeElement.querySelector('.fui-tab-body-content');
        expect(tabBodyContent.textContent).toBe('');
      });

      it('should display the content if `[contentActive]="true"` and remove it when `[contentActive]="false"`', () => {
        let tabBodyContent: HTMLElement;

        fixture.componentInstance.isActive = true;
        fixture.detectChanges();

        tabBodyContent = fixture.nativeElement.querySelector('.fui-tab-body-content');
        expect(tabBodyContent.textContent).toMatch('Tab Body Content');

        fixture.componentInstance.isActive = false;
        fixture.detectChanges();

        tabBodyContent = fixture.nativeElement.querySelector('.fui-tab-body-content');
        expect(tabBodyContent.textContent).toBe('');
      });
    });
  });
}
/* tslint:disable */
@Component({
  template: `
    <ng-template>Tab Body Content</ng-template>
    <fui-tab-body [content]="content" [contentActive]="isActive"></fui-tab-body>
  `
})
class SimpleTabBodyApp implements AfterContentInit {
  content: TemplatePortal;
  isActive: boolean = false;

  @ViewChild(FuiTabBodyComponent) tabBody: FuiTabBodyComponent;
  @ViewChild(TemplateRef) template: TemplateRef<any>;

  constructor(private _viewContainerRef: ViewContainerRef) {}

  ngAfterContentInit() {
    this.content = new TemplatePortal(this.template, this._viewContainerRef);
  }
}
