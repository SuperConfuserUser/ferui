import { addHelpers } from '../tests/helpers.spec';

import NumberInputContainerSpecs from './number-container.spec';
import NumberInputSpecs from './number.spec';
import NumberIOServiceSpecs from './providers/number-io.service.spec';

describe('Number Input', function () {
  addHelpers();

  describe('Providers', function () {
    NumberIOServiceSpecs();
  });

  describe('Components', function () {
    NumberInputContainerSpecs();
    NumberInputSpecs();
  });
});
