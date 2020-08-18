import { FuiModalWindowConfiguration, FuiModalWindowEnum } from '../interfaces/modals-interfaces';

/**
 * FerUI modals utils class
 */
export class FuiModalUtils {
  protected constructor() {}

  /**
   * Get the window type from configuration object.
   * @param windowConfig The window configuration object.
   */
  static getWindowTypeFromConfig(windowConfig: FuiModalWindowConfiguration): FuiModalWindowEnum {
    if (windowConfig.wizardSteps) {
      return FuiModalWindowEnum.WIZARD;
    } else if (
      !!windowConfig.title ||
      !!windowConfig.subtitle ||
      !!windowConfig.titleTemplate ||
      !!windowConfig.closeButton ||
      !!windowConfig.submitButton ||
      !!windowConfig.cancelButton
    ) {
      return FuiModalWindowEnum.STANDARD;
    } else {
      return FuiModalWindowEnum.HEADLESS;
    }
  }
}
