import { Component, DebugElement, ElementRef, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed, fakeAsync, flush, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { template } from '@angular-devkit/core';

import { FuiToastNotificationInterface } from './interfaces';
import { FuiToastNotificationService } from './toast-notification-service';
import { FuiToastNotificationModule } from './toast-notification.module';

import Spy = jasmine.Spy;

/*
 * Test component used for testing Fui Toast Notification Service
 */
@Component({
  template: `<div #toastAnchor id="toast-notification-anchor-el"></div>`
})
class TestComponent {
  @ViewChild('toastAnchor') toastAnchor: ElementRef;
  simpleToastMessage: string = 'Simple toast notification';
  simpleToastCssClass: string = 'simple-toast-notification-class';
  iconToastMessage: string = 'Toast notification with icon';
  iconToastCssClass: string = 'test-icon-class';
  iconToastHtml: string = '<clr-icon shape="fui-help"></clr-icon>';
  actionToastMessage: string = 'Toast notification with action and callback';
  actionToastTemplate: string = 'Click on toast action';
  delayTime: number = 10000;
  linkActionToastMessage: string = 'Link action';
  linkActionToast: string = 'mock-http-link';
  constructor(public fuiToastNotificationService: FuiToastNotificationService) {}

  openSimpleToastNotification(): void {
    const toast: FuiToastNotificationInterface = {
      message: this.simpleToastMessage,
      anchor: this.toastAnchor.nativeElement,
      cssClass: this.simpleToastCssClass
    };
    this.fuiToastNotificationService.createFuiToastNotification(toast);
  }

  openIconToastNotification(): void {
    const htmlElementIcon: HTMLElement = document.createElement('div');
    htmlElementIcon.innerHTML = this.iconToastHtml;
    const toast: FuiToastNotificationInterface = {
      message: this.iconToastMessage,
      anchor: this.toastAnchor.nativeElement,
      icon: {
        element: htmlElementIcon,
        cssClass: this.iconToastCssClass
      },
      action: {
        template: this.linkActionToastMessage,
        href: this.linkActionToast
      }
    };
    this.fuiToastNotificationService.createFuiToastNotification(toast);
  }

  openActionToastNotification(): void {
    const toast: FuiToastNotificationInterface = {
      message: this.actionToastMessage,
      anchor: this.toastAnchor.nativeElement,
      action: {
        template: this.actionToastTemplate,
        callBack: this.callback
      }
    };
    this.fuiToastNotificationService.createFuiToastNotification(toast);
  }

  openDelayedToastNotification(): void {
    const toast: FuiToastNotificationInterface = {
      delay: this.delayTime,
      action: { template: this.linkActionToastMessage, href: this.linkActionToast }
    };
    this.fuiToastNotificationService.createFuiToastNotification(toast);
  }

  callback(): void {
    return;
  }
}

export default function (): void {
  describe('FuiToastNotificationService', () => {
    let fixture: ComponentFixture<TestComponent>;
    let component: TestComponent;
    let service: FuiToastNotificationService;
    let anchor: DebugElement;
    let serviceSpy: Spy;
    const testDefaults = () => {
      expect(anchor.query(By.css('#fui-toast-notification'))).toBeDefined();
      expect(anchor.query(By.css('.toast-notification-content'))).toBeDefined();
      expect(anchor.query(By.css('.toast-notification-message'))).toBeDefined();
    };

    beforeEach(async () => {
      TestBed.configureTestingModule({
        imports: [FuiToastNotificationModule],
        declarations: [TestComponent],
        providers: [FuiToastNotificationService]
      }).compileComponents();
      fixture = TestBed.createComponent(TestComponent);
      fixture.detectChanges();
      component = fixture.componentInstance;
      service = TestBed.get(FuiToastNotificationService);
      serviceSpy = spyOn(service, 'createFuiToastNotification').and.callThrough();
    });

    it('should test service with simple toast notification', () => {
      component.openSimpleToastNotification();
      fixture.detectChanges();
      anchor = fixture.debugElement.query(By.css('#toast-notification-anchor-el'));
      expect(serviceSpy).toHaveBeenCalled();
      testDefaults();
      expect(anchor.query(By.css(`.${component.simpleToastCssClass}`))).toBeDefined();
      expect(document.querySelector('.toast-notification-message').innerHTML).toContain(component.simpleToastMessage);
    });

    it('should test service with icon and link toast notification', () => {
      component.openIconToastNotification();
      fixture.detectChanges();
      expect(serviceSpy).toHaveBeenCalled();
      anchor = fixture.debugElement.query(By.css('#toast-notification-anchor-el'));
      testDefaults();
      expect(anchor.query(By.css('.toast-notification-icon'))).toBeDefined();
      expect(anchor.query(By.css(`.${component.iconToastCssClass}`))).toBeDefined();
      expect(document.querySelector('.toast-notification-message').innerHTML).toContain(component.iconToastMessage);
      expect(document.querySelector('.toast-notification-icon').innerHTML).toContain(component.iconToastHtml);
      expect(document.querySelector('.toast-notification-action').innerHTML).toContain(component.linkActionToastMessage);
      expect(document.querySelector('.toast-notification-action > a').getAttribute('href')).toContain(component.linkActionToast);
    });

    it('should test service with toast notification action and callback', () => {
      const callbackSpy: Spy = spyOn(component, 'callback').and.callThrough();
      component.openActionToastNotification();
      fixture.detectChanges();
      expect(serviceSpy).toHaveBeenCalled();
      anchor = fixture.debugElement.query(By.css('#toast-notification-anchor-el'));
      testDefaults();
      expect(anchor.query(By.css('.toast-notification-action'))).toBeDefined();
      expect(document.querySelector('.toast-notification-message').innerHTML).toContain(component.actionToastMessage);
      expect(document.querySelector('.toast-notification-action').innerHTML).toContain(component.actionToastTemplate);
      const action: HTMLElement = document.querySelector('.toast-notification-action > div');
      action.click();
      fixture.detectChanges();
      expect(callbackSpy).toHaveBeenCalled();
    });

    it('should test service destruction of previous notification and link event', () => {
      component.openSimpleToastNotification();
      fixture.detectChanges();
      expect(serviceSpy).toHaveBeenCalled();
      component.openActionToastNotification();
      fixture.detectChanges();
      anchor = fixture.debugElement.query(By.css('#toast-notification-anchor-el'));
      expect(serviceSpy).toHaveBeenCalled();
      expect(anchor.query(By.css('.toast-notification-action'))).toBeDefined();
    });

    it('should test service with delayed toast notification', fakeAsync(() => {
      component.openDelayedToastNotification();
      fixture.detectChanges();
      expect(serviceSpy).toHaveBeenCalled();
      anchor = fixture.debugElement.query(By.css('#toast-notification-anchor-el'));
      expect(anchor.query(By.css('#fui-toast-notification'))).toBeNull();
      expect(anchor.query(By.css('.toast-notification-content'))).toBeNull();
      expect(anchor.query(By.css('.toast-notification-message'))).toBeNull();
      tick(component.delayTime);
      fixture.detectChanges();
      testDefaults();
      const action: HTMLElement = document.querySelector('.toast-notification-action');
      action.click();
      fixture.detectChanges();
      flush();
    }));
  });
}
