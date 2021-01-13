import CONSTS from '../shared/consts'
import BaseScene from './BaseScene'
import Rectangle = Phaser.Geom.Rectangle
export default class MenuScene extends BaseScene {
	public constructor() {
		super({ key: 'MenuScene' })
	}

	public init(): void { }

	public create(): void {
		// 初始化适配
		const _r = new Rectangle(0, 0, CONSTS.DESIGN_WIDTH, CONSTS.DESIGN_HEIGHT)
		this.initCamera(CONSTS.WINDOW_WIDTH, CONSTS.WINDOW_HEIGHT, _r)
		// 获取摄像机属性
		const cr = this.camera.getCameraRect()

		this.createOption(cr.x + 20, cr.y + 20, 'Demo1', () => {
			this.changeScene('DemoScene1')
		})

		this.createOption(cr.x + 20, cr.y + 60, 'Demo2', () => {
			this.changeScene('DemoScene2')
		})

		this.createOption(cr.x + 20, cr.y + 100, 'Demo3', () => {
			this.changeScene('DemoScene3')
		})

		this.createOption(cr.x + 20, cr.y + 140, 'Demo4', () => {
			this.changeScene('DemoScene4')
		})

		this.createOption(cr.x + 20, cr.y + 180, 'Demo5', () => {
			this.changeScene('DemoScene5')
		})

		this.createOption(cr.x + 20, cr.y + 220, 'Demo6', () => {
			this.changeScene('DemoScene6')
		})

		this.createOption(cr.x + 20, cr.y + 260, 'Game', () => {
			this.changeScene('SampleScene')
		})
	}

	private changeScene($scene: string): void {
		const scenes = this.scene.manager.getScenes(true).filter(e => e !== this)
		const current = scenes[0].scene.key
		if (current === $scene) return
		const duration = 500
		this.scene.moveAbove(current, $scene)
		this.scene.bringToTop(this.scene.key)
		this.scene.pause(current)
		this.scene.run($scene, { duration })
		setTimeout(() => {
			this.scene.stop(current)
		}, duration + 100)
	}

	private createOption($x: number, $y: number, $text: string, $fn: Function): Phaser.GameObjects.Text {
		const _item = this.add.text($x, $y, $text).setResolution(3)
		_item.setInteractive({ cursor: 'pointer' }).on('pointerdown', $fn)
		return _item
	}
}
