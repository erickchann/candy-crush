class Game {
    constructor() {
        this.candy = [
            [],
            [],
            [],
            [],
            [],
            [],
            [],
            []
        ];

        this.dir = [
            [0, 1],
            [0, -1],
            [1, 0],
            [-1, 0]
        ];

        this.temp = null;
        this.selectedCandy = null;

        this.back = false;

        this.init();
        this.update();
        this.lisntener();
    }

    init() {
        for (let y = 0; y < len; y++) {
            for (let x = 0; x < len; x++) {
                this.candy[y].push(new Candy({
                    x: x * size,
                    y: y * size,
                    type: ~~(Math.random() * 6)
                }));
            }   
        }

        this.noSame();
    }

    lisntener() {
        canvas.addEventListener('click', e => {
            let x = ~~(e.offsetX / size);
            let y = ~~(e.offsetY / size);

            if (this.temp == null) {
                this.temp = [x, y];
                this.selectedCandy = [x, y];
                
                this.candy[y][x].selected = true;
            } else {
                this.selectedCandy.push(x, y); 

                this.change();
                this.clearSelected();
            }
        });
    }

    change() {
        this.temp = null;

        let [x, y, x2, y2] = this.selectedCandy;

        let candy1 = this.candy[y][x];
        let candy2 = this.candy[y2][x2];

        candy1.toX = candy2.x;
        candy1.toY = candy2.y;

        candy2.toX = candy1.x;
        candy2.toY = candy1.y;

        this.swap();
    }

    swap() {
        let [x, y, x2, y2] = this.selectedCandy;

        let candy1 = this.candy[y][x];
        let candy2 = this.candy[y2][x2];

        if (candy1.x != candy1.toX || candy1.y != candy1.toY || candy2.x != candy2.toX || candy2.y != candy2.toY) {
            this.animateSwap(candy1);
            this.animateSwap(candy2);

            setTimeout(() => {
                this.swap();
            }, 10);
        } else {
            let temp = this.candy[y][x];
            this.candy[y][x] = this.candy[y2][x2];
            this.candy[y2][x2] = temp;

            if (!this.back) {
                if (!this.check()) {
                    this.change();
                    
                    this.back = true;
                } else {
                    this.back = false;
                }
            } else {
                this.back = false;
            }
        }
    }

    check() {
        let sum = 0;

        for (let y = 0; y < len; y++) {
            for (let x = 0; x < len; x++) {
                if (this.destroyCandy(x, y)) sum++;
            }   
        }

        setTimeout(() => {
            this.generateCandy();
        }, 500);

        return sum > 0;
    }

    generateCandy() {
        for (let i = len - 1; i >= 0; i--) {
            for (let j = 0; j < len; j++) {
                if (this.candy[i][j].destroyed) {
                    let row = this.countRow(j, i);
                    this.goDown(j, i, row);
                }
            }
        }
    }

    countRow(x, y) {
        let sum = 0;

        while (y >= 0 && y < len && this.candy[y][x].destroyed) {
            sum++;
            y--;
        }

        return sum;
    }

    goDown(x, y, row) {
        for (let i = y - row; i >= 0; i--) {
            this.candy[i + row][x] = this.candy[i][x];
            this.candy[i + row][x].toY += row * size;
        }

        for (let j = row - 1; j >= 0; j--) {
            let toY = j * size;
            let type = ~~(Math.random() * 6);

            this.candy[j][x] = new Candy({
                x: x * size,
                y: (j - row) * size,
                toY: toY,
                type: type
            });
        }

        for (let a = 0; a <= y; a++) {
            this.animate(x, a);
        }
    }

    animate(x, y) {
        if (this.candy[y][x].y < this.candy[y][x].toY) {
            this.candy[y][x].y += 10;
            setTimeout(() => {
              this.animate(x, y);
            }, 10);
        } else {
            setTimeout(() => {
                this.check();
            }, 1000);
        }
    }

    destroyCandy(x, y) {
        let sum = false;

        this.dir.forEach(val => {
            let [dirX, dirY] = val;

            if (this.inBoard(x + dirX, y + dirY) && this.inBoard(x + dirX + dirX, y + dirY + dirY) && this.candy[y][x].type == this.candy[y + dirY][x + dirX].type && this.candy[y][x].type == this.candy[y + dirY + dirY][x + dirX + dirX].type) {
                let current = this.candy[y][x].type;                

                let tempX = x;
                let tempY = y;

                while (this.inBoard(tempX, tempY) && this.candy[tempY][tempX].type == current) {
                    this.candy[tempY][tempX].destroyed = true;

                    tempX += dirX;
                    tempY += dirY;
                }

                sum = true;
            }
        });

        return sum;
    }

    animateSwap(candy) {
        if (candy.x < candy.toX) candy.x += 5;
        else if (candy.x > candy.toX) candy.x -= 5;

        if (candy.y < candy.toY) candy.y += 5;
        else if (candy.y > candy.toY) candy.y -= 5;
    }

    clearSelected() {
        let [x, y, x2, y2] = this.selectedCandy;

        this.candy[y][x].selected = false;
        this.candy[y2][x2].selected = false;
    }

    noSame() {
        for (let y = 0; y < len; y++) {
            for (let x = 0; x < len; x++) {
                this.dir.forEach(val => {
                    let [dirX, dirY] = val;

                    if (this.inBoard(x + dirX, y + dirY) && this.inBoard(x + dirX + dirX, y + dirY + dirY) && this.candy[y][x].type == this.candy[y + dirY][x + dirX].type && this.candy[y][x].type == this.candy[y + dirY + dirY][x + dirX + dirX].type) {
                        let arr = [0, 1, 2, 3, 4, 5];

                        this.dir.forEach(val => {
                            let [dirX, dirY] = val;

                            if (this.inBoard(x + dirX, y + dirY) && this.candy[y][x].type == this.candy[y + dirY][x + dirX].type) {
                                arr.splice(this.candy[y][x].type, 1);
                            }
                        });

                        this.candy[y][x].type = arr[~~(Math.random() * arr.length)];
                    }
                });
            }   
        }
    }

    inBoard(x, y) {
        return x >= 0 && y >= 0 && x < len && y < len;
    }

    update() {
        ctx.clearRect(0, 0, w, h);
        this.drawCandy();

        setTimeout(() => {
            this.update();
        }, 10);
    }

    drawCandy() {
        this.candy.forEach(row => {
            row.forEach(col => {
                col.draw();
            });
        });
    }
}