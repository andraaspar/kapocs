import { createHash } from 'crypto'
import { createReadStream } from 'fs'
import { pipeline } from 'stream/promises'

export async function hashFile(path: string) {
	const md5 = createHash('md5')
	await pipeline(createReadStream(path), md5)
	return md5.digest('hex')
}
