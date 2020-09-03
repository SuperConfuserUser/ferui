import * as jsBeautify from 'js-beautify';

import { Component } from '@angular/core';

import { FuiToastNotificationService } from '@ferui/components';

@Component({
  template: `
    <div id="holder"></div>
    <fui-tabs>
      <fui-tab [title]="'Overview'" [active]="true">
        <h2 class="mt-3">Overview</h2>
        <p>
          In FerUI, a Toast Notification is a component displayed from the top of the screen. It comes down from the top of the
          screen and sets at 20px from the top. It is always centered on the width of the screen.
        </p>
        <p>Things to know:</p>
        <ul>
          <li>SlideIn duration is 700ms (the duration for the animation when the toast slides onto the screen)</li>
          <li>SlideOut duration is 400ms (the duration for the animation when the toast is removed from screen)</li>
          <li>
            Auto SlideOut Delay is 10s (the duration of the toast on screen) The timer is stopped when a user hovers over the
            toast with their mouse and restarts once mouse is removed
          </li>
        </ul>
        <br />
        <h2>How to use it?</h2>
        <div>
          You will need to inject the <b>FuiToastNotificationService</b> to your application's components wanting to call on the
          Fui Toast Notification. Inject into component like this:
          <pre><code [languages]="['typescript']" [highlight]="'constructor(private fuiToastNotificationService: FuiToastNotificationService) {}'"></code></pre>
        </div>
        <div>
          Once injected, you can use the <b>FuiToastNotificationService</b> to call on the Fui Toast Notification Component from
          anywhere in your app using its <i>createFuiToastNotification</i> method:
          <pre><code [languages]="['typescript']" [highlight]="overViewExample"></code></pre>
          <br />
          Simply pass in an object implementing the <b>FuiToastNotificationInterface</b> interface
          <pre><code [languages]="['typescript']" [highlight]="fuiToastNotificationInterface"></code></pre>
        </div>
        <div>
          <p>Attributes explanation:</p>
          <ul>
            <li>
              Action (*FuiToastNotificationActionInterface) - sending in an HTMLElement value for template will ignore any href &
              callback values also used and will allow the developer to fully control the action item on the Toast Notification,
              they must handle any click events and/or href wanted. Sending in a simple string value will create a wrapper element
              with the template value as its inner html and attach any href/callback values to the wrapper element for the Toast
              Notification to handle directly
            </li>
            <li>
              Icon (*FuiToastNotificationIconInterface) - using an HTMLElement value for the icon template will allow the
              developer to use any icon of their choosing and will place it vertically aligned to the left of the Toast
              Notification message.
            </li>
            <li>
              Anchor - the HTML element the Toast Notification will append to, default will be the document's body. We give the
              developer the ability to change it in case they want to be able to use it even within an iframe.
            </li>
          </ul>
        </div>
      </fui-tab>
      <fui-tab [title]="'Examples'">
        <div class="btn btn-light" (click)="simpleToastNotification()">Simple Toast Notification</div>
        <fui-tabs>
          <fui-tab [title]="'HTML'" [active]="true">
            <pre><code [languages]="['html']" [highlight]="htmlExample1"></code></pre>
          </fui-tab>
          <fui-tab [title]="'TypeScript'">
            <pre><code [languages]="['typescript']" [highlight]="jsExample1"></code></pre>
          </fui-tab>
        </fui-tabs>
        <div class="btn btn-light" (click)="maxWidthWithLinkToastNotification()">Max Width With Link Toast Notification</div>
        <fui-tabs>
          <fui-tab [title]="'HTML'" [active]="true">
            <pre><code [languages]="['html']" [highlight]="htmlExample2"></code></pre>
          </fui-tab>
          <fui-tab [title]="'TypeScript'">
            <pre><code [languages]="['typescript']" [highlight]="jsExample2"></code></pre>
          </fui-tab>
        </fui-tabs>
        <div class="btn btn-light" (click)="withCallbackActionButton()">Toast Notification With Callback Action Button</div>
        <fui-tabs>
          <fui-tab [title]="'HTML'" [active]="true">
            <pre><code [languages]="['html']" [highlight]="htmlExample3"></code></pre>
          </fui-tab>
          <fui-tab [title]="'TypeScript'">
            <pre><code [languages]="['typescript']" [highlight]="jsExample3"></code></pre>
          </fui-tab>
        </fui-tabs>
        <div class="btn btn-light" (click)="withIcon()">Toast Notification With Clr Icon</div>
        <fui-tabs>
          <fui-tab [title]="'HTML'" [active]="true">
            <pre><code [languages]="['html']" [highlight]="htmlExample4"></code></pre>
          </fui-tab>
          <fui-tab [title]="'TypeScript'">
            <pre><code [languages]="['typescript']" [highlight]="jsExample4"></code></pre>
          </fui-tab>
        </fui-tabs>
        <div class="btn btn-light" (click)="withActionIconAndModifiedTime()">
          Toast Notification With Icon, Action and Modified Time
        </div>
        <fui-tabs>
          <fui-tab [title]="'HTML'" [active]="true">
            <pre><code [languages]="['html']" [highlight]="htmlExample5"></code></pre>
          </fui-tab>
          <fui-tab [title]="'TypeScript'">
            <pre><code [languages]="['typescript']" [highlight]="jsExample5"></code></pre>
          </fui-tab>
        </fui-tabs>
        <div class="btn btn-light" (click)="withElementAction()">Toast Notification With Custom Action and No Anchor Point</div>
        <fui-tabs>
          <fui-tab [title]="'HTML'" [active]="true">
            <pre><code [languages]="['html']" [highlight]="htmlExample6"></code></pre>
          </fui-tab>
          <fui-tab [title]="'TypeScript'">
            <pre><code [languages]="['typescript']" [highlight]="jsExample6"></code></pre>
          </fui-tab>
        </fui-tabs>
      </fui-tab>
    </fui-tabs>
  `,
  styles: [
    `
      .btn-light {
        margin-top: 20px;
        margin-bottom: 10px;
      }
    `
  ]
})
export class ToastNotificationDashboardDemoComponent {
  overViewExample: string = jsBeautify.js(`
    openToastNotification(): void {
      const anchorElement: HTMLElement = document.getElementById('anchor');
      const htmlElement: HTMLElement = document.createElement('button');
      htmlElement.innerText = 'Some Notification!';
      // Using the FuiToastNotificationInterface object you can control the Fui Toast Notification to your liking
      this.fuiToastNotificationService.createFuiToastNotification({
        message: "Overview Page", // (optional) message showing on the toast notification
        notificationTimeInMs: 1000, // (optional) amount of time the notification should stay open
        action: {
          template: htmlElement // (optional) action templates can be of HTMLElement or string showing the desired action for user
          callBack: this.clickEvent // (optional) action callback event
        },
        anchor: anchorElement
      });
    }
  `);

