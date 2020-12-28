import 'phaser'
import CONSTS from './shared/consts'
import LoadScene from './scenes/LoadScene'
import GameScene from './scenes/GameScene'
/**
 * @description   游戏初始化
 * @author        Downey Kim
 * @since         2020.05.15
 */
export default class Game {
	// 初始化配置
	protected config: Phaser.Types.Core.GameConfig = {
		type: CONSTS.GAME_READER_TYPE,
		width: CONSTS.WINDOW_WIDTH,
		height: CONSTS.WINDOW_HEIGHT,
		// width: 600,
		// height: 600,
		parent: 'app',
		canvasStyle: 'position: absolute; display: block;',
		scene: [LoadScene, GameScene],
		transparent: true,
		autoFocus: true,
		scale: {
			mode: Phaser.Scale.FIT,
			autoCenter: Phaser.Scale.CENTER_BOTH
		},
		loader: {
			timeout: 5000
		}
	}

	public constructor() {
		new Phaser.Game(this.config)
	}
}
