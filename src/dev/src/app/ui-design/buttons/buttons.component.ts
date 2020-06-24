import { Component } from '@angular/core';
import * as jsBeautify from 'js-beautify';

@Component({
  selector: 'ui-buttons',
  templateUrl: './buttons.component.html',
  styleUrls: ['./buttons.component.scss']
})
export class UiDesignButtonsComponent {
  exampleCode1: string = jsBeautify.html(`
    <button type="button" class="btn btn-primary">Primary</button>
    <button type="button" class="btn btn-secondary">Secondary</button>
    <button type="button" class="btn btn-success">Success</button>
    <button type="button" class="btn btn-danger">Danger</button>
    <button type="button" class="btn btn-warning">Warning</button>
    <button type="button" class="btn btn-info">Info</button>
    <button type="button" class="btn btn-light">Light</button>
    <button type="button" class="btn btn-dark">Dark</button>
    <button type="button" class="btn btn-link">Link</button>
  `);

  exampleCode2: string = jsBeautify.html(`
    <a class="btn btn-primary" href="#" role="button">Link</a>
    <button class="btn btn-primary" type="submit">Button</button>
    <input class="btn btn-primary" type="button" value="Input">
    <input class="btn btn-primary" type="submit" value="Submit">
    <input class="btn btn-primary" type="reset" value="Reset">`);

  exampleCode3: string = jsBeautify.html(`
    <button type="button" class="btn btn-outline-primary">Primary</button>
    <button type="button" class="btn btn-outline-secondary">Secondary</button>
    <button type="button" class="btn btn-outline-success">Success</button>
    <button type="button" class="btn btn-outline-danger">Danger</button>
    <button type="button" class="btn btn-outline-warning">Warning</button>
    <button type="button" class="btn btn-outline-info">Info</button>
    <button type="button" class="btn btn-outline-light">Light</button>
    <button type="button" class="btn btn-outline-dark">Dark</button>`);

  exampleCode4: string = jsBeautify.html(`
    <button type="button" class="btn btn-primary btn-lg">Large button</button>
    <button type="button" class="btn btn-secondary btn-lg">Large button</button>`);

  exampleCode5: string = jsBeautify.html(`
    <button type="button" class="btn btn-primary btn-sm">Small button</button>
    <button type="button" class="btn btn-secondary btn-sm">Small button</button>`);

  exampleCode6: string = jsBeautify.html(`
    <button type="button" class="btn btn-primary btn-lg btn-block">Block level button</button>
    <button type="button" class="btn btn-secondary btn-lg btn-block">Block level button</button>`);

  exampleCode7: string = jsBeautify.html(`
    <a href="#" class="btn btn-primary btn-lg active" role="button" aria-pressed="true">Primary link</a>
    <a href="#" class="btn btn-secondary btn-lg active" role="button" aria-pressed="true">Link</a>`);

  exampleCode8: string = jsBeautify.html(`
    <button type="button" class="btn btn-lg btn-primary" disabled="">Primary button</button>
    <button type="button" class="btn btn-secondary btn-lg" disabled="">Button</button>`);

  exampleCode9: string = jsBeautify.html(`
    <a href="#" class="btn btn-primary btn-lg disabled" tabindex="-1" role="button" aria-disabled="true">Primary link</a>
    <a href="#" class="btn btn-secondary btn-lg disabled" tabindex="-1" role="button" aria-disabled="true">Link</a>`);

  exampleCode10: string = jsBeautify.html(`
    <button type="button" class="btn btn-primary" data-toggle="button" aria-pressed="false">
      Single toggle
    </button>`);

  exampleCode11: string = jsBeautify.html(`
  <div class="btn-group-toggle" data-toggle="buttons">
      <label class="btn btn-secondary active">
        <input type="checkbox" checked=""> Checked
      </label>
    </div>`);

  exampleCode12: string = jsBeautify.html(`
  <div class="btn-group btn-group-toggle" data-toggle="buttons">
    <label class="btn btn-secondary active">
      <input type="radio" name="options" id="option1" checked=""> Active
    </label>
    <label class="btn btn-secondary">
      <input type="radio" name="options" id="option2"> Radio
    </label>
    <label class="btn btn-secondary">
      <input type="radio" name="options" id="option3"> Radio
    </label>
  </div>`);

  exampleCode13: string = jsBeautify.html(`
    <button type="button" class="btn btn-primary">Regular button</button>
    <button type="button" class="btn btn-secondary">Regular button</button>`);
}
