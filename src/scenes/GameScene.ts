export default class GameScene extends Phaser.Scene {
	public constructor() {
		super({ key: 'GameScene' })
	}

	public init(): void {}

	public create(): void {
		// 边框
		const graphics = this.add.graphics()
		graphics.lineStyle(4, 0x009fcc, 1)
		graphics.strokeRect(20, 20, this.game.canvas.width - 40, this.game.canvas.height - 40)
		// 创建图片
		this.add.image(300, 300, 'logo')
	}
}
