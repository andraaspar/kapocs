import { pathDirectory } from '../path/pathDirectory.js'
import { pathIsRelative } from '../path/pathIsRelative.js'
import { resolvePath } from '../path/resolvePath.js'

export function resolvePathInTemplate(
	templateSubPath: string[],
	assetSubPath: string[],
) {
	return pathIsRelative(assetSubPath)
		? resolvePath(pathDirectory(templateSubPath), assetSubPath)
		: assetSubPath
}
