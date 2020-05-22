// 设计稿宽高
const DESIGN_WIDTH = 1024
const DESIGN_HEIGHT = 768
// 缩放比例
const RATIO = setRatio()
// 展示区域宽高
const WINDOW_HEIGHT: number = setWindowHeight()
const WINDOW_WIDTH: number = setWindowWidth()
// 字体样式
const FONT_FAMILY = 'PingFangSC,Microsoft YaHei,Helvetica Neue,Helvetica,Arial,STHeiti,"sans-serif"'
// 游戏渲染类型
const GAME_READER_TYPE: number = setRenderType()

function setRatio(): number {
	return window.devicePixelRatio * 1.2
}

function setWindowWidth(): number {
	const _w = document.documentElement.clientWidth
	return _w * RATIO
}

function setWindowHeight(): number {
	const _h = document.documentElement.clientHeight
	return _h * RATIO
}

function setRenderType(): number {
	const _type = Phaser.AUTO
	return _type
}

export default {
	WINDOW_WIDTH,
	WINDOW_HEIGHT,
	DESIGN_WIDTH,
	DESIGN_HEIGHT,
	RATIO,
	FONT_FAMILY,
	GAME_READER_TYPE
}
