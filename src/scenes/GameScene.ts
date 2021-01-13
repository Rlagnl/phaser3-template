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
		this.initCamera(CONSTS.WINDOW_WIDTH, CONSTS.WINDOW_HEIGHT, _r)
		// 获取摄像机属性
		const cr = this.camera.getCameraRect()
		// 背景
		const graphics = this.add.graphics()
		graphics.fillStyle(0x009fcc, 1)
		graphics.fillRect(cr.x, cr.y, cr.width, cr.height)
		// 获取布局属性
		const lr = this.camera.getLayoutRect()
		// 边框
		graphics.lineStyle(1, 0xA85438, 1)
		graphics.strokeRect(0, 0, lr.width, lr.height)
		// 创建图片
		this.add.image(50, 50, 'logo').setOrigin(0, 0)
	}
}
