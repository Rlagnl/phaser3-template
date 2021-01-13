import Phaser from 'phaser'
import '@root/node_modules/phaser/plugins/spine/dist/SpinePlugin.min.js'
import CONSTS from './shared/consts'
import LoadScene from './scenes/LoadScene'
import MenuScene from './scenes/MenuScene'
import DemoScene1 from './scenes/DemoScene1'
import DemoScene2 from './scenes/DemoScene2'
import DemoScene3 from './scenes/DemoScene3'
import DemoScene4 from './scenes/DemoScene4'
import DemoScene5 from './scenes/DemoScene5'
import DemoScene6 from './scenes/DemoScene6'
import SampleScene from './scenes/SampleScene'
const SpinePlugin = window.SpinePlugin

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
		parent: 'app',
		canvasStyle: 'display: block;',
		dom: {
			createContainer: true,
			behindCanvas: true
		},
		scene: [LoadScene, DemoScene1, DemoScene2, DemoScene3, DemoScene4, DemoScene5, DemoScene6, SampleScene, MenuScene],
		transparent: true,
		autoFocus: true,
		scale: {
			mode: Phaser.Scale.FIT,
			autoCenter: Phaser.Scale.CENTER_BOTH
		},
		physics: {
			default: "arcade"
		},
		loader: {
			timeout: 5000
		},
		plugins: {
			scene: [
				{ key: 'SpinePlugin', plugin: SpinePlugin, systemKey: 'SpinePlugin', sceneKey: 'Spine' }
			]
		}
	}

	public constructor() {
		window.__game__ = new Phaser.Game(this.config)
	}
}
