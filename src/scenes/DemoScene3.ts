import Container = Phaser.GameObjects.Container
import Rectangle = Phaser.Geom.Rectangle
import GameScene from './GameScene'

export default class DemoScene3 extends GameScene {
	public constructor() {
		super({ key: 'DemoScene3' })
	}

	public init(): void { }

	public create($data): void {
		super.create($data)
		// 背景
		this.setBackgroundColor(0x4FA437)

		// 容器
		const container = this.add.container(150, 100, []).setSize(100, 100)
		this.drawBackground(container)

		// 容器设置点击事件
		container.setInteractive(this.getTouchArea(container))
		container.on('pointerdown', () => {
			this.tweens.add({
				targets: container,
				y: container.y === 100 ? 400 : 100,
				duration: 700,
				ease: 'Back.easeOut'
			})
		}, this)
	}

	// 绘制边框
	private drawBackground($object: Container): void {
		//
		const graphics = this.add.graphics()
		graphics.fillStyle(0xffffff, 1)
		graphics.fillRect(0, 0, $object.width, $object.height)
		// 将图形放入容器
		$object.add(graphics)
	}

	private getTouchArea($object: Container): any {
		const _r = new Rectangle(0, 0, $object.width, $object.height)
		_r.setPosition(_r.centerX, _r.centerY)
		return {
			cursor: 'pointer',
			hitArea: _r,
			hitAreaCallback: Rectangle.Contains
		}
	}

	protected transitionAnimate(duration: number): void {
		const cr = this.camera.getCameraRect()
		const size = Math.ceil((cr.width * cr.height) / 2500)
		const width = Math.ceil(cr.width / 50)

		// @ts-ignore
		const blocks = this.add.group({ key: 'effectBlock', repeat: size, setScale: { x: 1, y: 1 } });

		Phaser.Actions.GridAlign(blocks.getChildren(), {
			width,
			cellWidth: 50,
			cellHeight: 50,
			x: 25 + cr.x,
			y: 25 + cr.y
		});

		const _this = this;
		let i = 0;

		blocks.children.iterate(function (child) {
			_this.tweens.add({
				targets: child,
				scaleX: 0,
				scaleY: 0,
				angle: 180,
				_ease: 'Sine.easeInOut',
				ease: 'Power2',
				duration: 1000,
				delay: i * 50,
			});

			i++;
			if (i % width === 0) {
				i = 0;
			}
		});
	}
}
