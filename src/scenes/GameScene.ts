import CONSTS from '../shared/consts'
import BaseScene from './BaseScene'
import Rectangle = Phaser.Geom.Rectangle
export default class GameScene extends BaseScene {
	public constructor() {
		super({ key: 'GameScene' })
	}

	public init(): void { }

	public create(): void {
		// 初始化适配
		const _r = new Rectangle(0, 0, CONSTS.DESIGN_WIDTH, CONSTS.DESIGN_HEIGHT)
		this.initCamera(window.innerWidth, window.innerHeight, _r)
		// 获取布局属性
		const lr = this.camera.getLayoutRect()
		// 边框
		const graphics = this.add.graphics()
		// graphics.lineStyle(1, 0x009fcc, 1)
		// graphics.strokeRect(5, 5, lr.width - 10, lr.height - 10)
		graphics.fillStyle(0x009fcc, 1)
		graphics.fillRect(0, 0, lr.width, lr.height)
		// 创建图片
		const aa = this.add.image(0, 0, 'logo').setOrigin(0, 0)
		console.log('a', aa)
	}
}
