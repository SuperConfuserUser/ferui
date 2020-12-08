import { Injectable } from '@angular/core';

import { fuiI18nStringsDefault } from './fui-i18n-default-strings';
import { FuiI18nStrings } from './fui-i18n-interface';

@Injectable({
  providedIn: 'root'
})
export class FuiI18nService {
  private _strings = fuiI18nStringsDefault;

  /**
   * Allows you to pass in new overrides for localization
   */
  localize(overrides: Partial<FuiI18nStrings>): void {
    this._strings = { ...this._strings, ...overrides };
  }

  /**
   * Access to all of the keys as strings
   */
  get keys(): Readonly<FuiI18nStrings> {
    return this._strings;
  }

  /**
   * Parse a string with a set of tokens to replace
   */
  parse(source: string, tokens: { [key: string]: string } = {}): string {
    const names = Object.keys(tokens);
    let output = source;
    if (names.length) {
      names.forEach(name => {
        output = output.replace(`{${name}}`, tokens[name]);
      });
    }
    return output;
  }
}
