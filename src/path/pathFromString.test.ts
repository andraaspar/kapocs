import { expect, it } from 'vitest'
import { pathFromString } from './pathFromString'

it('[q0ytxt]', () => {
	expect(pathFromString('a/b/c')).toEqual(['a', 'b', 'c'])
})

it('[q0ytyx]', () => {
	expect(pathFromString('a\\b\\c')).toEqual(['a', 'b', 'c'])
})

it('[q0ytza]', () => {
	expect(pathFromString('a//b')).toEqual(['a', 'b'])
})

it('[q0ytzq]', () => {
	expect(pathFromString('a/../b')).toEqual(['a', '..', 'b'])
})
