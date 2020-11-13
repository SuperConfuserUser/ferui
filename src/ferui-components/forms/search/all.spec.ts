import SearchServiceSpec from './providers/search.service.spec';
import SearchContainerSpecs from './search-container.spec';
import SearchSpecs from './search.spec';

describe('Search component', function () {
  SearchServiceSpec();
  SearchSpecs();
  SearchContainerSpecs();
});
