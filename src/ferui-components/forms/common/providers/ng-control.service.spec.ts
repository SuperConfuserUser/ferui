import { FormControl } from '@angular/forms';

import { NgControlService } from './ng-control.service';

export default function (): void {
  describe('NgControlService', function () {
    let service, testControl;

    beforeEach(() => {
      testControl = new FormControl(true);
      service = new NgControlService();
    });

    it('provides observable for control changes, passing the control', () => {
      const cb = jasmine.createSpy('cb');
      const sub = service.controlChanges.subscribe(control => cb(control));
      expect(cb).not.toHaveBeenCalled();
      service.setControl(testControl);
      expect(cb).toHaveBeenCalledWith(testControl);
      sub.unsubscribe();
    });
  });
}
