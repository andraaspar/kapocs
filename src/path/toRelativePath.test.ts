import { expect, it } from 'vitest'
import { toRelativePath } from './toRelativePath'

it('[q0ytsc]', () => {
	expect(toRelativePath([], [])).toEqual([])
})

it('[q0ytt8]', () => {
	expect(toRelativePath([], ['b', 'c'])).toEqual(['b', 'c'])
})

it('[q0yttt]', () => {
	expect(toRelativePath(['a'], ['b'])).toEqual(['..', 'b'])
})

it('[q0yttt]', () => {
	expect(toRelativePath(['a', 'b', 'c'], ['a', 'd', 'e'])) //
		.toEqual(['..', '..', 'd', 'e'])
})
