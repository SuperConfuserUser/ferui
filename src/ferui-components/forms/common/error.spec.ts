import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { FuiControlErrorComponent } from './error';

@Component({
  template: ` <fui-control-error>Test error</fui-control-error> `
})
class SimpleTest {}

export default function (): void {
  describe('FuiControlErrorComponent', () => {
    let fixture;

    beforeEach(function () {
      TestBed.configureTestingModule({ declarations: [FuiControlErrorComponent, SimpleTest] });
      fixture = TestBed.createComponent(SimpleTest);
      fixture.detectChanges();
    });

    it('projects content', function () {
      expect(fixture.debugElement.query(By.directive(FuiControlErrorComponent)).nativeElement.innerText).toContain('Test error');
    });

    it('adds the .fui-subtext class to host', function () {
      expect(
        fixture.debugElement.query(By.directive(FuiControlErrorComponent)).nativeElement.classList.contains('fui-subtext')
      ).toBeTrue();
    });
  });
}
