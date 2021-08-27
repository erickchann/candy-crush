class Candy {
    constructor(opt) {
        this.x = opt.x;
        this.y = opt.y;
        this.type = opt.type;

        this.selected = false;
        this.destroyed = false;

        this.toX = opt.toX;
        if (this.toX == undefined) this.toX = this.x;

        this.toY = opt.toY;
        if (this.toY == undefined) this.toY = this.y;

        this.draw();
    }

    draw() {
        ctx.drawImage(image, size * this.type, 0, size, size, this.x, this.y, size, size);

        if (this.destroyed) {
            ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
            
            ctx.beginPath();
            ctx.arc(this.x + size / 2, this.y + size / 2, size * 0.4, 0, Math.PI * 2);
            ctx.fill();

            ctx.beginPath();
            ctx.font = '30px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillStyle = 'black';
            ctx.fillText('3', this.x + size / 2, this.y + size /2);
        }

        if (this.selected) {
            ctx.beginPath();
            ctx.strokeStyle = 'red';
            ctx.rect(this.x, this.y, size, size);
            ctx.stroke();
        }
    }
}