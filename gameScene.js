class GameScenePC extends Phaser.Scene {
	constructor() {
		super({ key: 'GameScenePC' })
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

	preload() {
		this.load.svg('hint', 'assets/hint.svg', {width: 0.4 * s, height: 0.4 * s});
		this.load.svg('restart', 'assets/restart.svg', {width: 0.4 * s, height: 0.4 * s});
		this.load.svg('home', 'assets/home.svg', {width: 0.4 * s, height: 0.4 * s});
	}

    create() {
        const fontSize = `${w / 15}px`;
        const fontSize2 = `${w / 45}px`;

        gameState.solution = this.solution();
        gameState.start = this.board(gameState.solution);
        gameState.entries = gameState.start.slice();

        // create game borders
        for (var x of [-3 * s, 0, 3 * s]) {
            for (var y of [-3 * s, 0, 3 * s]) {
                this.add.rectangle(midWidth + x, midHeight + y, 3 * s, 3 * s).setStrokeStyle(4, 0x444444).setOrigin(0.5).setDepth(2);
            }
        }

        // create sodoku squares
        gameState.squares = [];
        gameState.texts = [];
        gameState.dots = [];
        for (let j = -4; j <= 4; j++) {
            for (let i = -4; i <= 4; i++) {
                let index = 9 * (j + 4) + (i + 4);

                let square = this.add.rectangle(midWidth + i * s, midHeight + j * s, s, s).setStrokeStyle(1, 0x444444).setOrigin(0.5).setInteractive().setDepth(1);
                let dot = this.add.circle(midWidth + (i + 0.4) * s, midHeight + (j - 0.4) * s, 0.05 * s, 0xffffff);
                let text = this.add.text(midWidth + i * s, midHeight + j * s, gameState.entries[index], { fontSize: fontSize, fill: '#4a65dd' }).setOrigin(0.5).setDepth(1);
                if (gameState.entries[index] != '') {
                    text.setFill('#000000');
                }

                gameState.squares.push(square);
                gameState.dots.push(dot);
                gameState.texts.push(text);
            }
        }

        this.input.on('pointerdown', function() {
			var pointer = this.input.activePointer;
			if (pointer.worldX >= midWidth - 4.5 * s && pointer.worldX <= midWidth + 4.5 * s && pointer.worldY >= midHeight - 4.5 * s && pointer.worldY <= midHeight + 4.5 * s) {
	            let newIndex = 9 * Math.floor((pointer.worldY - midHeight + 4.5 * s) / s) + Math.floor((pointer.worldX - midWidth + 4.5 * s) / s);

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
		let timeText = this.add.text(midWidth + 4.5 * s, midHeight - 5 * s, 'Time 0:00', { fill: '#000000', fontSize: fontSize2}).setOrigin(1, 0.5);

		let hint = this.add.rectangle(midWidth - 4.5 * s, midHeight - 5 * s, s / 2, s / 2).setStrokeStyle(1, 0x444444).setOrigin(0, 0.5).setInteractive()
			.on('pointerover', () => {hint.setFillStyle(0xdddddd)})
			.on('pointerout', () => {hint.setFillStyle(0xffffff)})
			.on('pointerdown', () => {
                if (gameState.start[gameState.index] == '') {
                    gameState.entries[gameState.index] = gameState.solution[gameState.index];
                    gameState.texts[gameState.index].setText(gameState.solution[gameState.index]);
                }
            });
		let hintSVG = this.add.image(midWidth - 4.25 * s, midHeight - 5 * s, 'hint').setOrigin(0.5);

        let restart = this.add.rectangle(midWidth - 3.75 * s, midHeight - 5 * s, s / 2, s / 2).setStrokeStyle(1, 0x444444).setOrigin(0, 0.5).setInteractive()
			.on('pointerover', () => {restart.setFillStyle(0xdddddd)})
			.on('pointerout', () => {restart.setFillStyle(0xffffff)})
			.on('pointerdown', () => {gameState.seconds = -1; for (var i = 0; i < 81; i++) {
				gameState.entries[i] = gameState.start[i];
				gameState.texts[i].setText(gameState.entries[i]);
			}});
		let restartSVG = this.add.image(midWidth - 3.5 * s, midHeight - 5 * s, 'restart').setOrigin(0.5);

        let home = this.add.rectangle(midWidth - 3 * s, midHeight - 5 * s, s / 2, s / 2).setStrokeStyle(1, 0x444444).setOrigin(0, 0.5).setInteractive()
			.on('pointerover', () => {home.setFillStyle(0xdddddd)})
			.on('pointerout', () => {home.setFillStyle(0xffffff)})
			.on('pointerdown', () => {
                this.scene.stop('GameScenePC');
                this.scene.start('StartScenePC');
			});
		let homeSVG = this.add.image(midWidth - 2.75 * s, midHeight - 5 * s, 'home').setOrigin(0.5);

        // keyboard functionalities
        gameState.keys = this.input.keyboard.addKeys('ONE,TWO,THREE,FOUR,FIVE,SIX,SEVEN,EIGHT,NINE');
        
        this.input.keyboard.on('keydown-A', () => {
            if (gameState.index % 9 != 0) {
                gameState.squares[gameState.index].setFillStyle(0xffffff);
                gameState.index -= 1;
                gameState.squares[gameState.index].setFillStyle(0xdddddd);
            }
        }, this);

        this.input.keyboard.on('keydown-D', () => {
            if (gameState.index % 9 != 8) {
                gameState.squares[gameState.index].setFillStyle(0xffffff);
                gameState.index += 1;
                gameState.squares[gameState.index].setFillStyle(0xdddddd);
            }
        }, this);

        this.input.keyboard.on('keydown-W', () => {
            if (Math.floor(gameState.index / 9) != 0) {
                gameState.squares[gameState.index].setFillStyle(0xffffff);
                gameState.index -= 9;
                gameState.squares[gameState.index].setFillStyle(0xdddddd);
            }
        }, this);

        this.input.keyboard.on('keydown-S', () => {
            if (Math.floor(gameState.index / 9) != 8) {
                gameState.squares[gameState.index].setFillStyle(0xffffff);
                gameState.index += 9;
                gameState.squares[gameState.index].setFillStyle(0xdddddd);
            }
        }, this);
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
            gameState.texts[gameState.index].setFill('#4a65dd');
            gameState.dots[gameState.index].setFillStyle(0xa62222).setDepth(1);
        }
    }
}
