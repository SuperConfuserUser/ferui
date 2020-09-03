import { addHelpers } from '../forms/tests/helpers.spec';

import DropdownMenuSpecs from './dropdown-menu.spec';
import DropdownSpecs from './dropdown.spec';

describe('Dropdown', function () {
  addHelpers();

  describe('Components', function () {
    DropdownSpecs();
    DropdownMenuSpecs();
  });
});
