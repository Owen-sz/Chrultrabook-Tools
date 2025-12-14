import { Component } from '@angular/core';
import { invoke } from '@tauri-apps/api/core';

@Component({
  selector: 'app-battery',
  imports: [],
  templateUrl: './battery.component.html',
  styleUrl: './battery.component.scss',
})
export class BatteryComponent {
  oldec: boolean = false;
  public currentMode: 'Normal' | 'Idle' | 'Discharge' = 'Normal';

  public selectMode(newMode: 'Normal' | 'Idle' | 'Discharge'): void {
    this.currentMode = newMode;
  }
  ngOnInit()
  {
    invoke("execute", {
      program: "ectool",
      arguments: ["chargecontrol"],
      reply: true,
    }).then((event) => {
      if(typeof event == 'string')
      {
        let output = event.split(' ')[0].substring(0,5).toLowerCase();
        console.log(output);
        if(output == "error")
        {
            this.oldec = false;
        }
      }
    });
  }

  apply_limits()
  {
    let lower_charge = (
      document.getElementById("lowerchargecontrol") as HTMLInputElement
    ).value;

    let upper_charge = (
      document.getElementById("upperchargecontrol") as HTMLInputElement
    ).value;

    invoke("execute", {
      program: "ectool",
      arguments: ["chargecontrol", "normal", lower_charge,upper_charge],
      reply: true,
    }).then((event) => {
      //console.log(event)
      })
  }

  apply_mode()
  {
    let mode = (
      document.getElementById("mode_battery") as HTMLInputElement
    ).value;

    invoke("execute", {
      program: "ectool",
      arguments: ["chargecontrol", "normal", mode],
      reply: true,
    })

    console.log(mode);
  }

  apply_maximum_current()
  {

    let value = (
      document.getElementById("maxcurrent") as HTMLInputElement
    ).value;
    invoke("execute", {
      program: "ectool",
      arguments: ["chargecurrentlimit", value],
      reply: true,
    })
  }

}
