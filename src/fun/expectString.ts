export function expectString(o: unknown): string {
	if (typeof o !== 'string') {
		throw new Error(`[sibi22] Not a string: ${typeof o}`)
	}
	return o
}
