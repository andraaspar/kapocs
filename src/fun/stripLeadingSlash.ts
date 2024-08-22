export function stripLeadingSlash(s: string) {
	return s[0] === '/' ? s.slice(1) : s
}
