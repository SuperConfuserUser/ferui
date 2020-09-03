import { Component, EventEmitter, Input, Output } from '@angular/core';

import { ExampleCode } from './abstract-control-demo.component';

@Component({
  selector: 'default-template-wrapper',
  template: `
    <h2 class="mt-2 mb-2">{{ pageTitle }}</h2>
    <p class="mt-4">
      Filters :
      <button class="btn btn-sm btn-info" (click)="setDisable()">Toggle Disabled ({{ disabled ? 'true' : 'false' }})</button>
      <button class="btn btn-sm btn-info ml-2" (click)="toggleAllCodes()">Toggle all code</button>
      <button class="btn btn-sm btn-info ml-2" (click)="toggleAllResults()">Toggle all results</button>
    </p>
    <ng-content></ng-content>
  `
})
export class DefaultTemplateWrapperComponent {
  @Output() readonly disabledChange = new EventEmitter<boolean>();
  @Output() readonly toggleEvent = new EventEmitter<any>();

  @Input() pageTitle: string = 'Control Page';
  @Input() examples: Array<ExampleCode> = [];
  @Input() results: Array<ExampleCode> = [];
  @Input() disabled: boolean = true;

  toggle(model: any, index: number | string): void {
    this.toggleEvent.next([model, index]);
  }

  setDisable() {
    this.disabled = !this.disabled;
    this.disabledChange.emit(this.disabled);
  }

  toggleAllCodes(): void {
    for (const ex in this.examples) {
      if (this.examples.hasOwnProperty(ex)) {
        this.toggle(this.examples, ex);
      }
    }
  }

  toggleAllResults(): void {
    for (const res in this.results) {
      if (this.results.hasOwnProperty(res)) {
        this.toggle(this.results, res);
      }
    }
  }
}
