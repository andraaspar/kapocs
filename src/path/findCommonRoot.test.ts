import { expect, it } from 'vitest'
import { findCommonRoot } from './findCommonRoot'

it('[q0ytp0]', () => {
	expect(findCommonRoot([], ['a', 'b', 'c'])) //
		.toEqual([])
})

it('[q0ytmm]', () => {
	expect(findCommonRoot(['a', 'b', 'c'], ['a', 'b', 'd', 'e'])) //
		.toEqual(['a', 'b'])
})

it('[q0ytpr]', () => {
	expect(findCommonRoot(['a', 'b', 'c'], ['d', 'e', 'f'])) //
		.toEqual([])
})

it('[q0yvcc]', () => {
	expect(findCommonRoot(['a', 'b', '..', 'c'], ['a', 'c', 'd'])) //
		.toEqual(['a', 'c'])
})
