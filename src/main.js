const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

const w = canvas.width;
const h = canvas.height;

const len = 8;
const size = w / 8;

const image = new Image();
image.src = 'asset/sprite.png';

let game;

window.onload = init();

function init() {
    game = new Game();
}