const relativeFirstParts = ['.', '..']
export function pathIsRelative(p: string[]) {
	return relativeFirstParts.includes(p[0])
}
