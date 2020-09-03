import * as jsBeautify from 'js-beautify';

import { Component } from '@angular/core';

import { FuiAlertsTypes } from '../../../../../ferui-components/alerts/alerts.component';

@Component({
  selector: 'ui-alerts',
  templateUrl: './alerts.component.html'
})
export class UiDesignAlertsComponent {
  fuiAlertsWarning: FuiAlertsTypes = FuiAlertsTypes.WARNING;
  fuiAlertsDanger: FuiAlertsTypes = FuiAlertsTypes.DANGER;
  fuiAlertsPrimary: FuiAlertsTypes = FuiAlertsTypes.PRIMARY;
  fuiAlertsSecondary: FuiAlertsTypes = FuiAlertsTypes.SECONDARY;
  fuiAlertsSuccess: FuiAlertsTypes = FuiAlertsTypes.SUCCESS;

  exampleCode1: string = jsBeautify.html(`
  <div class="alert alert-primary" role="alert">
      A simple primary alert—check it out!
    </div>
    <div class="alert alert-secondary" role="alert">
      A simple secondary alert—check it out!
    </div>
    <div class="alert alert-success" role="alert">
      A simple success alert—check it out!
    </div>
    <div class="alert alert-danger" role="alert">
      A simple danger alert—check it out!
    </div>
    <div class="alert alert-warning" role="alert">
      A simple warning alert—check it out!
    </div>
    <div class="alert alert-info" role="alert">
      A simple info alert—check it out!
    </div>
    <div class="alert alert-light" role="alert">
      A simple light alert—check it out!
    </div>
    <div class="alert alert-dark" role="alert">
      A simple dark alert—check it out!
    </div>`);

  exampleCode2: string = jsBeautify.html(`
    <div class="alert alert-primary" role="alert">
      A simple primary alert with <a href="#" class="alert-link">an example link</a>. Give it a click if you like.
    </div>
    <div class="alert alert-secondary" role="alert">
      A simple secondary alert with <a href="#" class="alert-link">an example link</a>. Give it a click if you like.
    </div>
    <div class="alert alert-success" role="alert">
      A simple success alert with <a href="#" class="alert-link">an example link</a>. Give it a click if you like.
    </div>
    <div class="alert alert-danger" role="alert">
      A simple danger alert with <a href="#" class="alert-link">an example link</a>. Give it a click if you like.
    </div>
    <div class="alert alert-warning" role="alert">
      A simple warning alert with <a href="#" class="alert-link">an example link</a>. Give it a click if you like.
    </div>
    <div class="alert alert-info" role="alert">
      A simple info alert with <a href="#" class="alert-link">an example link</a>. Give it a click if you like.
    </div>
    <div class="alert alert-light" role="alert">
      A simple light alert with <a href="#" class="alert-link">an example link</a>. Give it a click if you like.
    </div>
    <div class="alert alert-dark" role="alert">
      A simple dark alert with <a href="#" class="alert-link">an example link</a>. Give it a click if you like.
    </div>`);

  exampleCode3: string = jsBeautify.html(`
    <div class="alert alert-success" role="alert">
      <h4 class="alert-heading">Well done!</h4>
      <p>
        Aww yeah, you successfully read this important alert message. This example text is going to run a bit longer so that you
        can see how spacing within an alert works with this kind of content.
      </p>
      <hr />
      <p class="mb-0">Whenever you need to, be sure to use margin utilities to keep things nice and tidy.</p>
    </div>`);

