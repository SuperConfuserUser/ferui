import { Component, TemplateRef, ViewChild } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ComponentFixture } from '@angular/core/testing/src/component_fixture';
import { FormControl, FormGroup, FormsModule, NgControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { By } from '@angular/platform-browser';

import { ClrIconModule } from '../../icon/icon.module';
import { FuiCommonFormsModule } from '../common/common.module';
import { IfErrorService } from '../common/if-error/if-error.service';
import { MarkControlService } from '../common/providers/mark-control.service';
import { NgControlService } from '../common/providers/ng-control.service';
import { ReactiveSpec, TemplateDrivenSpec } from '../tests/container.spec';

import { FuiFilterGetDataInterface, FuiSearchDatasource } from './interfaces/search-datasource';
import { FuiSearchDirective } from './search';
import { FuiSearchContainerComponent } from './search-container';

interface TestingDatasourceObject {
  id: string;
  name: string;
}

const exampleDatasource: FuiSearchDatasource<TestingDatasourceObject> = {
  getResults: (params: FuiFilterGetDataInterface) => {
    return new Promise((resolve, reject) => {
      // Here the searchApiService correspond to the API service used to make the requests. It is an observable that you can
      // subscribe to but it can also be a regular Promise.
      // The params object will contains the search strings but also any extra filters that you may want to add.
      resolve({
        total: 2,
        results: [
          { id: 'test', name: 'test' },
          { id: 'test2', name: 'test 2' }
        ]
      });
    });
  }
};

@Component({
  template: `
    <fui-search-container>
      <input name="model" fuiSearch required [(ngModel)]="model" [disabled]="disabled" />
      <label fuiLabel>Hello World</label>
      <fui-control-error>This field is required</fui-control-error>
    </fui-search-container>
  `
})
class SimpleTest {
  disabled = false;
  model = '';
}

@Component({
  template: `
    <div id="public-api-test">
      <fui-search-container>
        <input name="model" fuiSearch required [(ngModel)]="model" [disabled]="disabled" />
      </fui-search-container>
    </div>
  `
})
class PublicApiTest {
  disabled = false;
  model = '';
}

@Component({
  template: `
    <div id="public-api-test">
      <ng-template #resultsListFormatterTplt let-results="resultsObject.results">
        <ul class="pt-3">
          <li *ngFor="let result of results">{{ result.id }} {{ result.label }}</li>
        </ul>
      </ng-template>
      <fui-search-container
        [searchDebounce]="searchDebounce"
        [datasource]="datasource"
        [highlightDebounce]="highlightDebounce"
        [searchHighlight]="searchHighlight"
        [searchResultsTemplate]="searchResultsTemplate"
      >
        <input name="model" fuiSearch required [(ngModel)]="model" [disabled]="disabled" />
      </fui-search-container>
    </div>
  `
})
class ExtendedTestComponent {
  @ViewChild('resultsListFormatterTplt') resultsListFormatterTplt: TemplateRef<any>;
  disabled = false;
  model = '';
  searchDebounce = 50;
  highlightDebounce = 150;
  searchHighlight = true;
  datasource;
  searchResultsTemplate;
}

@Component({
  template: `
    <form [formGroup]="form">
      <fui-search-container>
        <label fuiLabel>Hello World</label>
        <input fuiSearch formControlName="model" />
        <fui-control-error>This field is required</fui-control-error>
      </fui-search-container>
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
  describe('FuiSearchContainerComponent', () => {
    TemplateDrivenSpec(FuiSearchContainerComponent, FuiSearchDirective, SimpleTest, '.fui-input-wrapper [fuiSearch]');
    ReactiveSpec(FuiSearchContainerComponent, FuiSearchDirective, ReactiveTest, '.fui-input-wrapper [fuiSearch]');

    describe('FuiSearchContainer public API', () => {
      let fixture: ComponentFixture<PublicApiTest>, containerDE, container, containerEl, ifErrorService, markControlService;
      beforeEach(() => {
        TestBed.configureTestingModule({
          imports: [ClrIconModule, FuiCommonFormsModule, FormsModule, ReactiveFormsModule],
          declarations: [FuiSearchContainerComponent, FuiSearchDirective, PublicApiTest],
          providers: [NgControl, NgControlService, IfErrorService, MarkControlService]
        });
        fixture = TestBed.createComponent(PublicApiTest);

        containerDE = fixture.debugElement.query(By.directive(FuiSearchContainerComponent));
        container = containerDE.componentInstance;
        containerEl = containerDE.nativeElement;
        ifErrorService = containerDE.injector.get(IfErrorService);
        markControlService = containerDE.injector.get(MarkControlService);
        fixture.detectChanges();
      });

      it('Should get default @Inputs() variables', () => {
        expect(container.displayResults).toBeFalsy();
        expect(container.searchHighlight).toBeTruthy();
        expect(container.searchResultsTemplate).toBeUndefined();
        expect(container.searchDebounce).toBeNull();
        expect(container.highlightDebounce).toEqual(150);
        expect(container.searchResultsWrapperId).toBeDefined();
      });

      it('Should set @Inputs() variables', () => {
        expect(container.displayResults).toBeFalsy();
        expect(container.searchHighlight).toBeTruthy();
        expect(container.searchResultsTemplate).toBeUndefined();
        expect(container.searchDebounce).toBeNull();
        expect(container.highlightDebounce).toEqual(150);
        expect(container.searchResultsWrapperId).toBeDefined();

        container.displayResults = true;
        container.searchHighlight = false;
        container.highlightDebounce = 300;
        container.searchResultsWrapperId = 'public-api-test';
        container.searchDebounce = 150;

        fixture.detectChanges();

        expect(container.displayResults).toBeTruthy();
        expect(container.searchHighlight).toBeFalsy();
        expect(container.searchDebounce).toEqual(150);
        expect(container.highlightDebounce).toEqual(300);
        expect(container.searchResultsWrapperId).toEqual('public-api-test');
      });
    });

    describe('FuiSearchContainer extended testing', () => {
      let fixture: ComponentFixture<ExtendedTestComponent>,
        containerDE,
        container,
        containerEl,
        ifErrorService,
        markControlService;
      beforeEach(() => {
        TestBed.configureTestingModule({
          imports: [ClrIconModule, FuiCommonFormsModule, FormsModule, ReactiveFormsModule],
          declarations: [FuiSearchContainerComponent, FuiSearchDirective, ExtendedTestComponent],
          providers: [NgControl, NgControlService, IfErrorService, MarkControlService]
        });
        fixture = TestBed.createComponent(ExtendedTestComponent);

        containerDE = fixture.debugElement.query(By.directive(FuiSearchContainerComponent));
        container = containerDE.componentInstance;
        containerEl = containerDE.nativeElement;
        ifErrorService = containerDE.injector.get(IfErrorService);
        markControlService = containerDE.injector.get(MarkControlService);
        fixture.detectChanges();
      });

      it('Should update the search debounce when datasource is filled and set it back to null when it is undefined', () => {
        expect(fixture.componentInstance.searchDebounce).toEqual(50);
        fixture.componentInstance.datasource = exampleDatasource;
        fixture.detectChanges();
        expect(container.searchDebounce).toEqual(50);
        fixture.componentInstance.datasource = undefined;
        fixture.detectChanges();
        expect(container.searchDebounce).toEqual(50);
        fixture.componentInstance.searchDebounce = null;
        fixture.detectChanges();
        expect(container.searchDebounce).toEqual(null);
        fixture.componentInstance.datasource = exampleDatasource;
        fixture.detectChanges();
        expect(container.searchDebounce).toEqual(150);
        fixture.componentInstance.datasource = undefined;
        fixture.detectChanges();
        expect(container.searchDebounce).toEqual(null);
      });
    });
  });
}
