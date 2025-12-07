import { Component, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { invoke } from "@tauri-apps/api/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from '@angular/forms';

const ANIMATION_INTERVAL = 20;

interface Key {
    label: string;
    state: string;
    width?: number;
}

interface CustomColor {
    id: number;
    hexCode: string;
    duration: number;
}

@Component({
  selector: 'app-rgb-keyboard',
  imports: [CommonModule, FormsModule],
  templateUrl: './rgb-keyboard.component.html',
  styleUrl: './rgb-keyboard.component.scss',
})
export class RgbKeyboardComponent implements OnDestroy {
  
      private _rgbEnabled: boolean = true;
      brightness: number = 80;
      private _rgbRed: number = 255;
      private _rgbGreen: number = 100;
      private _rgbBlue: number = 255;
      private _hexCodeInput: string = 'FF64FF';
      private _rgbMode: string = "static";
      default_button_state: string = "btn-outline-secondary";
      selectedKeyIndex: { row: number, col: number } | null = null;

      private colorCycleInterval: any;
      private currentColorIndex: number = 0;
      private currentStepStartTime: number = 0;

      customColors: CustomColor[] = [
          { id: 1, hexCode: '#FF0000', duration: 1000 },
          { id: 2, hexCode: '#00FF00', duration: 1500 },
          { id: 3, hexCode: '#0000FF', duration: 800 },
      ];
      private nextCustomColorId: number = 4;

   keyboardLayout: Key[][] = [
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
    [
        { label: "Ctrl", state: this.default_button_state, width: 1.25 },
        { label: "Alt", state: this.default_button_state, width: 1.25 },
        { label: "Space", state: this.default_button_state, width: 6.25 },
        { label: "Alt", state: this.default_button_state, width: 1.25 },
        { label: "Ctrl", state: this.default_button_state, width: 1.25 },
    ]
];
    
    constructor(private cdr: ChangeDetectorRef) {} // Inject ChangeDetectorRef
    
    get rgbEnabled(): boolean { return this._rgbEnabled; }
    set rgbEnabled(value: boolean) {
        this._rgbEnabled = value;
        if (this._rgbEnabled && this.rgbMode === 'custom') {
            this.startColorCycle();
        } else {
            this.stopColorCycle();
        }
    }
    
    get rgbMode(): string { return this._rgbMode; }
    set rgbMode(value: string) {
        this._rgbMode = value;
        this.stopColorCycle();

        if (this._rgbMode === 'custom' && this.rgbEnabled) {
            this.startColorCycle();
        }
        if (this._rgbMode === 'static') {
            this.updateHexFromRgb();
        }
    }

    get rgbColor(): string {
        return `rgb(${Math.round(this.rgbRed)}, ${Math.round(this.rgbGreen)}, ${Math.round(this.rgbBlue)})`;
    }

    get rgbOpacity(): number {
        return this.brightness / 100;
    }

    get rgbRed(): number { return this._rgbRed; }
    set rgbRed(value: number) {
        this._rgbRed = Math.max(0, Math.min(255, value));
        this.updateHexFromRgb();
    }

    get rgbGreen(): number { return this._rgbGreen; }
    set rgbGreen(value: number) {
        this._rgbGreen = Math.max(0, Math.min(255, value));
        this.updateHexFromRgb();
    }

    get rgbBlue(): number { return this._rgbBlue; }
    set rgbBlue(value: number) {
        this._rgbBlue = Math.max(0, Math.min(255, value));
        this.updateHexFromRgb();
    }

    get hexCodeInput(): string {return this._hexCodeInput; }
    set hexCodeInput(value: string)
    {
        this._hexCodeInput = value;
        this.updateRgbFromHex();
    }

    private _updateRgbFromHex(hex: string): { r: number, g: number, b: number } | null {
        let cleanHex = hex.startsWith('#') ? hex.slice(1) : hex;
        if (cleanHex.length === 6) {
            try {
                const r = parseInt(cleanHex.substring(0, 2), 16);
                const g = parseInt(cleanHex.substring(2, 4), 16);
                const b = parseInt(cleanHex.substring(4, 6), 16);
                if (!isNaN(r) && !isNaN(g) && !isNaN(b)) {
                    return {
                        r: Math.max(0, Math.min(255, r)),
                        g: Math.max(0, Math.min(255, g)),
                        b: Math.max(0, Math.min(255, b))
                    };
                }
            } catch (e) { }
        }
        return null;
    }

    private updateHexFromRgb(): void {
        const r = Math.round(this.rgbRed).toString(16).padStart(2, '0');
        const g = Math.round(this.rgbGreen).toString(16).padStart(2, '0');
        const b = Math.round(this.rgbBlue).toString(16).padStart(2, '0');
        this._hexCodeInput = `#${r}${g}${b}`.toUpperCase();
    }

    private updateRgbFromHex(): void {
        const rgb = this._updateRgbFromHex(this._hexCodeInput);
        if (rgb) {
            this._rgbRed = rgb.r;
            this._rgbGreen = rgb.g;
            this._rgbBlue = rgb.b;
        }
    }
    
    public ngOnDestroy(): void {
        this.stopColorCycle();
    }

    public startColorCycle(): void {
        this.stopColorCycle();

        if (this.customColors.length < 1 || !this.rgbEnabled || this.rgbMode !== 'custom') {
            return;
        }
        
        this.currentColorIndex = 0;
        this.currentStepStartTime = Date.now();
        
        const startRgb = this._updateRgbFromHex(this.customColors[0].hexCode);
        if (startRgb) {
            this._rgbRed = startRgb.r;
            this._rgbGreen = startRgb.g;
            this._rgbBlue = startRgb.b;
        }
        
        // Start the interval which will now force change detection
        this.colorCycleInterval = setInterval(() => this.updateColorTransition(), ANIMATION_INTERVAL);
    }

    private updateColorTransition(): void {
        if (this.customColors.length < 1 || !this.rgbEnabled || this.rgbMode !== 'custom') {
            this.stopColorCycle();
            return;
        }
        
        const now = Date.now();
        
        const previousIndex = this.currentColorIndex;
        const targetIndex = (this.currentColorIndex + 1) % this.customColors.length;

        const currentConfig = this.customColors[previousIndex];
        const nextConfig = this.customColors[targetIndex];
        
        const duration = Math.max(1, currentConfig.duration);
        const elapsed = now - this.currentStepStartTime;
        const progress = Math.min(1, elapsed / duration);

        const startR = this._rgbRed;
        const startG = this._rgbGreen;
        const startB = this._rgbBlue;

        const targetRgb = this._updateRgbFromHex(nextConfig.hexCode);
        
        if (!targetRgb) {
            this.stopColorCycle();
            return;
        }

        if (progress < 1) {
            this._rgbRed = startR + (targetRgb.r - startR) * progress;
            this._rgbGreen = startG + (targetRgb.g - startG) * progress;
            this._rgbBlue = startB + (targetRgb.b - startB) * progress;
        } else {
            this._rgbRed = targetRgb.r;
            this._rgbGreen = targetRgb.g;
            this._rgbBlue = targetRgb.b;
            
            this.currentColorIndex = targetIndex;
            this.currentStepStartTime = now;
        }
        
        // <-- THE FIX: Manually trigger change detection -->
        this.cdr.detectChanges(); 
    }

    public stopColorCycle(): void {
        if (this.colorCycleInterval) {
            clearInterval(this.colorCycleInterval);
            this.colorCycleInterval = null;
            this.currentStepStartTime = 0;
        }
    }

    public addCustomColor(): void {
        this.customColors.push({
            id: this.nextCustomColorId++,
            hexCode: '#FFFFFF',
            duration: 1000
        });
        if (this.rgbMode === 'custom' && this.rgbEnabled) {
            this.startColorCycle();
        }
    }

    public removeCustomColor(id: number): void {
        if (this.customColors.length > 1) {
            this.customColors = this.customColors.filter(color => color.id !== id);
            
            if (this.rgbMode === 'custom' && this.rgbEnabled) {
                this.startColorCycle();
            }
        }
    }

    get isCustomMode(): boolean {
        return this.rgbMode === 'custom';
    }
}