class StartScene extends Phaser.Scene {
	constructor() {
		super({ key: 'StartScene' })
	}

	create() {
		this.add.text(300, 250, 'Sudoku', {fill: '#000000', fontSize: '40px'}).setOrigin(0.5);
		this.add.text(300, 300, 'Choose Difficulty', {fill: '#000000', fontSize: '20px'}).setOrigin(0.5);
		let easyBox = this.add.rectangle(300, 375, 150, 50).setStrokeStyle(4, 0x444444).setOrigin(0.5).setInteractive()
			.on('pointerover', () => {easyBox.setFillStyle(0xdddddd)})
			.on('pointerout', () => {easyBox.setFillStyle(0xffffff)})
			.on('pointerdown', () => { gameState.missing = 35; this.scene.stop('StartScene'); this.scene.start('GameScene');});
		let easyText = this.add.text(300, 375, 'Easy', {fill: '#000000',fontSize: '20px'}).setOrigin(0.5);
		let mediumBox = this.add.rectangle(300, 450, 150, 50).setStrokeStyle(4, 0x444444).setOrigin(0.5).setInteractive()
			.on('pointerover', () => {mediumBox.setFillStyle(0xdddddd)})
			.on('pointerout', () => {mediumBox.setFillStyle(0xffffff)})
			.on('pointerdown', () => { gameState.missing = 45; this.scene.stop('StartScene'); this.scene.start('GameScene');});
		let mediumText = this.add.text(300, 450, 'Medium', {fill: '#000000',fontSize: '20px'}).setOrigin(0.5);
		let hardBox = this.add.rectangle(300, 525, 150, 50).setStrokeStyle(4, 0x444444).setOrigin(0.5).setInteractive()
			.on('pointerover', () => {hardBox.setFillStyle(0xdddddd)})
			.on('pointerout', () => {hardBox.setFillStyle(0xffffff)})
			.on('pointerdown', () => { gameState.missing = 50; this.scene.stop('StartScene'); this.scene.start('GameScene');});
		let hardText = this.add.text(300, 525, 'Hard', {fill: '#000000',fontSize: '20px'}).setOrigin(0.5);
	}
}
