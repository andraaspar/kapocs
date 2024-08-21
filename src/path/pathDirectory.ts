import { normalizePath } from './normalizePath.js'

export function pathDirectory(p: string[]) {
	p = normalizePath(p)
	if (p.length) {
		return p.slice(0, -1)
	} else {
		throw new Error(`[q0yw66]`)
	}
}
