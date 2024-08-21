import { range } from 'lodash-es'
import { findCommonRoot } from './findCommonRoot.js'
import { normalizePath } from './normalizePath.js'

export function toRelativePath(base: string[], target: string[]) {
	base = normalizePath(base)
	target = normalizePath(target)
	const common = findCommonRoot(base, target)
	return range(base.length - common.length)
		.map(() => '..')
		.concat(target.slice(common.length))
}
