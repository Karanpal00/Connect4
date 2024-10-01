import { renderer } from "./renderer.js";

export default class Piece {
    constructor(constant, baseColor, ctx, size, innerAlpha, outerAlpha, df = false) {
        this.ctx = ctx;
        this.cellSize = renderer.cellSize*size;
        this.color = this.hexToRgb(baseColor);
        this.x0 = 0;
        this.x1 = 0;
        this.y0 = 0;
        this.y1 = 0;
        if (df && renderer.cellSize >= 70) {
            this.x0 = -1;
            this.y0 = 4;
        } else if (df && renderer.cellSize >= 50) {
            this.y0 = 2.5;
        }
        
        
        this.gradient = ctx.createRadialGradient(this.x0, this.y0, this.cellSize*constant, this.x1, this.y1, this.cellSize);

        if (df === true) {
            this.gradient.addColorStop(0.5, "#6b6b6b");
        } else {
            this.gradient.addColorStop(0.5, `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, ${innerAlpha})`);
        }
        this.gradient.addColorStop(0.7, `rgba(${this.color.r - 50}, ${this.color.g - 50}, ${this.color.b - 50}, ${outerAlpha})`);
    }

    render(x, y) {
        this.ctx.save(); 
        this.ctx.beginPath();
        this.ctx.translate(x, y);
        this.ctx.fillStyle = this.gradient;
        this.ctx.arc(0, 0, this.cellSize, 0, 2 * Math.PI);
        this.ctx.fill();
        this.ctx.restore(); 
    }

    hexToRgb(hex) {
        let bigint = parseInt(hex.slice(1), 16);
        let r = (bigint >> 16) & 255;
        let g = (bigint >> 8) & 255;
        let b = bigint & 255;
        return { r, g, b };
    }
}
