import { normalizePath } from './normalizePath.js'

export function pathBaseName(p: string[]) {
	p = normalizePath(p)
	if (p.length) {
		return p[p.length - 1]
	} else {
		throw new Error(`[q0yv7h] Empty path has no base name.`)
	}
}
