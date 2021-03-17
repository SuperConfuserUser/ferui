import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Compiler,
  Component,
  ComponentFactory,
  ComponentRef,
  Input,
  ModuleWithComponentFactories,
  NgModule,
  OnInit,
  QueryList,
  ViewChild,
  ViewChildren,
  ViewContainerRef
} from '@angular/core';
import { FormsModule, NgControl, NgForm, NgModel } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { FeruiModule } from '@ferui/components';

import { IconsModule } from '../icons/icons.module';
import { WINDOW_PROVIDERS } from '../services/window.service';

import { DemoComponentCodeSource, DemoComponentData } from './demo-component-data';

/**
 * Class:  Demo.component.ts
 *
 * Description:
 * ---------------------------------
 * This class is building a Demo Component and takes a DemoComponentData object as parameter.
 *
 *
 * Example:
 * ---------------------------------
 * new DemoComponentData({
 *  title: 'Simple Widget',
 *  models: {one: 'one'},
 *  params: {value: 'value'},
 *  canDisable: true,
 *  htmlSource: `<fui-widget>
 *    <fui-widget-title>My title</fui-widget-title>
 *    <fui-widget-subtitle>Widget subtitle</fui-widget-subtitle>
 *    <input fuiInput name="myField" [(ngModel)]="models.one" required />
 *    My value: {{params.value}}
 *  </fui-widget>`
 *  }));
 */
@Component({
  selector: 'demo-component',
  template: `<div class="row demo-component-header">
      <div class="col-md-10 col-sm-12 p-0">
        <h5 class="mb-0 mt-0 ml-0" [innerHTML]="title"></h5>
      </div>
      <div class="col-md-2 col-sm-12 p-0 d-flex flex-row-reverse align-items-center actions-wrapper">
        <button
          tabindex="-1"
          class="btn btn-icon"
          [fuiTooltip]="codeHidden ? 'View code' : 'Hide code'"
          [fuiTooltipConfig]="{ closeOnOutsideClick: true }"
          (click)="toggleCode()"
        >
          <clr-icon shape="fui-code"></clr-icon>
        </button>
        <button
          *ngIf="canDisable && models"
          tabindex="-1"
          class="btn btn-icon"
          [fuiTooltip]="params.disabled ? 'Enable form control' : 'Disable form control'"
          [fuiTooltipConfig]="{ closeOnOutsideClick: true }"
          (click)="disable(!params.disabled)"
        >
          <clr-icon *ngIf="!params.disabled" shape="fui-eye-off"></clr-icon>
          <clr-icon *ngIf="params.disabled" shape="fui-eye"></clr-icon>
        </button>
        <button
          *ngIf="models"
          tabindex="-1"
          class="btn btn-icon"
          [fuiTooltip]="resultHidden ? 'View extra data' : 'Hide extra data'"
          [fuiTooltipConfig]="{ closeOnOutsideClick: true }"
          (click)="toggleResult()"
        >
          <clr-icon *ngIf="!resultHidden" shape="fui-document-file"></clr-icon>
          <clr-icon *ngIf="resultHidden" shape="fui-document"></clr-icon>
        </button>
      </div>
    </div>

    <div class="row demo-component-code" *ngIf="codeSources.length > 0 && !codeHidden">
      <div class="col p-0">
        <fui-tabs>
          <fui-tab *ngFor="let codeBlock of codeSources" [label]="codeBlock.label">
            <pre><code [highlight]="codeBlock.code"></code></pre>
          </fui-tab>
        </fui-tabs>
      </div>
    </div>

    <div class="row demo-component-runtime">
      <div class="col bd-example">
        <div #container></div>
      </div>
    </div>

    <div class="row demo-component-models" *ngIf="models && !resultHidden">
      <div class="col p-0">
        <pre><code [languages]="['json']" [highlight]="resultsData() | json"></code></pre>
      </div>
    </div>`,
  host: {
    '[class.demo-component]': 'true',
    '[class.container-fluid]': 'true'
  }
})
export class DemoComponent implements OnInit {
  @Input() componentData: DemoComponentData;
  @Input() disabled: boolean = false;
  @Input() codeHidden: boolean = true;
  @Input() resultHidden: boolean = true;
  @Input() form: NgForm;

