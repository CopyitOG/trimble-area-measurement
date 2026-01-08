/**
 * UI Button component for Area Measurement Tool
 * Integrates with Trimble Connect Viewer toolbar
 */

import { AreaMeasurementPlugin } from './AreaMeasurementPlugin';

/**
 * Creates and manages the "Measure Area" button for the Trimble Connect toolbar
 */
export class AreaMeasurementButton {
    private button: HTMLButtonElement;
    private plugin: AreaMeasurementPlugin;
    private isActive: boolean = false;

    /**
     * @param plugin - Instance of AreaMeasurementPlugin to control
     * @param toolbar - Optional toolbar element to attach button to
     */
    constructor(plugin: AreaMeasurementPlugin, toolbar?: HTMLElement) {
        this.plugin = plugin;
        this.button = this.createButton();

        // If toolbar provided, append button to it
        if (toolbar) {
            toolbar.appendChild(this.button);
        }
    }

    /**
     * Creates the HTML button element with styling
     */
    private createButton(): HTMLButtonElement {
        const button = document.createElement('button');
        button.className = 'tc-area-measurement-button';
        button.title = 'Measure Area (Hover)';
        button.setAttribute('aria-label', 'Measure Area');

        // Button content
        button.innerHTML = `
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M3 3h18v18H3V3z" stroke="currentColor" stroke-width="2" fill="none"/>
        <path d="M3 9h18M9 3v18" stroke="currentColor" stroke-width="2"/>
        <text x="12" y="17" font-size="10" text-anchor="middle" fill="currentColor">m²</text>
      </svg>
      <span class="button-text">Measure Area</span>
    `;

        // Add click handler
        button.addEventListener('click', this.onButtonClick.bind(this));

        // Apply default styles
        this.applyDefaultStyles(button);

        return button;
    }

    /**
     * Applies default CSS styles to the button
     */
    private applyDefaultStyles(button: HTMLButtonElement): void {
        Object.assign(button.style, {
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 12px',
            border: '1px solid #ccc',
            borderRadius: '4px',
            backgroundColor: '#ffffff',
            color: '#333',
            cursor: 'pointer',
            fontSize: '14px',
            fontFamily: 'system-ui, -apple-system, sans-serif',
            transition: 'all 0.2s ease',
            outline: 'none'
        });

        // Hover styles
        button.addEventListener('mouseenter', () => {
            if (!this.isActive) {
                button.style.backgroundColor = '#f0f0f0';
                button.style.borderColor = '#999';
            }
        });

        button.addEventListener('mouseleave', () => {
            if (!this.isActive) {
                button.style.backgroundColor = '#ffffff';
                button.style.borderColor = '#ccc';
            }
        });
    }

    /**
     * Button click handler - toggles the plugin on/off
     */
    private onButtonClick(): void {
        this.togglePlugin();
    }

    /**
     * Toggles the plugin activation state
     */
    public togglePlugin(): void {
        if (this.isActive) {
            this.deactivate();
        } else {
            this.activate();
        }
    }

    /**
     * Activates the plugin and updates button appearance
     */
    public activate(): void {
        this.plugin.activate();
        this.isActive = true;
        this.updateButtonState();
    }

    /**
     * Deactivates the plugin and updates button appearance
     */
    public deactivate(): void {
        this.plugin.deactivate();
        this.isActive = false;
        this.updateButtonState();
    }

    /**
     * Updates button visual state to reflect active/inactive
     */
    private updateButtonState(): void {
        if (this.isActive) {
            // Active state styling
            this.button.style.backgroundColor = '#0078d4'; // Trimble blue
            this.button.style.borderColor = '#005a9e';
            this.button.style.color = '#ffffff';
            this.button.setAttribute('aria-pressed', 'true');
        } else {
            // Inactive state styling
            this.button.style.backgroundColor = '#ffffff';
            this.button.style.borderColor = '#ccc';
            this.button.style.color = '#333';
            this.button.setAttribute('aria-pressed', 'false');
        }
    }

    /**
     * Returns the button DOM element for manual placement
     */
    public getButtonElement(): HTMLButtonElement {
        return this.button;
    }

    /**
     * Removes the button from the DOM and cleans up
     */
    public destroy(): void {
        // Deactivate plugin if active
        if (this.isActive) {
            this.deactivate();
        }

        // Remove button from DOM
        if (this.button.parentNode) {
            this.button.parentNode.removeChild(this.button);
        }
    }
}

/**
 * Example usage:
 * 
 * ```typescript
 * // Get viewer and API instances
 * const viewer = ...; // Trimble Connect Viewer instance
 * const viewerAPI = ...; // ViewerAPI instance
 * 
 * // Create plugin
 * const plugin = new AreaMeasurementPlugin(viewer, viewerAPI);
 * 
 * // Create button and add to toolbar
 * const toolbar = document.getElementById('viewer-toolbar');
 * const button = new AreaMeasurementButton(plugin, toolbar);
 * 
 * // Or get button element for manual placement
 * const buttonElement = button.getButtonElement();
 * document.body.appendChild(buttonElement);
 * ```
 */
