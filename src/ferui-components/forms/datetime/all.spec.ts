import { addHelpers } from '../tests/helpers.spec';

import DatetimeContainerSpecs from './datetime-container.spec';
import DatetimeFormControlServiceSpecs from './providers/datetime-form-control.service.spec';
import DatetimeIOServiceSpecs from './providers/datetime-io.service.spec';

describe('Datetime Input', function () {
  addHelpers();

  describe('Providers', function () {
    DatetimeIOServiceSpecs();
    DatetimeFormControlServiceSpecs();
  });

  describe('Components', function () {
    DatetimeContainerSpecs();
  });
});
