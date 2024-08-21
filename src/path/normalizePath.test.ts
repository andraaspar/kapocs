import { expect, it } from 'vitest'
import { normalizePath } from './normalizePath'

it('[q0yu6o]', () => {
	expect(normalizePath(['a', 'b', 'c'])).toEqual(['a', 'b', 'c'])
})

it('[q0yu7v]', () => {
	expect(normalizePath(['a', '..', 'b'])).toEqual(['b'])
})

it('[q0yu8b]', () => {
	expect(normalizePath(['a', 'b', 'c', '..', '..', 'd'])).toEqual(['a', 'd'])
})

it('[q0yu9l]', () => {
	expect(normalizePath(['..', 'a', 'b'])).toEqual(['..', 'a', 'b'])
})

it('[q0yuaa]', () => {
	expect(normalizePath(['..', '..', 'a', 'b'])) //
		.toEqual(['..', '..', 'a', 'b'])
})

it('[q0yuvt]', () => {
	expect(normalizePath(['..', '..', 'a', '..', 'b'])) //
		.toEqual(['..', '..', 'b'])
})

it('[q0yuvy]', () => {
	expect(normalizePath(['a', 'b', '..', 'c', '..', '..', 'd'])) //
		.toEqual(['d'])
})

it('[q0yyow]', () => {
	expect(normalizePath(['a', '.', 'b'])) //
		.toEqual(['a', 'b'])
})
