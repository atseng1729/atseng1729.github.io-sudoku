const gameState = {
    selectedNumber: '1',
    index: -1,
    missing: -1
}

const base = 3;
const side = 9;
const rBase = [0, 1, 2];

const config = {
    type: Phaser.AUTO,
    width: 600,
    height: 800,
    backgroundColor: "#ffffff",
    scene: [StartScene, GameScene]
};

const game = new Phaser.Game(config)
