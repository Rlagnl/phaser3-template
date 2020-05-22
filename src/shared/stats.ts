import StatsJs from 'stats-js'
/**
 * @description   用于监控性能
 * @author        Downey Kim
 * @since         2020.05.15
 */

export default class Stats {
	public constructor() {
		const stats = new StatsJs()
		stats.showPanel(0) // 0: fps, 1: ms, 2: mb, 3+: custom
		const _self = stats.dom
		document.body.appendChild(_self)
		// 调整样式
		_self.style.setProperty('position', 'absolute')
		_self.style.setProperty('top', '0')
		_self.style.setProperty('left', 'auto')
		_self.style.setProperty('right', '0')
		_self.style.setProperty('z-index', '999')
		// 启动
		function animate(): void {
			stats.begin()
			// monitored code goes here
			stats.end()
			requestAnimationFrame(animate)
		}
		requestAnimationFrame(animate)
	}
}
