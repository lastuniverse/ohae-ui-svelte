export class SizeNumber {
    private value!: number;
    private unit!: string;
    private original!: string;
    private needConvert: boolean;
    public readonly isNotParsed: boolean = true;
    
    constructor(size: string | number, needConvert: boolean = false) {
		this.needConvert = needConvert;
        this.original = size.toString();
        if (typeof size === "number") {
            this.value = size;
            this.unit = "px";
        } else {
            const match = size.trim().match(/^([-+]?\d*\.?\d+)(px|em|rem|%|vw|vh|vmin|vmax|ex|ch|cm|mm|in|pt|pc)?$/);
            if (!match) {
                // throw new Error(`Invalid size value: ${size}`);
                return;
            }
            this.isNotParsed = false;
            this.value = parseFloat(match[1]);
            this.unit = match[2] || "px";
        }
    }
    
    toNumber(): number {
        if(this.isNotParsed) throw new Error(`Value: ${this.original} cannot converted into number`); 
        return this.value;
    }
    
    toString(): string {
        if(this.isNotParsed) return this.original;
        return `${this.value}${this.unit}`;
    }
    
    toPx(): string {
        if(this.isNotParsed) throw new Error(`Value: ${this.original} cannot converted into number`); 
        return `${this.toPixels()}px`;
    }

	private toPixels(): number {
        if(this.isNotParsed) throw new Error(`Value: ${this.original} cannot converted into number`); 
        if (this.unit === "px") return this.value;
        if(!this.needConvert){
            throw new Error(`Cannot convert units '${this.unit}' to pixels`);
        }

        const div = document.createElement("div");
        div.style.position = "absolute";
        div.style.width = this.toString();
        document.body.appendChild(div);
        const pixels = parseFloat(getComputedStyle(div).width);
        document.body.removeChild(div);
        return pixels;
    }
    
    private operate(other: string | number | SizeNumber, operation: (a: number, b: number) => number): SizeNumber {
        if(this.isNotParsed) throw new Error(`Value: ${this.original} cannot converted into number`); 
        const otherSize = other instanceof SizeNumber ? other : new SizeNumber(other);
        if (this.unit !== otherSize.unit) {
            throw new Error(`Cannot operate on different units: ${this.unit} and ${otherSize.unit}`);
        }
        return new SizeNumber(operation(this.value, otherSize.value) + this.unit);
    }
    
    add(other: string | number | SizeNumber): SizeNumber {
        return this.operate(other, (a, b) => a + b);
    }
    
    subtract(other: string | number | SizeNumber): SizeNumber {
        return this.operate(other, (a, b) => a - b);
    }
    
    multiply(other: string | number | SizeNumber): SizeNumber {
        return this.operate(other, (a, b) => a * b);
    }
    
    divide(other: string | number | SizeNumber): SizeNumber {
        if (typeof other === "number" && other === 0 || (other instanceof SizeNumber && other.toNumber() === 0)) {
            throw new Error("Cannot divide by zero");
        }
        return this.operate(other, (a, b) => a / b);
    }
}
