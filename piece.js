export default class Piece {
    constructor(cellSize,constant,baseColor,ctx, x0, x1, y0, y1, alpha, df) {
        this.ctx = ctx;
        this.cellSize = cellSize*0.4;
        this.color = this.hexToRgb(baseColor);
        this.x0 = x0;
        this.x1 = x1;
        this.y0 = y0;
        this.y1 = y1;
        this.alpha = alpha;
        this.df = df;
        this.constant = constant;
        
        this.gradient = ctx.createRadialGradient(this.x0, this.y0, this.cellSize*this.constant, this.x1, this.y1, this.cellSize);
        if (df === true) {
            this.gradient.addColorStop(0.5, "white");
        } else {
            this.gradient.addColorStop(0.5, `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, 1)`);
        }
        this.gradient.addColorStop(0.7, `rgba(${this.color.r - 50}, ${this.color.g - 50}, ${this.color.b - 50}, ${this.alpha})`); 

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
