import VConsole from 'vconsole'
import Stats from './shared/stats'
import Game from './Game'
// 引入样式文件，用于清除浏览器默认样式
import './assets/css/cssreset-min.css'
// 实例化游戏
new Game()
// 用于监控性能
new Stats()
// 用于移动端调试
window.vConsole = new VConsole({
	// 可以在此设定要默认加载的面板
	defaultPlugins: ['system', 'network', 'element', 'storage'],
	maxLogNumber: 1000
})
