export function pathFromString(s: string): string[] {
	return s.split(/[\\\/]+/g)
}
