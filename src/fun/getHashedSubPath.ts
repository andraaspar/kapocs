import { extname } from 'path/posix'
import { pathBaseName } from '../path/pathBaseName.js'
import { pathDirectory } from '../path/pathDirectory.js'
import { pathFromString } from '../path/pathFromString.js'
import { pathToString } from '../path/pathToString.js'

export function getHashedSubPath(subPathString: string, hash: string) {
	const subPath = pathFromString(subPathString)
	const dir = pathDirectory(subPath)
	const ext = extname(pathBaseName(subPath))
	const base = pathBaseName(subPath).slice(0, -ext.length)
	const newName = base + '.' + hash + ext
	const newSubPath = [...dir, newName]
	return pathToString(newSubPath)
}
