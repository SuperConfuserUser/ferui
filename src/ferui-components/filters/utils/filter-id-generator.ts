import { FeruiUtils } from '../../utils/ferui-utils';
import { FuiFilterEnum } from '../interfaces/filter.enum';

/**
 * Filter generator util class.
 */
export class FuiFilterIdGenerator {
  /**
   * Generate the filter prefix depending on the type.
   * @param filterType
   */
  static getFilterPrefix(filterType: string | FuiFilterEnum): string {
    return 'fuiFilter' + filterType;
  }

  /**
   * Generate a unique filter ID depending on its type.
   * @param filterType
   */
  static generateFilterId(filterType) {
    return FeruiUtils.generateUniqueId(FuiFilterIdGenerator.getFilterPrefix(filterType), '');
  }
}
