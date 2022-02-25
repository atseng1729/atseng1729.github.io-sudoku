const gameState = {
    selectedNumber: '1',
    index: -1,
    missing: -1,
    hintMode: 0
}

const base = 3;
const side = 9;
const rBase = [0, 1, 2];

var isMobile = false;
var width = 0.8 * Math.min(window.innerWidth, window.innerHeight);
var height = width;

window.addEventListener('touchstart', function () {
    isMobile = true;
    width = window.innerWidth;
    height = window.innerHeight;
})

const config = {
    type: Phaser.AUTO,
    width: width,
    height: height,
    backgroundColor: "#ffffff",
    scene: [StartScene, GameScene]
};

const game = new Phaser.Game(config)
