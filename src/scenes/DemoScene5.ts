import GameScene from './GameScene'

export default class DemoScene5 extends GameScene {
	public constructor() {
		super({ key: 'DemoScene5' })
	}

	public init(): void {
		//  Our attack animation
		const animConfig = {
			key: 'attack',
			frames: this.anims.generateFrameNames('knight', { prefix: 'attack_A/frame', start: 0, end: 13, zeroPad: 4 }),
			frameRate: 12,
			repeat: -1
		};
		this.anims.create(animConfig);
	}

	public create($data): void {
		super.create($data)
		// 背景
		this.setBackgroundColor(0xD4BB7D)

		// 雪碧图
		const sprite = this.add.sprite(250, 100, 'knight', 'attack_A/frame0000').setScale(2.5)
		sprite.play('attack', true);

		// 骨骼动画
		const spine = this.add.spine(180, 500, 'raptor').setScale(0.2);
		spine.play('gun-holster', true, true);

		this.randomPlaySpineAnimation(spine)
	}

	private randomPlaySpineAnimation($obj: SpineGameObject) {
		const list = $obj.getAnimationList()
		// 点击
		$obj.setInteractive({ cursor: 'pointer' }).on('pointerdown', () => {
			const current = list.findIndex(e => e === $obj.getCurrentAnimation().name)
			const index = current + 1 === list.length ? 1 : current + 1
			$obj.play(list[index], true);
		}, this)
	}
}