  fuiToastNotificationInterface: string = jsBeautify.js(`
      /**
       * Fui Toast Notification object interface
       */
      interface FuiToastNotificationInterface {
        message?: string; // toast notification message
        delay?: number; // delay to show toast notification used by Toast Service
        cssClass?: string; // The extra/custom css class to add to the toast host element.
        action?: FuiToastNotificationActionInterface;
        icon?: FuiToastNotificationIconInterface;
        notificationTimeInMs?: number; // time the dev wants the toast notification to last on screen
        anchor?: HTMLElement; // the anchor element to append toast notification to, otherwise document body will be used
      }

      /**
       * Fui Toast Notification Action object interface
       */
      interface FuiToastNotificationActionInterface {
        template: string | HTMLElement;
        href?: string; // The href for your link (it is optional because sometimes you just want to handle the link through the click event callback)
        callBack?: () => void;
      }

      /**
       * Fui Toast Notification Icon object interface
       */
      interface FuiToastNotificationIconInterface {
        element: HTMLElement; // The icon element you want to use
        cssClass?: string; // The extra/custom css class to add to the icon element wrapper
      }
  `);

  htmlExample1: string = jsBeautify.html(`
    <div class="btn btn-light" (click)="simpleToastNotification()">Simple Toast Notification</div>
  `);

  jsExample1: string = jsBeautify.js(`
    simpleToastNotification(): void {
      const htmlElement: HTMLElement = document.getElementById('holder');
      this.fuiToastNotificationService.createFuiToastNotification({
        message: 'Simple Toast Notification',
        anchor: htmlElement
      });
    }
  `);

  htmlExample2: string = jsBeautify.html(`
    <div class="btn btn-light" (click)="maxWidthToastNotification()">Max Width With Link Toast Notification</div>
  `);

  jsExample2: string = jsBeautify.js(`
    maxWidthWithLinkToastNotification(): void {
      const htmlElement: HTMLElement = document.getElementById('holder');
      this.fuiToastNotificationService.createFuiToastNotification({
        message: 'Toast notification with the 500px maximum width. With link action to display possible link user can click on.',
        action: {
          template: 'Link - click to go to google!',
          href: 'https://www.google.com/'
        },
        anchor: htmlElement
      });
    }
  `);

  htmlExample3: string = jsBeautify.html(`
    <div class="btn btn-light" (click)="withActionButton()">Toast Notification With Action Button</div>
  `);

  jsExample3: string = jsBeautify.js(`
    withCallbackActionButton(): void {
      const htmlElement: HTMLElement = document.getElementById('holder');
      this.fuiToastNotificationService.createFuiToastNotification({
        message: 'Toast notification component with action button',
        action: {
          template: 'Action',
          callBack: (): void => {
            alert('Action callback invoked!');
          }
        },
        anchor: htmlElement
      });
    }
  `);

  htmlExample4: string = jsBeautify.html(`
    <div class="btn btn-light" (click)="withIcon()">Toast Notification With Clr Icon</div>
  `);

