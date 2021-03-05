import FuiTabBodySpecs from './tab-body.spec';
import FuiTabHeaderSpecs from './tab-header.spec';
import FuiTabsNavSpecs from './tabs-nav/tabs-nav.spec';
import FuiTabsSpecs from './tabs.spec';

describe('FerUI Tabs', function () {
  FuiTabsNavSpecs();
  FuiTabsSpecs();
  FuiTabBodySpecs();
  FuiTabHeaderSpecs();
});
