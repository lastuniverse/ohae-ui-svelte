type UnknowColor = string | { r: number; g: number; b: number; a?: number } | null;
interface IRgba {
    r: number;
    g: number;
    b: number;
    a: number
};

interface IHsla {
    h: number;
    s: number;
    l: number;
    a: number
};

export class Color implements IRgba {
    r: number;
    g: number;
    b: number;
    a: number;

    constructor(color: UnknowColor) {
        const rgba = Color.parse(color);
        this.r = rgba.r;
        this.g = rgba.g;
        this.b = rgba.b;
        this.a = rgba.a;
    }

    /** Парсинг цвета из строкового представления */
    static parse(color: UnknowColor): IRgba {
        if (!color) {
            return { r: 0, g: 0, b: 0, a: 1 };
        }

        if (typeof color !== 'string') {
            return { ...color, a: color.a ?? 1 };
        }

        color = color.trim().toLowerCase();

        // HEX #RGB, #RGBA, #RRGGBB, #RRGGBBAA
        let hexMatch = color.match(/^#([0-9a-f]{3,8})$/i);
        if (hexMatch) {
            let hex = hexMatch[1];

            if (hex.length === 3) hex = hex.split("").map(x => x + x).join("");
            if (hex.length === 4) hex = hex.split("").map(x => x + x).join("");

            if (hex.length === 6 || hex.length === 8) {
                const r = parseInt(hex.substring(0, 2), 16);
                const g = parseInt(hex.substring(2, 4), 16);
                const b = parseInt(hex.substring(4, 6), 16);
                const a = hex.length === 8 ? parseInt(hex.substring(6, 8), 16) / 255 : 1;
                return { r, g, b, a };
            }
        }

        // RGB(A)
        let rgbaMatch = color.match(/^rgba?\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*(?:,\s*(\d*\.?\d+)\s*)?\)$/);
        if (rgbaMatch) {
            const r = Math.min(255, parseInt(rgbaMatch[1], 10));
            const g = Math.min(255, parseInt(rgbaMatch[2], 10));
            const b = Math.min(255, parseInt(rgbaMatch[3], 10));
            const a = rgbaMatch[4] !== undefined ? Math.min(1, parseFloat(rgbaMatch[4])) : 1;
            return { r, g, b, a };
        }

        // HSL(A)
        let hslaMatch = color.match(/^hsla?\(\s*(-?\d+)\s*,\s*(\d{1,3})%\s*,\s*(\d{1,3})%\s*(?:,\s*(\d*\.?\d+)\s*)?\)$/);
        if (hslaMatch) {
            let h = parseInt(hslaMatch[1], 10) % 360;
            if (h < 0) h += 360;
            let s = Math.min(1, parseInt(hslaMatch[2], 10) / 100);
            let l = Math.min(1, parseInt(hslaMatch[3], 10) / 100);
            let a = hslaMatch[4] !== undefined ? Math.min(1, parseFloat(hslaMatch[4])) : 1;

            const { r, g, b } = Color.hslToRgba(h, s, l, a);
            return { r, g, b, a };
        }

        throw new Error(`Неверный формат цвета: ${color}`);
    }

    getRgba(): IRgba {
        return { r: this.r, g: this.g, b: this.b, a: this.a }
    }

    /** Конвертация HSL → RGB */
    private static hslToRgba(h: number, s: number, l: number, a: number = 1): IRgba {
        let r, g, b;

        if (s === 0) {
            r = g = b = l;
        } else {
            const hueToRgb = (p: number, q: number, t: number) => {
                if (t < 0) t += 1;
                if (t > 1) t -= 1;
                if (t < 1 / 6) return p + (q - p) * 6 * t;
                if (t < 1 / 2) return q;
                if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
                return p;
            };

            let q = l < 0.5 ? l * (1 + s) : l + s - l * s;
            let p = 2 * l - q;
            h /= 360;

            r = hueToRgb(p, q, h + 1 / 3);
            g = hueToRgb(p, q, h);
            b = hueToRgb(p, q, h - 1 / 3);
        }

        return { r: Math.round(r * 255), g: Math.round(g * 255), b: Math.round(b * 255), a };
    }

