import SimpleCameraPlugin from '../camera/SimpleCameraPlugin'
import Rectangle = Phaser.Geom.Rectangle
export default class BaseScene extends Phaser.Scene {
	/**
	 * 摄像机控制器
	 */
	public camera: SimpleCameraPlugin
	public constructor($config) {
		super($config)
	}

	/**
	 * 初始化布局，调整摄像机
	 * @param $windowWidth      游戏整体宽度
	 * @param $windowHeight     游戏整体高度
	 * @param $layoutAir        含有设计宽高的矩形
	 *
	 * @see     Phaser.Geom.Rectangle
	 */
	public initCamera($windowWidth: integer, $windowHeight: integer, $layoutAir: Rectangle): void {
		this.camera = new SimpleCameraPlugin(this.cameras.main, $windowWidth, $windowHeight, $layoutAir)
	}

	/**
	 * 获取表示全屏范围的矩形,如已经初始化Camera则为该CameraPluin的实际拍摄区域，如未设置则返回window宽高
	 *
	 * @return 表示全屏范围的矩形
	 */
	public getWindowRect(): Rectangle {
		let rect: Rectangle
		if (this.camera) {
			rect = this.camera.getCameraRect()
		} else {
			rect = new Rectangle(0, 0, window.innerWidth, window.innerHeight)
		}
		return rect
	}
}
