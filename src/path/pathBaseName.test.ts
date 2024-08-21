import { expect, it } from 'vitest'
import { pathBaseName } from './pathBaseName'

it('[q0yvgh]', () => {
	expect(() => pathBaseName([])).toThrow(/q0yv7h/)
})

it('[q0yvi5]', () => {
	expect(pathBaseName(['a'])).toEqual('a')
})

it('[q0yvi8]', () => {
	expect(pathBaseName(['a', 'b'])).toEqual('b')
})

it('[q0yviw]', () => {
	expect(pathBaseName(['a', 'b', '..'])).toEqual('a')
})
