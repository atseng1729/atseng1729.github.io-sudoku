class StartScenePC extends Phaser.Scene {
	constructor() {
		super({ key: 'StartScenePC' })
	}

	create() {
		const fontSize = `${0.04 * w}px`;
		const boxWidth = 0.21 * w;
		const boxHeight = 0.07 * w;

		this.add.text(0.5 * w, 0.25 * h, 'Sudoku', {fill: '#000000', fontSize: `${0.08 * w}px`}).setOrigin(0.5);

		let boxY = 0.4 * h;
		let missing = 35;
		let easyBox = this.add.rectangle(midWidth, boxY, boxWidth, boxHeight)
			.setStrokeStyle(4, 0x444444).setOrigin(0.5).setInteractive()
			.on('pointerover', () => {easyBox.setFillStyle(0xdddddd)})
			.on('pointerout', () => {easyBox.setFillStyle(0xffffff)})
			.on('pointerdown', () => { gameState.missing = missing; this.scene.stop('StartScenePC'); this.scene.start('GameScenePC'); });
		let easyText = this.add.text(midWidth, boxY, 'Easy', {fill: '#000000', fontSize: fontSize}).setOrigin(0.5);

		boxY = 0.5 * h;
		missing = 45;
		let midBox = this.add.rectangle(midWidth, boxY, boxWidth, boxHeight)
			.setStrokeStyle(4, 0x444444).setOrigin(0.5).setInteractive()
			.on('pointerover', () => {midBox.setFillStyle(0xdddddd)})
			.on('pointerout', () => {midBox.setFillStyle(0xffffff)})
			.on('pointerdown', () => { gameState.missing = missing; this.scene.stop('StartScenePC'); this.scene.start('GameScenePC'); });
		let midText = this.add.text(midWidth, boxY, 'Medium', {fill: '#000000', fontSize: fontSize}).setOrigin(0.5);

		boxY = 0.6 * h;
		missing = 55;
		let hardBox = this.add.rectangle(midWidth, boxY, boxWidth, boxHeight)
			.setStrokeStyle(4, 0x444444).setOrigin(0.5).setInteractive()
			.on('pointerover', () => {hardBox.setFillStyle(0xdddddd)})
			.on('pointerout', () => {hardBox.setFillStyle(0xffffff)})
			.on('pointerdown', () => { gameState.missing = missing; this.scene.stop('StartScenePC'); this.scene.start('GameScenePC'); });
		let hardText = this.add.text(midWidth, boxY, 'Hard', {fill: '#000000', fontSize: fontSize}).setOrigin(0.5);
	}
}
