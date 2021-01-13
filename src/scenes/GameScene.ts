import CONSTS from '../shared/consts'
import SimpleCameraPlugin from '../camera/SimpleCameraPlugin'
import BaseScene from './BaseScene'
import Rectangle = Phaser.Geom.Rectangle
export default class GameScene extends BaseScene {
	/**
	 * 摄像机控制器
	 */
	public camera: SimpleCameraPlugin
	public constructor($config) {
		super($config)
	}

	public create($data) {
		// 初始化适配
		const _r = new Rectangle(0, 0, CONSTS.DESIGN_WIDTH, CONSTS.DESIGN_HEIGHT)
		this.initCamera(CONSTS.WINDOW_WIDTH, CONSTS.WINDOW_HEIGHT, _r)
		// 过场动画
		this.scene.scene.events.once('create', this.transitionAnimate.bind(this, $data.duration))
	}

	protected setBackgroundColor($color: number): void {
		// 获取摄像机属性
		const cr = this.camera.getCameraRect()
		// 背景
		const graphics = this.add.graphics()
		graphics.fillStyle($color, 1)
		graphics.fillRect(cr.x, cr.y, cr.width, cr.height)
	}

	protected transitionAnimate(duration: number): void {
		this.cameras.main.x = CONSTS.WINDOW_WIDTH
		// 动效
		this.tweens.add({
			targets: this.cameras.main,
			x: 0,
			duration: duration,
			ease: 'Quart.easeOut'
		})
	}
}
