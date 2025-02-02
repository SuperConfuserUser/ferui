import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { FormControl, FormGroup, FormsModule, NgControl, Validators } from '@angular/forms';
import { By } from '@angular/platform-browser';

import { ClrIconModule } from '../../icon/icon.module';
import { FuiCommonFormsModule } from '../common/common.module';
import { IfErrorService } from '../common/if-error/if-error.service';
import { NgControlService } from '../common/providers/ng-control.service';
import { ReactiveSpec, TemplateDrivenSpec } from '../tests/container.spec';

import { FuiPasswordDirective } from './password';
import { FuiPasswordContainerComponent } from './password-container';

@Component({
  template: `
    <fui-password-container [fuiToggle]="toggler">
      <input type="password" name="test" fuiPassword required [(ngModel)]="model" [disabled]="disabled" />
      <label fuiLabel>Hello World</label>
      <fui-control-error>Must be at least 5 characters</fui-control-error>
    </fui-password-container>
  `
})
class TemplateDrivenTest {
  disabled = false;
  model = '';
  toggler = true;
}

@Component({
  template: `
    <form [formGroup]="form">
      <fui-password-container>
        <input fuiPassword formControlName="model" />
        <label fuiLabel>Hello World</label>
        <fui-control-error>Must be at least 5 characters</fui-control-error>
      </fui-password-container>
    </form>
  `
})
class ReactiveTest {
  disabled = false;
  form = new FormGroup({
    model: new FormControl({ value: '', disabled: this.disabled }, Validators.required)
  });
}

export default function (): void {
  describe('FuiPasswordContainerComponent', () => {
    TemplateDrivenSpec(
      FuiPasswordContainerComponent,
      FuiPasswordDirective,
      TemplateDrivenTest,
      '.fui-input-wrapper [fuiPassword]'
    );
    ReactiveSpec(FuiPasswordContainerComponent, FuiPasswordDirective, ReactiveTest, '.fui-input-wrapper [fuiPassword]');

    describe('password toggle', () => {
      let fixture, containerDE, containerEl;
      beforeEach(() => {
        TestBed.configureTestingModule({
          imports: [ClrIconModule, FuiCommonFormsModule, FormsModule],
          declarations: [FuiPasswordContainerComponent, FuiPasswordDirective, TemplateDrivenTest],
          providers: [NgControl, NgControlService, IfErrorService]
        });
        fixture = TestBed.createComponent(TemplateDrivenTest);

        containerDE = fixture.debugElement.query(By.directive(FuiPasswordContainerComponent));
        containerEl = containerDE.nativeElement;
        fixture.detectChanges();
      });

      it('toggles the visibility of the password', () => {
        const button = containerEl.querySelector('clr-icon');
        expect(containerEl.querySelector('input').type).toEqual('password');
        button.click();
        fixture.detectChanges();
        expect(containerEl.querySelector('input').type).toEqual('text');
      });

      it('should disable toggling', () => {
        expect(containerEl.querySelector('clr-icon')).toBeTruthy();
        fixture.componentInstance.toggler = false;
        fixture.detectChanges();
        expect(containerEl.querySelector('clr-icon')).toBeFalsy();
      });
    });
  });
}
