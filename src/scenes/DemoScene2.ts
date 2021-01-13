import GameScene from './GameScene'

export default class DemoScene2 extends GameScene {
	public constructor() {
		super({ key: 'DemoScene2' })
	}

	public init(): void { }

	public create($data): void {
		super.create($data)
		// 背景
		this.setBackgroundColor(0xC6393C)
		// 文字
		this.add.text(150, 50, 'hello world')
		// 图片
		this.add.image(150, 120, 'logo').setOrigin(0, 0).setScale(0.5)
		// 图形
		const graphic = this.add.graphics();
		graphic.lineStyle(2, 0xffff00, 1);
		graphic.strokeRect(150, 250, 50, 50);

		graphic.fillStyle(0xffff00, 1);
		graphic.fillRect(150, 350, 50, 50);
	}
}
