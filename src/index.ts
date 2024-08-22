#!/usr/bin/env node

import { glob } from 'glob'
import { escapeRegExp } from 'lodash-es'
import { cp, mkdir, readFile, rm, writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'
import { getHashedSubPath } from './fun/getHashedSubPath.js'
import { hashContent } from './fun/hashContent.js'
import { hashFile } from './fun/hashFile.js'
import { resolvePathInTemplate } from './fun/resolvePathInTemplate.js'
import { IAsset } from './model/IAsset.js'
import { pathDirectory } from './path/pathDirectory.js'
import { pathFromString } from './path/pathFromString.js'
import { pathIsRelative } from './path/pathIsRelative.js'
import { pathToString } from './path/pathToString.js'
import { toRelativePath } from './path/toRelativePath.js'
const argv = await yargs(hideBin(process.argv))
	.option('source', {
		alias: 'src',
		type: 'string',
		description: 'Path to the source folder.',
		default: './src',
		nargs: 1,
	})
	.option('base', {
		type: 'string',
		description:
			'Base path for absolute paths. Setting this to "" will make all replaced paths relative.',
		default: '/',
		nargs: 1,
	})
	.option('target', {
		alias: 'out',
		type: 'string',
		description: 'Path to the target folder.',
		default: './build',
		nargs: 1,
	})
	.option('dropins', {
		alias: 'dropin',
		type: 'string',
		description:
			'Glob for dropins. These are assets to just copy, but not to version or modify.',
	})
	.option('assets', {
		alias: 'asset',
		type: 'string',
		description: 'Glob for assets. These are to be renamed.',
		default: '**/*.{css,gif,jpg,json,png,webp,woff2}',
	})
	.option('templates', {
		alias: 'template',
		type: 'string',
		description:
			'Glob for templates. These are to be modified to expand references in their contents.',
		default: '**/*.{css,html,json,php}',
	})
	.option('prefix', {
		type: 'string',
		description:
			'The prefix for references. Changing this will alter the reference format to search for in templates and asset templates.',
		default: '{{',
		nargs: 1,
	})
	.option('suffix', {
		type: 'string',
		description:
			'The prefix for references. Changing this will alter the reference format to search for in templates and asset templates.',
		default: '}}',
		nargs: 1,
	})
	.option('no-clean', {
		type: 'boolean',
		description: 'Disable cleaning the target folder.',
		nargs: 1,
	})
	.option('debug', {
		type: 'boolean',
		description: 'Show verbose log output.',
		nargs: 1,
	})
	.parse()

if (argv.debug) console.log(`[sibmx9] Args:`, argv)

const assetsBySubPathString = new Map<string, IAsset>()

const sourceFolder = resolve(argv.source)
const targetFolder = resolve(argv.target)

const re = new RegExp(
	escapeRegExp(argv.prefix) + '(.*?)' + escapeRegExp(argv.suffix),
	'g',
)
if (argv.debug) console.log(`[sibb3x] Regex:`, re)

if (argv.debug)
	console.log(
		`[sibn4o] sourceFolder:`,
		sourceFolder,
		`Dropins glob:`,
		argv.dropins,
		`Assets glob:`,
		argv.assets,
		`Templates glob:`,
		argv.templates,
	)
const dropinSubPathStrings = new Set<string>()
if (argv.dropins) {
	for (const dropinSubPathString of await glob(argv.dropins, {
		cwd: sourceFolder,
		nodir: true,
		// dot: true,
	})) {
		const subPath = pathFromString(dropinSubPathString)
		dropinSubPathStrings.add(pathToString(subPath))
	}
}
if (argv.debug)
	console.log(
		`[siknt9] dropinSubPathStrings:`,
		Array.from(dropinSubPathStrings),
	)
const assetSubPathStrings = new Set<string>()
for (const assetSubPathString of await glob(argv.assets, {
	cwd: sourceFolder,
	nodir: true,
	// dot: true,
})) {
	const subPath = pathFromString(assetSubPathString)
	const subPathString = pathToString(subPath)
	// Omit dropins.
	if (dropinSubPathStrings.has(subPathString)) continue
	assetSubPathStrings.add(subPathString)
}
if (argv.debug)
	console.log(`[sibn2v] assetSubPathStrings:`, Array.from(assetSubPathStrings))
const templateSubPathStrings = new Set<string>()
for (const templateSubPathString of await glob(argv.templates, {
	cwd: sourceFolder,
	nodir: true,
	// dot: true,
})) {
	const subPath = pathFromString(templateSubPathString)
	const subPathString = pathToString(subPath)
	// Omit dropins.
	if (dropinSubPathStrings.has(subPathString)) continue
	templateSubPathStrings.add(subPathString)
}
if (argv.debug)
	console.log(
		`[sibn3h] templateSubPathStrings:`,
		Array.from(templateSubPathStrings),
	)

// Clean target folder.
if (!argv.noClean) {
	try {
		await rm(targetFolder, { recursive: true })
	} catch (e) {}
}
await mkdir(targetFolder, { recursive: true })

// Collect assets.
for (const assetSubPath of assetSubPathStrings) {
	// Leave dropins as they are.
	if (assetsBySubPathString.has(assetSubPath)) continue
	const asset: IAsset = {
		subPath: assetSubPath,
		dependencies: new Set(),
	}
	assetsBySubPathString.set(assetSubPath, asset)
}

// Set up template dependency tree.
for (const templateSubPathString of templateSubPathStrings) {
	const templateAsset = assetsBySubPathString.get(templateSubPathString)
	if (templateAsset) {
		const templateSubPath = pathFromString(templateSubPathString)
		const content = await readFile(
			resolve(sourceFolder, templateSubPathString),
			{
				encoding: 'utf8',
			},
		)
		re.lastIndex = 0
		while (true) {
			const result = re.exec(content)
			if (result == null) break
			const assetSubPath = pathFromString(result[1])
			const resolvedPath = resolvePathInTemplate(templateSubPath, assetSubPath)
			const asset = assetsBySubPathString.get(pathToString(resolvedPath))
			if (asset) {
				templateAsset.dependencies.add(asset)
			}
		}
	}
}

async function processTemplate(templateSubPathString: string) {
	const isAsset = assetsBySubPathString.has(templateSubPathString)
	let content = await readFile(resolve(sourceFolder, templateSubPathString), {
		encoding: 'utf8',
	})
	const templateSubPath = pathFromString(templateSubPathString)
	content = content.replace(
		re,
		(all: string, assetSubPathString: string): string => {
			const assetSubPath = pathFromString(assetSubPathString)
			const resolvedPath = resolvePathInTemplate(templateSubPath, assetSubPath)
			const resolvedPathString = pathToString(resolvedPath)
			const asset = assetsBySubPathString.get(resolvedPathString)
			let resultPathString: string
			if (asset) {
				if (!asset.result) {
					throw new Error(
						`[sikr6y] Missing asset result: ${JSON.stringify(asset)}`,
					)
				}
				resultPathString = asset.result
			} else if (
				templateSubPathStrings.has(resolvedPathString) ||
				dropinSubPathStrings.has(resolvedPathString)
			) {
				resultPathString = resolvedPathString
			} else {
				console.warn(
					`[siks0o] Template`,
					JSON.stringify(templateSubPath),
					`references missing file:`,
					JSON.stringify(assetSubPath),
				)
				// Keep the original string – it's probably not a path. We warned about it above.
				return all
			}
			if (pathIsRelative(assetSubPath) || !argv.base) {
				// Relative path, or base is set to "".
				const resultPath = pathFromString(resultPathString)
				const relativeResultPath = toRelativePath(
					pathDirectory(templateSubPath),
					resultPath,
				)
				if (!pathIsRelative(relativeResultPath)) {
					relativeResultPath.unshift('.')
				}
				return pathToString(relativeResultPath)
			} else {
				// Absolute path.
				return argv.base + resultPathString
			}
		},
	)
	let targetPath: string
	if (isAsset) {
		const hash = hashContent(content)
		const hashedSubPath = getHashedSubPath(templateSubPathString, hash)
		targetPath = hashedSubPath
	} else {
		targetPath = templateSubPathString
	}
	await mkdir(resolve(targetFolder, dirname(targetPath)), { recursive: true })
	await writeFile(resolve(targetFolder, targetPath), content)
	return targetPath
}

for (const dropinSubPathString of dropinSubPathStrings) {
	await cp(
		resolve(sourceFolder, dropinSubPathString),
		resolve(targetFolder, dropinSubPathString),
	)
	if (argv.debug) console.log(`Dropin: ${JSON.stringify(dropinSubPathString)}`)
}

// Rename assets.
const templateSubPathsToResolve = new Set(templateSubPathStrings.values())
const assetsToResolve = new Set(assetsBySubPathString.values())
while (true) {
	let resolvedCount = 0
	assetLoop: for (const asset of assetsToResolve) {
		if (asset.dependencies.size === 0) {
			// A pure asset.
			asset.result = getHashedSubPath(
				asset.subPath,
				await hashFile(resolve(sourceFolder, asset.subPath)),
			)
			await cp(
				resolve(sourceFolder, asset.subPath),
				resolve(targetFolder, asset.result),
			)
			assetsToResolve.delete(asset)
			if (argv.debug)
				console.log(
					`Asset: ${JSON.stringify(asset.subPath)} → ${JSON.stringify(
						asset.result,
					)}`,
				)
			resolvedCount++
		} else {
			// A template asset. Only resolve if it has all dependencies resolved.
			for (const dependency of asset.dependencies) {
				if (!dependency.result) continue assetLoop
			}
			asset.result = await processTemplate(asset.subPath)
			assetsToResolve.delete(asset)
			templateSubPathsToResolve.delete(asset.subPath)
			if (argv.debug)
				console.log(
					`Asset template: ${JSON.stringify(asset.subPath)} → ${JSON.stringify(
						asset.result,
					)}`,
				)
			resolvedCount++
		}
	}
	if (resolvedCount === 0) break
}
// Check for circular references.
if (assetsToResolve.size > 0) {
	console.warn(`[siblc5] Could not resolve the following assets:`)
	for (const asset of assetsToResolve) {
		console.warn(`  ${JSON.stringify(asset.subPath)} unresolved dependencies:`)
		for (const dependency of asset.dependencies) {
			if (!dependency.result) {
				console.warn(`    ${JSON.stringify(dependency.subPath)}`)
			}
		}
	}
	process.exit(1)
}

// Process remaining (pure) templates.
for (const templateSubPath of templateSubPathsToResolve) {
	await processTemplate(templateSubPath)
	if (argv.debug) console.log(`Template: ${JSON.stringify(templateSubPath)}`)
}