  @ViewChild('container', { read: ViewContainerRef }) _vcr: ViewContainerRef;

  codeSources: DemoComponentCodeSource[] = [];
  title: string;
  models: object;
  params: any;
  canDisable: boolean;

  private _componentRef: ComponentRef<any>;

  constructor(private _compiler: Compiler) {}

  ngOnInit(): void {
    const codeSources = [
      { label: 'HTML', code: this.componentData.htmlSource || null },
      { label: 'TS', code: this.componentData.tsSource || null },
      { label: 'JS', code: this.componentData.jsSource || null },
      { label: 'SCSS', code: this.componentData.scssSource || null },
      { label: 'CSS', code: this.componentData.cssSource || null }
    ];

    // We create an array of codeBlocks that have code assigned.
    this.codeSources = codeSources.filter(codeBlock => !!codeBlock.code);

    this.title = this.componentData.title;
    this.models = this.componentData.models;
    this.params = this.componentData.params;
    this.canDisable = this.componentData.canDisable;

    if (!this.params.disabled) {
      this.params.disabled = this.disabled;
    }

    const _params: any = this.params;
    const _models: any = this.models;
    const _form: NgForm = this.form;

    // We compile and attach the sub component that contains the desired example to the view.
    class DemoSubComponent implements AfterViewInit {
      params: any = _params;
      models: any = _models;
      form: NgForm = _form;

      @ViewChildren(NgControl) formControls: QueryList<NgControl>;

      ngAfterViewInit(): void {
        if (this.form && this.formControls.length > 0) {
          this.formControls.forEach(control => {
            if (control instanceof NgModel) {
              this.form.addControl(control);
            }
          });
        }
      }
    }

    const codeSourceToRender: DemoComponentCodeSource = this.codeSources.find(code => code.label === 'HTML');
    this.compileTemplate(codeSourceToRender.code, DemoSubComponent);
  }

  resultsData() {
    const data: any = {};
    if (this.canDisable) {
      data.params = { disabled: this.params.disabled };
    }
    data.models = {};
    for (const modelName in this.models) {
      if (this.models.hasOwnProperty(modelName)) {
        data.models[modelName] = this.models[modelName];
      }
    }
    return data;
  }

  toggleCode() {
    this.codeHidden = !this.codeHidden;
  }

  toggleResult() {
    this.resultHidden = !this.resultHidden;
  }

  disable(disabled: boolean) {
    if (this.canDisable) {
      this.params.disabled = disabled;
    }
  }

  private compileTemplate(template, componentClass?: any) {
    const metadata = {
      selector: `runtime-component-sample`,
      template: template
    };
    const factory = this.createComponentFactorySync(this._compiler, metadata, componentClass);
    if (this._componentRef) {
      this._componentRef.destroy();
      this._componentRef = null;
    }
    this._componentRef = this._vcr.createComponent(factory);
  }

  private createComponentFactorySync(compiler: Compiler, metadata: Component, componentClass: any): ComponentFactory<any> {
    const cmpClass = componentClass || class RuntimeComponent {};
    const decoratedCmp = Component(metadata)(cmpClass);

    @NgModule({
      imports: [BrowserAnimationsModule, CommonModule, FormsModule, IconsModule, FeruiModule],
      declarations: [decoratedCmp],
      providers: [WINDOW_PROVIDERS]
    })
    class RuntimeComponentModule {}

    const module: ModuleWithComponentFactories<any> = compiler.compileModuleAndAllComponentsSync(RuntimeComponentModule);
    return module.componentFactories.find(f => f.componentType === decoratedCmp);
  }
}
