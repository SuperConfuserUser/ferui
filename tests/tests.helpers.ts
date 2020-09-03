import * as BrowserDetector from 'detect-browser';
const browser = BrowserDetector.detect();

export const itIgnore = (browsers: string[], should: string, test: any, focus: boolean = false) => {
  if (browsers.length && browsers.indexOf(browser.name) >= 0) {
    return xit(should, test);
  }

  // tslint:disable-next-line
  return focus ? fit(should, test) : it(should, test);
};

export const fitIgnore = (browsers: string[], should: string, test: any) => {
  itIgnore(browsers, should, test, true);
};

export const describeIgnore = (browsers: string[], title: string, suite: any, focus: boolean = false) => {
  if (browsers.length && browsers.indexOf(browser.name) >= 0) {
    return xdescribe(title, suite);
  }

  // tslint:disable-next-line
  return focus ? fdescribe(title, suite) : describe(title, suite);
};

export const fdescribeIgnore = (browsers: string[], title: string, suite: any) => {
  describeIgnore(browsers, title, suite, true);
};
