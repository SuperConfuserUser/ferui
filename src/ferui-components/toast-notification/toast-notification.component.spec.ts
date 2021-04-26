import { ComponentFixture, TestBed, fakeAsync, flush, tick } from '@angular/core/testing';
import { DomSanitizer } from '@angular/platform-browser';

import { FuiToastNotificationInterface } from './interfaces';
import { FuiToastNotificationComponent } from './toast-notification-component';
import { FuiToastNotificationModule } from './toast-notification.module';

import Spy = jasmine.Spy;

export default function (): void {
  describe('FuiToastNotificationComponent', () => {
    let fixture: ComponentFixture<FuiToastNotificationComponent>;
    let component: FuiToastNotificationComponent;

    beforeEach(async () => {
      TestBed.configureTestingModule({
        imports: [FuiToastNotificationModule],
        providers: [
          {
            provide: DomSanitizer,
            useValue: {
              sanitize: val => val,
              bypassSecurityTrustHtml: val => val
            }
          }
        ]
      }).compileComponents();
      fixture = TestBed.createComponent(FuiToastNotificationComponent);
      fixture.detectChanges();
      component = fixture.componentInstance;
    });

    it('should initialize default configurations for toast component', () => {
      const toast: FuiToastNotificationInterface = {};
      component.init(toast);
      expect(component.message).toBe('You have a notification!');
      expect(component.toastClass).toBeNull();
      expect(component.toastAction).toBeNull();
      expect(component.toastIcon).toBeNull();
      expect(component.onScreen).toBeTruthy();
      expect(component.removeNotification).toBeFalsy();
    });

    it('should initialize custom configurations for toast component', () => {
      const htmlElementIcon: HTMLElement = document.createElement('div');
      htmlElementIcon.innerHTML = '<clr-icon shape="fui-active-task"></clr-icon>';
      const toast: FuiToastNotificationInterface = {
        message: 'Test toast component message',
        cssClass: 'test-toast-class',
        icon: {
          element: htmlElementIcon,
          cssClass: 'test-icon-class'
        },
        action: {
          template: 'test-action',
          callBack: () => {
            return;
          }
        }
      };
      component.init(toast);
      expect(component.message).toBe(toast.message);
      expect(component.toastClass).toBe(toast.cssClass);
      expect(component.toastAction.isHtmlElement).toBe(false);
      expect(component.toastAction.template).toContain(toast.action.template);
      expect(component.toastAction.templateClickEvent).toBeDefined();
      expect(component.toastAction.templateHref).toBeNull();
      expect(component.toastIcon.template).toContain(htmlElementIcon.innerHTML);
      expect(component.toastIcon.cssClass).toBe(toast.icon.cssClass);
      expect(component.onScreen).toBeTruthy();
      expect(component.removeNotification).toBeFalsy();
    });

    it('should test toast component events', fakeAsync(() => {
      const toast: FuiToastNotificationInterface = {
        message: 'Test toast component message',
        notificationTimeInMs: 2000,
        action: {
          template: 'Link',
          href: 'http-mock-link'
        }
      };
      component.init(toast);
      tick(1000);
      component.onMouseOver();
      tick(1000);
      // Toast component still active
      expect(component.removeNotification).toBeFalsy();
      component.onMouseOut();
      tick(1000);
      component.closeNotification(new Event('click'));
      // Toast component now should close
      expect(component.removeNotification).toBeTruthy();
      flush();
    }));

    it('should close toast component', fakeAsync(() => {
      const toast: FuiToastNotificationInterface = { message: 'Test toast component closure' };
      component.init(toast);
      const closeSpy: Spy = spyOn(component, 'closeNotification');
      const eventEmitterSpy: Spy = spyOn(component.close, 'emit');
      const contentWrapper: HTMLElement = component.toastNotificationWrapper.nativeElement;
      contentWrapper.firstChild.dispatchEvent(new Event('click'));
      tick(1000);
      flush();
      expect(closeSpy).toHaveBeenCalled();
      expect(eventEmitterSpy).toHaveBeenCalled();
    }));
  });
}
