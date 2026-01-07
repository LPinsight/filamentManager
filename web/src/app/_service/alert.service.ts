import { Injectable } from '@angular/core';
import { SweetAlertOptions } from 'sweetalert2';
import { Hersteller_alertService } from './alert/hersteller_alert.service';
import { Material_alertService } from './alert/material_alert.service';
import { Spule_alertService } from './alert/spule_alert.service';
import { Ort_alertService } from './alert/ort_alert.service';
import { Filament_alertService } from './alert/filament_alert.service';

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  constructor(
    public hersteller: Hersteller_alertService,
    public material: Material_alertService,
    public filament: Filament_alertService,
    public spule: Spule_alertService,
    public ort: Ort_alertService,
  ) { }

  public MixinConfig(steps: string[]): SweetAlertOptions {
    return {
      progressSteps: steps,
      confirmButtonText: 'Next &rarr;',
      cancelButtonText: '&larr; Back',
      inputAttributes: {
          required: 'true'
        },
      reverseButtons: true,
      validationMessage: 'This field is required'
    }
  }

  

}
