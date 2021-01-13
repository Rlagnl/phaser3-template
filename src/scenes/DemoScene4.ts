import GameScene from './GameScene'

export default class DemoScene4 extends GameScene {
	public constructor() {
		super({ key: 'DemoScene4' })
	}

	public init(): void { }

	public create($data): void {
		super.create($data)
		// 背景
		this.setBackgroundColor(0xC2A0E3)

		const eases = [
			'Linear',
			'Quad.easeIn',
			'Cubic.easeIn',
			'Quart.easeIn',
			'Quint.easeIn',
			'Sine.easeIn',
			'Expo.easeIn',
			'Circ.easeIn',
			'Back.easeIn',
			'Bounce.easeIn',
			'Quad.easeOut',
			'Cubic.easeOut',
			'Quart.easeOut',
			'Quint.easeOut',
			'Sine.easeOut',
			'Expo.easeOut',
			'Circ.easeOut',
			'Back.easeOut',
			'Bounce.easeOut',
			'Quad.easeInOut',
			'Cubic.easeInOut',
			'Quart.easeInOut',
			'Quint.easeInOut',
			'Sine.easeInOut',
			'Expo.easeInOut',
			'Circ.easeInOut',
			'Back.easeInOut',
			'Bounce.easeInOut'
		];

		const cr = this.camera.getCameraRect()
		const first = this.add.image(196 + cr.x, 32 + cr.y, 'redbar')
		this.tweens.add({
			targets: first,
			x: 500,
			ease: eases.shift(),
			duration: 2500,
			delay: 1000,
			repeat: -1,
			repeatDelay: 1000,
			hold: 1000
		});

		// @ts-ignore
		const images = this.add.group({ key: 'bluebar', repeat: 27, setXY: { x: 196 + cr.x, y: 51 + cr.y, stepY: 19 } });
		images.children.iterate((child) => {
			this.tweens.add({
				targets: child,
				x: 500,
				ease: eases.shift(),
				duration: 2500,
				delay: 1000,
				repeat: -1,
				repeatDelay: 1000,
				hold: 1000
			});
		});
	}
}
