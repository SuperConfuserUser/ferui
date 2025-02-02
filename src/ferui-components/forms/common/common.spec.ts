import { Component, Directive, NgModule, Type, ViewContainerRef } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { DynamicWrapper } from '../../utils/host-wrapping/dynamic-wrapper';
import { FuiHostWrappingModule } from '../../utils/host-wrapping/host-wrapping.module';

import { FuiCommonFormsModule } from './common.module';
import { FuiFormLayoutEnum } from './layout.enum';
import { ControlIdService } from './providers/control-id.service';
import { WrappedFormControl } from './wrapped-control';

/*
 * Components representing generic form controls.
 */
@Component({
  selector: 'generic-wrapper',
  template: `
    <label fuiLabel id="container-view-label-before"></label>
    <ng-content></ng-content>
    <label fuiLabel id="container-view-label-after"></label>
  `,
  providers: [ControlIdService]
})
class GenericWrapper implements DynamicWrapper {
  _dynamic = false;

  controlLayout() {
    return FuiFormLayoutEnum.DEFAULT;
  }
}

@Directive({ selector: '[genericControl]' })
class GenericControl extends WrappedFormControl<GenericWrapper> {
  constructor(vcr: ViewContainerRef) {
    super(vcr, GenericWrapper, null, null, null, null);
  }
}

@NgModule({
  imports: [FuiCommonFormsModule, FuiHostWrappingModule],
  declarations: [GenericWrapper, GenericControl],
  exports: [FuiCommonFormsModule, GenericWrapper, GenericControl],
  entryComponents: [GenericWrapper]
})
class CommonFormsTestModule {}

/*
 * Actual test components, one for each case we support
 */
@Component({
  template: ` <input genericControl /> `
})
class NoWrapperNoId {}

@Component({
  template: ` <input genericControl id="hello" /> `
})
class NoWrapperWithId {}

@Component({
  template: `
    <generic-wrapper>
      <label fuiLabel id="test-view-label-before"></label>
      <input genericControl />
      <label fuiLabel id="test-view-label-after"></label>
    </generic-wrapper>
  `
})
class WithWrapperNoId {}

@Component({
  template: `
    <generic-wrapper>
      <label fuiLabel id="test-view-label-before"></label>
      <input genericControl id="hello" />
      <label fuiLabel id="test-view-label-after"></label>
    </generic-wrapper>
  `
})
class WithWrapperWithId {}

export default function (): void {
  describe('Common forms integration', () => {
    function assertMatching<T>(testComponent: Type<T>, projectedLabels: boolean, expectedId?: string) {
      return function () {
        TestBed.configureTestingModule({ imports: [CommonFormsTestModule], declarations: [testComponent] });
        const fixture = TestBed.createComponent(testComponent);
        fixture.detectChanges();
        if (!expectedId) {
          const wrapperDebug = fixture.debugElement.query(By.directive(GenericWrapper));
          expectedId = wrapperDebug.injector.get(ControlIdService).id;
        }
        const input = fixture.nativeElement.querySelector('input');
        expect(input.getAttribute('id')).toBe(expectedId, 'input has the wrong id attribute');

        const labels = ['#container-view-label-before', '#container-view-label-after'];
        if (projectedLabels) {
          labels.push('#test-view-label-before', '#test-view-label-after');
        }
        for (const labelSelector of labels) {
          const label = fixture.nativeElement.querySelector(labelSelector);
          expect(label.getAttribute('for')).toBe(expectedId, labelSelector + ' has the wrong for attribute');
        }
      };
    }

    it('works without an explicit wrapper and without an id', assertMatching(NoWrapperNoId, false));
    it('works without an explicit wrapper and with an id', assertMatching(NoWrapperWithId, false, 'hello'));
    it('works with an explicit wrapper and without an id', assertMatching(WithWrapperNoId, true));
    it('works with an explicit wrapper and with an id', assertMatching(WithWrapperWithId, true, 'hello'));
  });
}
