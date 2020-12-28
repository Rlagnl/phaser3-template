const image: string = require('@/assets/images/characters.png').default

export default class LoadScene extends Phaser.Scene {
	public constructor() {
		super({ key: 'LoadScene' })
	}

	public init(): void { }

	public preload(): void {
		this.load.image('logo', image)
	}

	public create(): void {
		this.scene.start('GameScene')
	}
}
