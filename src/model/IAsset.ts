export interface IAsset {
	subPath: string
	dependencies: Set<IAsset>
	result?: string
}
