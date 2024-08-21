import { createHash } from 'crypto'

export function hashContent(content: string) {
	const md5 = createHash('md5')
	md5.update(content)
	return md5.digest('hex')
}
