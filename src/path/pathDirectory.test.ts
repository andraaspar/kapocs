import { expect, it } from 'vitest'
import { pathDirectory } from './pathDirectory'

it('[q0yw7p]', () => {
	expect(() => pathDirectory([])).toThrow(/q0yw66/)
})

it('[q0ywra]', () => {
	expect(pathDirectory(['a'])).toEqual([])
})

it('[q0ywrt]', () => {
	expect(pathDirectory(['a', 'b'])).toEqual(['a'])
})

it('[q0yws6]', () => {
	expect(pathDirectory(['a', 'b', 'c'])).toEqual(['a', 'b'])
})

it('[q0ywsh]', () => {
	expect(pathDirectory(['a', 'b', '..', 'c', 'd'])).toEqual(['a', 'c'])
})
