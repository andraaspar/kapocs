import { pathIsRelative } from './pathIsRelative.js'

export function pathForceRelative(p: string[]) {
	return pathIsRelative(p) ? p : ['.', ...p]
}
