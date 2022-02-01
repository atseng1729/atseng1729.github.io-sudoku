class GameScene extends Phaser.Scene {
	constructor() {
		super({ key: 'GameScene' })
	}

    // pseudo random shuffling algorithm
    shuffle(array) {
        return array.slice().sort((a, b) => 0.5 - Math.random())
    }

    pattern(r, c) {
        return (base * (r % base) + Math.floor(r / base) + c) % side
    }

    solution() {
        const nums = this.shuffle(['1', '2', '3', '4', '5', '6', '7', '8', '9'])
        let solution = [];
        const [srBase1, srBase2, srBase3, srBase4] = [this.shuffle(rBase), this.shuffle(rBase), this.shuffle(rBase), this.shuffle(rBase)]
        for (const r of srBase1) {
            for (const g1 of srBase2) {
                for (const c of srBase3) {
                    for (const g2 of srBase4) {
                        solution.push(nums[this.pattern(g1 * base + r, g2 * base + c)])
                    }
                }
            }
        }
        return solution;
    }

    board(solution) {
        var blank_indices = new Set();
        while (blank_indices.size < gameState.missing) {
            blank_indices.add(Math.floor(Math.random() * 81))
        }
        return solution.map(function(val, index) {
            if (blank_indices.has(index)) {
                return '';
            }
            return val;
        })
    }

    create() {
        gameState.solution = this.solution();
        gameState.start = this.board(gameState.solution);
        gameState.entries = gameState.start.slice();

        // create game borders
        let borders = this.add.group();
        for (x of [150, 300, 450]) {
            for (y of [250, 400, 550]) {
                borders.add(this.add.rectangle(x, y, 150, 150).setStrokeStyle(4, 0x444444).setDepth(1));
            }
        }

        // create sodoku squares
        gameState.squares = [];
        gameState.texts = [];
        for (let i = 0; i < 81; i++) {
            var x = 100 + 50 * (i % 9);
            var y = 200 + 50 * Math.floor(i / 9);

            let square = this.add.rectangle(x, y, 50, 50).setStrokeStyle(1, 0x444444).setInteractive();
            let text = this.add.text(x - 12, y - 17, gameState.entries[i], { fontSize: '40px', fill: '#4a65dd' });
            if (gameState.entries[i] != '') {
                text.setFill('#000000');
            }

            gameState.squares.push(square);
            gameState.texts.push(text);
        }

        this.input.on('pointerdown', function() {
			var pointer = this.input.activePointer;
			if (pointer.worldX >= 75 && pointer.worldX <= 525 && pointer.worldY >= 175 && pointer.worldY <= 625) {
	            let newIndex = 9 * Math.floor((pointer.worldY - 175) / 50) + Math.floor((pointer.worldX - 75) / 50);

	            if (gameState.index != -1) {
	                gameState.squares[gameState.index].setFillStyle(0xffffff);
	            }
	            gameState.squares[newIndex].setFillStyle(0xdddddd);
	            gameState.index = newIndex;
			}
        }, this)

		const timeUpdate = () => {
			gameState.seconds += 1;
			let minutes = Math.floor(gameState.seconds / 60);
			let seconds = gameState.seconds % 60;
			if (seconds < 10) seconds = '0' + seconds.toString();
			timeText.setText(`Time ${minutes}:${seconds}`);
		}

		const timerLoop = this.time.addEvent({
			delay: 1000,
			callback: timeUpdate,
			callbackScope: this,
			loop: true,
		});

		gameState.seconds = 0;
		let timeText = this.add.text(475, 150, 'Time 0:00', { fill: '#000000', fontSize: '20px'}).setOrigin(0.5);

		let restart = this.add.rectangle(115, 150, 80, 30).setStrokeStyle(1, 0x444444).setOrigin(0.5).setInteractive()
			.on('pointerover', () => {restart.setFillStyle(0xdddddd)})
			.on('pointerout', () => {restart.setFillStyle(0xffffff)})
			.on('pointerdown', () => {gameState.seconds = -1; for (var i = 0; i < 81; i++) {
				gameState.entries[i] = gameState.start[i];
				gameState.texts[i].setText(gameState.entries[i]);
			}});
		let restartText = this.add.text(115, 150, 'Restart', {fill: '#000000',fontSize: '12px'}).setOrigin(0.5);
		let newGame = this.add.rectangle(205, 150, 80, 30).setStrokeStyle(1, 0x444444).setOrigin(0.5).setInteractive()
			.on('pointerover', () => {newGame.setFillStyle(0xdddddd)})
			.on('pointerout', () => {newGame.setFillStyle(0xffffff)})
			.on('pointerdown', () => {this.scene.stop('GameScene'); this.scene.start('StartScene');});
		let newGameText = this.add.text(205, 150, 'New Game', {fill: '#000000',fontSize: '12px'}).setOrigin(0.5);

        gameState.keys = this.input.keyboard.addKeys('ONE,TWO,THREE,FOUR,FIVE,SIX,SEVEN,EIGHT,NINE');
    }

    update() {
        let pressedNumber = '';
        if (gameState.keys.ONE.isDown) {
            pressedNumber = '1';
        } else if (gameState.keys.TWO.isDown) {
            pressedNumber = '2';
        } else if (gameState.keys.THREE.isDown) {
            pressedNumber = '3';
        } else if (gameState.keys.FOUR.isDown) {
            pressedNumber = '4';
        } else if (gameState.keys.FIVE.isDown) {
            pressedNumber = '5';
        } else if (gameState.keys.SIX.isDown) {
            pressedNumber = '6';
        } else if (gameState.keys.SEVEN.isDown) {
            pressedNumber = '7';
        } else if (gameState.keys.EIGHT.isDown) {
            pressedNumber = '8';
        } else if (gameState.keys.NINE.isDown) {
            pressedNumber = '9';
        }

        if (pressedNumber != '' && gameState.start[gameState.index] == '') {
            gameState.entries[gameState.index] = pressedNumber;
            gameState.texts[gameState.index].setText(pressedNumber);
            if (gameState.solution[gameState.index] == pressedNumber) {
                gameState.texts[gameState.index].setFill('#4a65dd');
            } else {
                gameState.texts[gameState.index].setFill('#aa2222');
            }
        }
    }
}
