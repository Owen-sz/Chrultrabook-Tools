import { Component } from '@angular/core';
import { invoke } from "@tauri-apps/api/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from '@angular/forms';

interface Key {
    label: string;
    state: string;
    width?: number;
}

@Component({
  selector: 'app-rgb-keyboard',
  imports: [CommonModule, FormsModule],
  templateUrl: './rgb-keyboard.component.html',
  styleUrl: './rgb-keyboard.component.scss',
})
export class RgbKeyboardComponent {
  
      // RGB Controls
      rgbEnabled: boolean = true;
      brightness: number = 80;
      private _rgbRed: number = 255;
      private _rgbGreen: number = 100;
      private _rgbBlue: number = 255;
      private _hexCodeInput: string = 'FF64FF';
      rgbMode: string = "static";
      default_button_state: string = "btn-outline-secondary";
      selectedKeyIndex: { row: number, col: number } | null = null;

   keyboardLayout: Key[][] = [
    // Row 1 - Function keys
    [
        { label: "esc", state: this.default_button_state, width: 1 },
        { label: "\uF12F", state: this.default_button_state, width: 1 },
        { label: "\uF138", state: this.default_button_state, width: 1 },
        { label: "\uF116", state: this.default_button_state, width: 1 },
        { label: "\uF14D", state: this.default_button_state, width: 1 },
        { label: "\uF6CF", state: this.default_button_state, width: 1 },
        { label: "\uF1D4", state: this.default_button_state, width: 1 },
        { label: "\uF1D2", state: this.default_button_state, width: 1 },
        { label: "\uF60D", state: this.default_button_state, width: 1 },
        { label: "\uF60B", state: this.default_button_state, width: 1 },
        { label: "\uF611", state: this.default_button_state, width: 1 },
        { label: "\uF47B", state: this.default_button_state, width: 1 },
    ],
    // Row 2 - Number row
    [
        { label: "`", state: this.default_button_state, width: 1 },
        { label: "1", state: this.default_button_state, width: 1 },
        { label: "2", state: this.default_button_state, width: 1 },
        { label: "3", state: this.default_button_state, width: 1 },
        { label: "4", state: this.default_button_state, width: 1 },
        { label: "5", state: this.default_button_state, width: 1 },
        { label: "6", state: this.default_button_state, width: 1 },
        { label: "7", state: this.default_button_state, width: 1 },
        { label: "8", state: this.default_button_state, width: 1 },
        { label: "9", state: this.default_button_state, width: 1 },
        { label: "0", state: this.default_button_state, width: 1 },
        { label: "-", state: this.default_button_state, width: 1 },
        { label: "=", state: this.default_button_state, width: 1 },
        { label: "backspace", state: this.default_button_state, width: 2 }
    ],
    // Row 3 - QWERTY
    [
        { label: "tab", state: this.default_button_state, width: 1.5 },
        { label: "Q", state: this.default_button_state, width: 1 },
        { label: "W", state: this.default_button_state, width: 1 },
        { label: "E", state: this.default_button_state, width: 1 },
        { label: "R", state: this.default_button_state, width: 1 },
        { label: "T", state: this.default_button_state, width: 1 },
        { label: "Y", state: this.default_button_state, width: 1 },
        { label: "U", state: this.default_button_state, width: 1 },
        { label: "I", state: this.default_button_state, width: 1 },
        { label: "O", state: this.default_button_state, width: 1 },
        { label: "P", state: this.default_button_state, width: 1 },
        { label: "[", state: this.default_button_state, width: 1 },
        { label: "]", state: this.default_button_state, width: 1 },
        { label: "\\", state: this.default_button_state, width: 1.5 }
    ],
    // Row 4 - ASDF
    [
        { label: "\uF52A", state: this.default_button_state, width: 1.75 },
        { label: "A", state: this.default_button_state, width: 1 },
        { label: "S", state: this.default_button_state, width: 1 },
        { label: "D", state: this.default_button_state, width: 1 },
        { label: "F", state: this.default_button_state, width: 1 },
        { label: "G", state: this.default_button_state, width: 1 },
        { label: "H", state: this.default_button_state, width: 1 },
        { label: "J", state: this.default_button_state, width: 1 },
        { label: "K", state: this.default_button_state, width: 1 },
        { label: "L", state: this.default_button_state, width: 1 },
        { label: ";", state: this.default_button_state, width: 1 },
        { label: "'", state: this.default_button_state, width: 1 },
        { label: "Enter", state: this.default_button_state, width: 2.25 }
    ],
    // Row 5 - ZXCV
    [
        { label: "Shift", state: this.default_button_state, width: 2.25 },
        { label: "Z", state: this.default_button_state, width: 1 },
        { label: "X", state: this.default_button_state, width: 1 },
        { label: "C", state: this.default_button_state, width: 1 },
        { label: "V", state: this.default_button_state, width: 1 },
        { label: "B", state: this.default_button_state, width: 1 },
        { label: "N", state: this.default_button_state, width: 1 },
        { label: "M", state: this.default_button_state, width: 1 },
        { label: ",", state: this.default_button_state, width: 1 },
        { label: ".", state: this.default_button_state, width: 1 },
        { label: "/", state: this.default_button_state, width: 1 },
        { label: "Shift", state: this.default_button_state, width: 2.75 }
    ],
    // Row 6 - Bottom row
    [
        { label: "Ctrl", state: this.default_button_state, width: 1.25 },
        { label: "Alt", state: this.default_button_state, width: 1.25 },
        { label: "Space", state: this.default_button_state, width: 6.25 },
        { label: "Alt", state: this.default_button_state, width: 1.25 },
        { label: "Ctrl", state: this.default_button_state, width: 1.25 },
    ]
];

