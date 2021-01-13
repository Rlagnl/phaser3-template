import GameScene from './GameScene'

export default class DemoScene1 extends GameScene {
	public constructor() {
		super({ key: 'DemoScene1' })
	}

	public init($data): void { }

	public create($data): void {
		super.create($data)
		// 背景
		this.setBackgroundColor(0x009fcc)
		// 获取布局属性
		const lr = this.camera.getLayoutRect()
		// 边框
		const graphics = this.add.graphics()
		graphics.lineStyle(1, 0xA85438, 1)
		graphics.strokeRect(0, 0, lr.width, lr.height)
	}
}
