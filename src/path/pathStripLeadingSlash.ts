export function pathStripLeadingSlash(p: string[]) {
	return p[0] === '' ? p.slice(1) : p
}