    get rgbColor(): string {
        return `rgb(${this.rgbRed}, ${this.rgbGreen}, ${this.rgbBlue})`;
    }

    get rgbOpacity(): number {
        return this.brightness / 100;
    }

    get rgbRed(): number { return this._rgbRed; }
    set rgbRed(value: number) {
        this._rgbRed = value;
        this.updateHexFromRgb();
    }

    get rgbGreen(): number { return this._rgbGreen; }
    set rgbGreen(value: number) {
        this._rgbGreen = value;
        this.updateHexFromRgb();
    }

    get rgbBlue(): number { return this._rgbBlue; }
    set rgbBlue(value: number) {
        this._rgbBlue = value;
        this.updateHexFromRgb();
    }

    get hexCodeInput(): string {return this._hexCodeInput; }
    set hexCodeInput(value: string)
    {
        this._hexCodeInput = value;
        this.updateRgbFromHex();
    }

    private updateHexFromRgb(): void {
        const r = this.rgbRed.toString(16).padStart(2, '0');
        const g = this.rgbGreen.toString(16).padStart(2, '0');
        const b = this.rgbBlue.toString(16).padStart(2, '0');
        // Update the backing field to prevent infinite loop from the setter
        this._hexCodeInput = `#${r}${g}${b}`.toUpperCase();
    }

    private updateRgbFromHex(): void {
        let hex = this._hexCodeInput.startsWith('#') ? this._hexCodeInput.slice(1) : this._hexCodeInput;

        // Ensure the hex code is a valid 6 characters
        if (hex.length === 6) {
            try {
                // Parse the hex string into separate R, G, B components
                const r = parseInt(hex.substring(0, 2), 16);
                const g = parseInt(hex.substring(2, 4), 16);
                const b = parseInt(hex.substring(4, 6), 16);

                // Update the backing fields (not the setters) to avoid infinite loop
                this._rgbRed = r;
                this._rgbGreen = g;
                this._rgbBlue = b;
            } catch (e) {
                // Optionally log an error if parsing fails, but generally parseInt handles this gracefully by returning NaN
            }
        }
    }
}
