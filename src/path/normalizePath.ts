import { range } from 'lodash-es'

export function normalizePath(p: string[]) {
	const result = p.slice()
	let upLevelsPending = 0
	for (let i = result.length - 1; i >= 0; i--) {
		if (result[i] === '..') {
			result.splice(i, 1)
			upLevelsPending++
		} else if (result[i] === '.') {
			result.splice(i, 1)
		} else {
			if (upLevelsPending) {
				result.splice(i, 1)
				upLevelsPending--
			}
		}
	}
	return range(upLevelsPending)
		.map(() => '..')
		.concat(result)
}