  jsExample4: string = jsBeautify.js(`
    withIcon(): void {
      const htmlElementIcon: HTMLElement = document.createElement('div');
      htmlElementIcon.innerHTML = '<clr-icon shape="fui-chat"></clr-icon>';
      const htmlElement: HTMLElement = document.getElementById('holder');
      this.fuiToastNotificationService.createFuiToastNotification({
        message: 'Toast notification component with fui-chat clr icon',
        icon: {
          element: htmlElementIcon
        },
        anchor: htmlElement
      });
    }
  `);

  htmlExample5: string = jsBeautify.html(`
    <div class="btn btn-light" (click)="withActionAndIcon()">Toast Notification With Clr Icon And Action Button</div>
  `);

  jsExample5: string = jsBeautify.js(`
    withActionIconAndModifiedTime(): void {
      const htmlElementIcon: HTMLElement = document.createElement('div');
      htmlElementIcon.innerHTML = '<clr-icon shape="fui-active-task"></clr-icon>';
      const htmlElement: HTMLElement = document.getElementById('holder');
      this.fuiToastNotificationService.createFuiToastNotification({
        message: 'Toast notification component with action button, task icon and longer screen time',
        notificationTimeInMs: 10000 + 10000 + 16000, // double the time on screen
        action: {
          template: 'Action'
        },
        icon: {
          element: htmlElementIcon,
          cssClass: 'other-icon-class'
        },
        anchor: htmlElement
      });
    }
  `);

  htmlExample6: string = jsBeautify.html(`
    <div class="btn btn-light" (click)="withElementAction()">Toast Notification With Custom Action and No Anchor Point</div>
  `);

  jsExample6: string = jsBeautify.js(`
    withElementAction(): void {
      const htmlElement: HTMLElement = document.createElement('div');
      htmlElement.innerHTML = \`<button onclick="alert('CUSTOM ALERT')">Ugly Custom Button</button>\`;
      this.fuiToastNotificationService.createFuiToastNotification({
        message: 'Toast notification with custom action button and no anchor',
        action: {
          template: htmlElement,
          callBack: (): void => {
            alert('This alert will not show up!'); // this callback will be ignored since we passed in an HTMLElement
          }
        }
      });
    }
  `);

  constructor(private fuiToastNotificationService: FuiToastNotificationService) {}

  simpleToastNotification(): void {
    const htmlElement: HTMLElement = document.getElementById('holder');
    this.fuiToastNotificationService.createFuiToastNotification({
      message: 'Simple Toast Notification',
      anchor: htmlElement
    });
  }

  maxWidthWithLinkToastNotification(): void {
    const htmlElement: HTMLElement = document.getElementById('holder');
    this.fuiToastNotificationService.createFuiToastNotification({
      message: 'Toast notification with the 500px maximum width. With link action to display possible link user can click on.',
      action: {
        template: 'Link - click to go to google!',
        href: 'https://www.google.com/'
      },
      anchor: htmlElement
    });
  }

  withCallbackActionButton(): void {
    const htmlElement: HTMLElement = document.getElementById('holder');
    this.fuiToastNotificationService.createFuiToastNotification({
      message: 'Toast notification component with action button',
      action: {
        template: 'Action',
        callBack: (): void => {
          alert('Action callback invoked!');
        }
      },
      anchor: htmlElement
    });
  }

  withIcon(): void {
    const htmlElementIcon: HTMLElement = document.createElement('div');
    htmlElementIcon.innerHTML = '<clr-icon shape="fui-chat"></clr-icon>';
    const htmlElement: HTMLElement = document.getElementById('holder');
    this.fuiToastNotificationService.createFuiToastNotification({
      message: 'Toast notification component with fui-chat clr icon',
      icon: {
        element: htmlElementIcon
      },
      anchor: htmlElement
    });
  }

  withActionIconAndModifiedTime(): void {
    const htmlElementIcon: HTMLElement = document.createElement('div');
    htmlElementIcon.innerHTML = '<clr-icon shape="fui-active-task"></clr-icon>';
    const htmlElement: HTMLElement = document.getElementById('holder');
    this.fuiToastNotificationService.createFuiToastNotification({
      message: 'Toast notification component with action button, task icon and longer screen time',
      notificationTimeInMs: 10700 * 2, // double the time on screen
      action: {
        template: 'Action'
      },
      icon: {
        element: htmlElementIcon,
        cssClass: 'other-icon-class'
      },
      anchor: htmlElement
    });
  }

  withElementAction(): void {
    const htmlElement: HTMLElement = document.createElement('div');
    htmlElement.innerHTML = `<button onclick="alert('CUSTOM ALERT')">Ugly Custom Button</button>`;
    this.fuiToastNotificationService.createFuiToastNotification({
      message: 'Toast notification with custom action button and no anchor',
      action: {
        template: htmlElement,
        callBack: (): void => {
          alert('This alert will not show up!'); // this callback will be ignored since we passed in an HTMLElement
        }
      }
    });
  }
}
