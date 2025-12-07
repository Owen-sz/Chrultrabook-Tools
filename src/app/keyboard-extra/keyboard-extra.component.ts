import { Component } from "@angular/core";
import { RouterLink, RouterOutlet } from "@angular/router";
import { invoke } from "@tauri-apps/api/core";


@Component({
  selector: "app-keyboard-extra",
  standalone: true,
  imports: [RouterLink, RouterOutlet],
  templateUrl: "./keyboard-extra.component.html",
  styleUrl: "./keyboard-extra.component.scss",
})
export class KeyboardExtraComponent {
  remap: string = "active";
  rgb_class: string = "";

  current_title: string = "Keyboard Remapping";
  current_img: string = "../../assets/keyboard/keyboard.svg";

  rgb_enabled: boolean = true;

  ngOnInit()
  {
    invoke("execute", {
      program: "ectool",
      arguments: ["rgbkbd", "getconfig"],
      reply: true,
    }).then((event) => {
        let output: any = event;
        let split = output.split(" ");

        if(split[0] == 'Ec')
        {
            this.rgb_enabled = false;
        }

    })
  }

  removeActive() {
    this.remap = " ";
    this.rgb_class = " ";
  }

  keyboard_remap() {
    this.removeActive();
    this.remap = "active";
    this.current_title = "Keyboard Remapping";
    this.current_img = "../../assets/keyboard/keyboard.svg";
  }

  rgb() {
    this.removeActive();
    this.rgb_class = "active";
    this.current_title = "RGB Lighting Control";
    this.current_img = "../../assets/activity_light/activity.svg";
  }
}