    /** Конвертация RGB → HSL */
    private toHSL(): IHsla {
        let r = this.r / 255;
        let g = this.g / 255;
        let b = this.b / 255;

        let max = Math.max(r, g, b), min = Math.min(r, g, b);
        let h = 0, s, l = (max + min) / 2;

        if (max === min) {
            s = 0;
        } else {
            let d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            switch (max) {
                case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                case g: h = (b - r) / d + 2; break;
                case b: h = (r - g) / d + 4; break;
            }
            h *= 60;
        }

        return { h, s, l, a: this.a };
    }


    /** Возвращает цвет в формате HSL или HSLA */
    get hsl(): string {
        let { h, s, l, a } = this.toHSL();
        return `hsl(${h.toFixed(0)}, ${(s * 100).toFixed(0)}%, ${(l * 100).toFixed(0)}%)`;
    }

    get hsla(): string {
        let { h, s, l, a } = this.toHSL();
        return `hsla(${h.toFixed(0)}, ${(s * 100).toFixed(0)}%, ${(l * 100).toFixed(0)}%, ${this.a.toFixed(2)})`;
    }

    /** Возвращает цвет в формате HEX */
    get hex(): string {
        const r = this.r.toString(16).padStart(2, "0");
        const g = this.g.toString(16).padStart(2, "0");
        const b = this.b.toString(16).padStart(2, "0");
        return `#${r}${g}${b}`;
    }

    /** Возвращает цвет в формате HEX */
    get hexa(): string {
        const r = this.r.toString(16).padStart(2, "0");
        const g = this.g.toString(16).padStart(2, "0");
        const b = this.b.toString(16).padStart(2, "0");
        const a = Math.round(this.a * 255).toString(16).padStart(2, "0");
        return `#${this.hex}${this.a < 1 ? a : ""}`;
    }

    /** Возвращает цвет в формате RGB или RGBA */
    get rgb(): string {
        return `rgb(${this.r}, ${this.g}, ${this.b})`;
    }

    get rgba(): string {
        return `rgba(${this.r}, ${this.g}, ${this.b}, ${this.a.toFixed(2)})`;
    }

    get middle(): number {
        const middle = Math.round((this.r + this.g + this.b) / 3);
        return middle;
    }


    /** Изменение оттенка (Hue) */
    hue(degrees: number): Color {
        let hsla = this.toHSL();
        hsla.h = (hsla.h + degrees) % 360;
        if (hsla.h < 0) hsla.h += 360;

        const rgba = Color.hslToRgba(hsla.h, hsla.s, hsla.l, this.a);
        const color = new Color(rgba);
        return color;
    }

    /** Изменение насыщенности (Saturation) */
    saturation(factor: number): Color {
        let hsla = this.toHSL();
        hsla.s = Math.max(0, Math.min(1, hsla.s * factor));

        const rgba = Color.hslToRgba(hsla.h, hsla.s, hsla.l, this.a);
        const color = new Color(rgba);
        return color;
    }

    /** Изменение яркости (Brightness) */
    brightness(factor: number): Color {
        let hsla = this.toHSL();
        hsla.l = Math.max(0, Math.min(1, hsla.l * factor));

        const rgba = Color.hslToRgba(hsla.h, hsla.s, hsla.l, this.a);
        const color = new Color(rgba);
        return color;
    }

    /** Изменение яркости (сдвиг цвета) */
    shift(factor: number): Color {
        let rgba = this.getRgba();
        rgba.r = (rgba.r + factor + 256) % 256;
        rgba.g = (rgba.g + factor + 256) % 256;
        rgba.b = (rgba.b + factor + 256) % 256;
        const color = new Color(rgba);
        return color;
    }

    /** Изменение яркости (сдвиг цвета) */
    mono(): Color {
        let rgba = this.getRgba();
        const middle = this.middle;
        rgba.r = middle;
        rgba.g = middle;
        rgba.b = middle;
        const color = new Color(rgba);
        return color;
    }

    opacity(opacity: number): Color {
        let rgba = this.getRgba();
        rgba.a = Math.min(1, Math.max(0, opacity));
        const color = new Color(rgba);
        return color;
    }


    contrast(factor: number): Color {
        let rgba = this.getRgba();
        let size = 255 * factor;
        if (this.middle >= 128) size = -size
        rgba.r = Math.min(255, Math.max(1, rgba.r + size));
        rgba.g = Math.min(255, Math.max(1, rgba.g + size));
        rgba.b = Math.min(255, Math.max(1, rgba.b + size));
        const color = new Color(rgba);
        return color;
    }

}
