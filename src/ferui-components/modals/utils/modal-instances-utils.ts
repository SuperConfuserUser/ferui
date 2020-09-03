import {
  FuiModalCtrl,
  FuiModalWindowConfiguration,
  FuiModalWindowCtrl,
  FuiModalWindowEnum,
  FuiModalWindowScreen
} from '../interfaces/modals-interfaces';
import { FuiModalErrorWindowCtrlImpl } from '../models/windows/fui-modal-error-window-ctrl';
import { FuiModalHeadlessWindowCtrlImpl } from '../models/windows/fui-modal-headless-window-ctrl';
import { FuiModalStandardWindowCtrlImpl } from '../models/windows/fui-modal-standard-window-ctrl';
import { FuiModalWizardWindowCtrlImpl } from '../models/windows/fui-modal-wizard-window-ctrl';

import { FuiModalUtils } from './modal-utils';

/**
 * FerUI modals instance utils class
 */
export class FuiModalInstancesUtils {
  protected constructor() {}

  /**
   * Get the instantiated window class depending on the window type.
   * @param modalCtrl The modal controller to pass in to the window.
   * @param windowConfiguration The window configuration.
   * @param error Whether or not we want to get the error component.
   * @returns Return the appropriate window controller.
   */
  static getWindowInstance(
    modalCtrl: FuiModalCtrl,
    windowConfiguration?: FuiModalWindowConfiguration,
    error?: boolean
  ): FuiModalWindowCtrl<FuiModalWindowScreen> {
    windowConfiguration = windowConfiguration || modalCtrl.mainWindowConfiguration;
    switch (FuiModalUtils.getWindowTypeFromConfig(windowConfiguration, error)) {
      case FuiModalWindowEnum.ERROR:
        return new FuiModalErrorWindowCtrlImpl(modalCtrl, windowConfiguration);
      case FuiModalWindowEnum.STANDARD:
        return new FuiModalStandardWindowCtrlImpl(modalCtrl, windowConfiguration);
      case FuiModalWindowEnum.WIZARD:
        return new FuiModalWizardWindowCtrlImpl(modalCtrl, windowConfiguration);
      default:
        return new FuiModalHeadlessWindowCtrlImpl(modalCtrl, windowConfiguration);
    }
  }
}
