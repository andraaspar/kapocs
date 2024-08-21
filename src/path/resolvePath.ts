import { normalizePath } from './normalizePath.js'

export function resolvePath(base: string[], target: string[]) {
	return normalizePath(base.concat(target))
}
