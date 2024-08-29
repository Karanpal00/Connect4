export const pieceCreator = {
    createPiece(ctx, x, y, radius, baseColor) {

        const color = this.hexToRgb(baseColor);

        const gradient = ctx.createRadialGradient(x, y, radius * 0.6, x, y, radius);
        gradient.addColorStop(0.5, `rgba(${color.r}, ${color.g}, ${color.b}, 1)`); // Base color
        gradient.addColorStop(0.7, `rgba(${color.r - 50}, ${color.g - 50}, ${color.b - 50}, 1)`); // Darker shade

        ctx.beginPath();
        ctx.arc(x, y, radius, 0, 2 * Math.PI);
        ctx.fillStyle = gradient;
        ctx.fill();
        ctx.closePath();

        // Adding concentric circles to simulate the ridged effect
        for (let i = 1; i < 1; i += 0.5) {
            ctx.beginPath();
            ctx.arc(x, y, radius * i, 0, 2 * Math.PI);
            ctx.strokeStyle = `rgba(0, 0, 0, 0.1)`; // Light black for the ridges
            ctx.lineWidth = 2;
            //ctx.stroke();
            ctx.closePath();
        }
    },

    hexToRgb(hex) {
        let bigint = parseInt(hex.slice(1), 16);
        let r = (bigint >> 16) & 255;
        let g = (bigint >> 8) & 255;
        let b = bigint & 255;
        return { r, g, b };
    }
};
