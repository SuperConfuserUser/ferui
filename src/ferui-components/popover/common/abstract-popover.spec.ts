import { Component, ElementRef, Injector, Optional, ViewChild, forwardRef } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { itIgnore } from '../../../../tests/tests.helpers';
import { FuiConditionalModule } from '../../utils/conditional/conditional.module';
import { IfOpenService } from '../../utils/conditional/if-open.service';
import { ESC } from '../../utils/key-codes/key-codes';

import { AbstractPopover } from './abstract-popover';
import { POPOVER_HOST_ANCHOR } from './popover-host-anchor.token';

describe('Abstract Popover', function () {
  let fixture: ComponentFixture<any>;
  let ifOpenService: IfOpenService;

  describe('Keyboard Events', () => {
    beforeEach(() => {
      TestBed.configureTestingModule({ declarations: [TestPopover], providers: [IfOpenService] });
      ifOpenService = TestBed.get(IfOpenService);
      ifOpenService.open = true;
      fixture = TestBed.createComponent(TestPopover);
      fixture.detectChanges();
    });

    // IE doesn't support KeyboardEvent as a constructor ¯\_(ツ)_/¯
    // @TODO Fix this for IE? Maybe.
    itIgnore(['ie'], 'closes the popover when ESC is pressed', () => {
      const event: KeyboardEvent = new KeyboardEvent('keydown');
      Object.defineProperties(event, { keyCode: { get: () => ESC } });

      document.dispatchEvent(event);

      expect(ifOpenService.open).toBe(false);
    });
  });

  describe('Popover with fuiIfOpen Directive', () => {
    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [TestPopover, TestPopoverWithIfOpenDirective],
        imports: [FuiConditionalModule],
        providers: [IfOpenService]
      });
      ifOpenService = TestBed.get(IfOpenService);
      fixture = TestBed.createComponent(TestPopoverWithIfOpenDirective);
      fixture.detectChanges();
    });

    it('opens the abstract popover only after IfOpenService is in open state', () => {
      expect(ifOpenService.open).toBe(false);
      expect(fixture.componentInstance.testPopover).toBeUndefined();

      ifOpenService.open = true;
      fixture.detectChanges();

      expect(fixture.componentInstance.testPopover).not.toBeUndefined();
    });
  });

  describe('Open popover on focus', () => {
    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [TestPopoverIgnoreElement, InputFocusPopover],
        imports: [FuiConditionalModule]
      });
      fixture = TestBed.createComponent(InputFocusPopover);
      fixture.detectChanges();
    });

    it('keeps the popover open when the input is focused', () => {
      const input = fixture.debugElement.query(By.css('input'));

      input.triggerEventHandler('focus', {});
      fixture.detectChanges();

      expect(fixture.debugElement.query(By.css('.test-popover'))).not.toBeNull();
    });
  });
});

@Component({
  selector: 'test-popover',
  template: ` <div class="test-popover">Popover</div> `
})
class TestPopover extends AbstractPopover {
  constructor(injector: Injector, @Optional() parent: ElementRef) {
    super(injector, parent, null, null);
  }
}

@Component({
  template: ` <test-popover *fuiIfOpen></test-popover> `
})
class TestPopoverWithIfOpenDirective {
  @ViewChild(TestPopover) testPopover: TestPopover;
}

@Component({
  template: `
    <input type="text" #ignoreInput (focus)="onFocus($event)" />
    <test-popover-ignore *fuiIfOpen></test-popover-ignore>
  `,
  providers: [IfOpenService, { provide: POPOVER_HOST_ANCHOR, useExisting: ElementRef }]
})
class InputFocusPopover {
  @ViewChild('ignoreInput') ignore: ElementRef;
  @ViewChild(forwardRef(() => TestPopoverIgnoreElement))
  popover: TestPopoverIgnoreElement;

  constructor(private ifOpenService: IfOpenService) {}

  onFocus(event: FocusEvent) {
    this.ifOpenService.toggleWithEvent(event);
  }
}

@Component({
  selector: 'test-popover-ignore',
  template: ` <div class="test-popover">Popover</div> `
})
class TestPopoverIgnoreElement extends AbstractPopover {
  constructor(injector: Injector, @Optional() parent: ElementRef, parentHost: InputFocusPopover) {
    super(injector, parent, null, null);
    if (parentHost && parentHost.ignore) {
      this.ignoredElement = parentHost.ignore.nativeElement;
    }
  }
}
