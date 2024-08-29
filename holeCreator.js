export const holeCreator = {
    createPiece(ctx, x, y, radius) {
        const gradient = ctx.createRadialGradient(x, y+5, radius*0.4, x, y, radius);
        gradient.addColorStop(0.7, '#00000000');
        gradient.addColorStop(1, '#aaaaaaff');

        

        ctx.beginPath()
        ctx.fillStyle = gradient;
        ctx.arc(x, y, radius, 0, 2 * Math.PI)
        ctx.fill();
        ctx.closePath();
       

    }
};
