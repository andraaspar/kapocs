export function toStringArray(
	o: string | string[] | null | undefined,
): string[] {
	return o == null ? [] : Array.isArray(o) ? o : [o]
}
