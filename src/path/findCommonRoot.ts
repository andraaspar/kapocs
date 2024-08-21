import { normalizePath } from './normalizePath.js'

export function findCommonRoot(a: string[], b: string[]) {
	a = normalizePath(a)
	b = normalizePath(b)
	const common: string[] = []
	const n = Math.max(a.length, b.length)
	for (let i = 0; i < n; i++) {
		if (a[i] === b[i]) {
			common.push(a[i])
		} else {
			break
		}
	}
	return common
}
