/**
 * 基础支持
 */

// 深拷贝
function deepCopy(obj: any): any {
	const result: any = Array.isArray(obj) ? [] : {}
	for (var key in obj) {
		if (obj.hasOwnProperty(key)) {
			if (typeof obj[key] === 'object') {
				result[key] = deepCopy(obj[key]) //递归复制
			} else {
				result[key] = obj[key]
			}
		}
	}
	return result
}

// 获取随机区间数
function random(n: number, m: number): number {
	return Math.floor(Math.random() * (m - n + 1) + n)
}

// 切割字符串
function string2array($str: string, $separator: string = ''): Array<string> {
	if (!$str) return []
	const _arr = $str.split($separator)
	const _newArr = []
	for (let i = 0; i < _arr.length; i++) {
		_newArr.push(_arr[i])
	}
	return _newArr
}
/**
 * 查询字符串中当前字符的所有索引位置
 *
 * @param {string} $tar  目标字符串
 * @param {string} $src  查询字符
 * @returns {Array<number>}
 */
function allIndexOf($tar: string, $src: string): Array<number> {
	const regex = new RegExp($src, 'gi')
	let result
	const indices = []
	while ((result = regex.exec($tar))) {
		indices.push(result.index)
	}
	return indices
}
/**
 * 动态引入css样式文件
 *
 * @param {string} $url  样式文件地址
 */
function loadStyles($url: string): void {
	var link = document.createElement('link')
	link.rel = 'stylesheet'
	link.type = 'text/css'
	link.href = $url
	var head = document.getElementsByTagName('head')[0]
	head.appendChild(link)
}

export default {
	deepCopy,
	string2array,
	random,
	allIndexOf,
	loadStyles
}
