import GameScene from './GameScene'

export default class DemoScene6 extends GameScene {
	public constructor() {
		super({ key: 'DemoScene6' })
	}

	public init(): void { }

	public create($data): void {
		super.create($data)
		// 背景
		this.setBackgroundColor(0x6DD5B5)

		// 音频
		const audio = this.sound.add('overture', { loop: true });
		// 播放
		const btn = this.add.text(200, 200, '音频播放')
		btn.setInteractive({ cursor: 'pointer' }).on('pointerdown', () => {
			if (audio.isPlaying) {
				audio.stop()
				btn.setText('音频播放')
			} else {
				audio.play()
				btn.setText('音频暂停')
			}
		}, this)

		// 视频
		const lr = this.camera.getLayoutRect()
		const video = this.add.video(lr.width / 2, 400, 'wormhole').setScale(0.4)
		video.setInteractive({ cursor: 'pointer' }).on('pointerdown', () => {
			video.isPlaying() ? video.stop() : video.play()
		}, this)

		// h5 dom
		var dom = this.add.dom(250, 100, 'div', null, 'h5 dom Hello World');
		this.tweens.add({
			targets: dom,
			angle: 5,
			duration: 100,
			yoyo: true,
			repeat: 5,
			onStart: () => {
				dom.setAngle(-5)
			},
			onComplete: () => {
				dom.setAngle(0)
			}
		})

		// 场景进入暂停时触发
		this.events.once('pause', () => {
			dom.destroy()
		}, this)
		// 退出场景时销毁资源
		this.events.once('shutdown', () => {
			audio.stop()
			audio.destroy()
			video.stop()
			video.destroy()
		}, this)
	}
}
