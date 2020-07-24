import {
  FuiModalCtrl,
  FuiModalWindowConfiguration,
  FuiModalWindowEnum,
  FuiModalWindowCtrl,
  FuiModalWindowScreen
} from '../interfaces/modals-interfaces';
import { FuiModalStandardWindowCtrlImpl } from '../models/windows/fui-modal-standard-window-ctrl';
import { FuiModalWizardWindowCtrlImpl } from '../models/windows/fui-modal-wizard-window-ctrl';
import { FuiModalHeadlessWindowCtrlImpl } from '../models/windows/fui-modal-headless-window-ctrl';
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
   */
  static getWindowInstance(
    modalCtrl: FuiModalCtrl,
    windowConfiguration?: FuiModalWindowConfiguration
  ): FuiModalWindowCtrl<FuiModalWindowScreen> {
    windowConfiguration = windowConfiguration || modalCtrl.mainWindowConfiguration;
    switch (FuiModalUtils.getWindowTypeFromConfig(windowConfiguration)) {
      case FuiModalWindowEnum.STANDARD:
        return new FuiModalStandardWindowCtrlImpl(modalCtrl, windowConfiguration);
      case FuiModalWindowEnum.WIZARD:
        return new FuiModalWizardWindowCtrlImpl(modalCtrl, windowConfiguration);
      default:
        return new FuiModalHeadlessWindowCtrlImpl(modalCtrl, windowConfiguration);
    }
  }
}
