import { pathIsRelative } from '../path/pathIsRelative.js'
import { RELATIVE_PATH_START } from './RELATIVE_PATH_START.js'

export function makeRelativePathExplicit(p: string[]): string[] {
	return pathIsRelative(p) && !RELATIVE_PATH_START.includes(p[0])
		? ['.', ...p]
		: p
}