  exampleCode4: string = jsBeautify.html(`
    <fui-alert [closable]="false" [alertType]="fuiAlertsPrimary">
      <clr-icon fuiAlertsIcon shape="fui-active-task"></clr-icon>
      A simple primary alert—check it out!
    </fui-alert>

    <fui-alert [closable]="true" [alertType]="fuiAlertsSecondary">
      <clr-icon fuiAlertsIcon shape="fui-burgermenu"></clr-icon>
      A simple secondary alert—check it out!
    </fui-alert>

    <fui-alert [closable]="false" [alertType]="fuiAlertsSuccess">
      <clr-icon fuiAlertsIcon shape="fui-tick"></clr-icon>
      A simple success alert—check it out!
    </fui-alert>

    <fui-alert [closable]="true"> <strong>No icon needed!</strong> You can close the alert if you wish. </fui-alert>

    <fui-alert [closable]="true" [alertType]="fuiAlertsWarning">
      <clr-icon fuiAlertsIcon shape="fui-error"></clr-icon>
      <strong>Holy guacamole!</strong> You should check in on some of those fields below.
    </fui-alert>

    <fui-alert [closable]="true" [alertType]="fuiAlertsDanger">
      <clr-icon fuiAlertsIcon shape="fui-error"></clr-icon>
      <strong>Lorem ipsum</strong> dolor sit amet, consectetur adipiscing elit. Fusce et ex arcu. Aenean dapibus pellentesque
      placerat. Sed quis rutrum lectus, vitae tincidunt orci. Proin ut urna non justo hendrerit hendrerit. Donec sollicitudin erat
      sit amet sapien mollis, sed efficitur nibh scelerisque. Suspendisse ullamcorper varius lacus quis dapibus. Praesent ut sem
      non ipsum tincidunt eleifend at nec nulla. Maecenas fermentum sollicitudin nisi in mollis. Ut et ligula at risus elementum
      semper euismod vitae nisi. Morbi at orci in nulla semper viverra.
    </fui-alert>`);

  exampleCode5: string = jsBeautify.html(`
    <div class="alert alert-info alert-dismissible alert-flex" role="alert">
      <div class="fui-alert-icon-wrapper">
        <clr-icon class="fui-alert-icon" shape="fui-help"></clr-icon>
      </div>
      <div class="fui-alert-body-wrapper">
        A simple info alert with <a href="#" target="_blank" class="alert-link">an example link</a>. Give it a click if you like.
      </div>
      <div class="fui-alert-close-wrapper">
        <button type="button" class="close" aria-label="Close">
          <clr-icon class="fui-alert-close-icon" shape="fui-close"></clr-icon>
        </button>
      </div>
    </div>

    <div class="alert alert-danger alert-flex" role="alert">
      <div class="fui-alert-icon-wrapper">
        <clr-icon class="fui-alert-icon" shape="fui-error"></clr-icon>
      </div>
      <div class="fui-alert-body-wrapper">
        A simple success alert with <a href="#" target="_blank" class="alert-link">an example link</a>. Give it a click if you
        like.
      </div>
    </div>

    <div class="alert alert-warning alert-flex" role="alert">
      <div class="fui-alert-body-wrapper">
        A simple warning alert with <a href="#" target="_blank" class="alert-link">an example link</a>. Give it a click if you
        like.
      </div>
    </div>

    <div class="alert alert-success alert-dismissible alert-flex" role="alert">
      <div class="fui-alert-icon-wrapper">
        <clr-icon class="fui-alert-icon" shape="fui-tick"></clr-icon>
      </div>
      <div class="fui-alert-body-wrapper">
        <h4 class="alert-heading">Well done!</h4>
        <p>
          Aww yeah, you successfully read this important alert message. This example text is going to run a bit longer so that you
          can see how spacing within an alert works with this kind of content.
        </p>
        <hr />
        <p class="mb-0">Whenever you need to, be sure to use margin utilities to keep things nice and tidy.</p>
      </div>
      <div class="fui-alert-close-wrapper">
        <button type="button" class="close" aria-label="Close">
          <clr-icon class="fui-alert-close-icon" shape="fui-close"></clr-icon>
        </button>
      </div>
    </div>`);

  exampleCode6: string = `enum FuiAlertsTypes {
  PRIMARY = 'alert-primary',
  SECONDARY = 'alert-secondary',
  SUCCESS = 'alert-success',
  DANGER = 'alert-danger',
  WARNING = 'alert-warning',
  INFO = 'alert-info',
  LIGHT = 'alert-light',
  DARK = 'alert-dark'
}`;
}
