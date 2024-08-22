# kapocs

**Cache busting CLI tool. Works with any file type.**

Appends an MD5 hash to asset file names, and injects file names into templates. A good replacement for [gulp-rev](https://github.com/sindresorhus/gulp-rev) and [gulp-rev-all](https://github.com/smysnk/gulp-rev-all) if you want no Gulp.

Appending a hash to file names based on their contents ensures that each time a file's content changes, browsers will download the updated file from the server, rather than using the old, cached version. This is called cache busting.

A more detailed [explanation of HTTP caching & cache busting](https://developers.google.com/web/fundamentals/performance/optimizing-content-efficiency/http-caching).

## Install

```bash
npm i kapocs
```

or

```bash
yarn add kapocs
```

## Concepts

### Assets

Assets are usually binary files, like image or video files. You will want to append an MD5 hash to their file names to ensure they get cached only until they change.

Assets will be copied from the sources specified in `--source` to the destination folder specified in `--target`.

They will also be renamed to include an MD5 hash in the file name, based on their contents.
A file called `video.mp4` will be renamed to `video.<md5-hash>.mp4`.

Make sure the `--assets` option matches your assets.

### Templates

Templates are text files that contain references to assets or asset templates. They can be HTML, PHP, or in fact any other text file format.

Templates contain references to assets in the format `{{../to/image.jpg}}` (relative path) or `{{/path/to/image.jpg}}` (absolute path).

These references will be replaced like so:

| Source                     | Output                           |
| -------------------------- | -------------------------------- |
| `{{image.jpg}}` \*         | `./image.<md5-hash>.jpg`         |
| `{{./image.jpg}}`          | `./image.<md5-hash>.jpg`         |
| `{{/image.jpg}}`           | `/image.<md5-hash>.jpg`          |
| `{{../to/image.jpg}}`      | `../to/image.<md5-hash>.jpg`     |
| `{{path/to/image.jpg}}` \* | `./path/to/image.<md5-hash>.jpg` |
| `{{/path/to/image.jpg}}`   | `/path/to/image.<md5-hash>.jpg`  |

The paths marked with \* are treated as relative paths, following the HTML tradition. However, they are converted to explicit relative paths to avoid ambiguity and make sure they behave the same way in every file type.

Each template file will also be copied to the target folder specified in the `--target` option.

Make sure the `--templates` option matches your templates.

### Asset templates

Asset templates are text files that contain references to assets or asset templates, just like templates. But asset templates may be cached by the browser, and we want to ensure that when they change, the browser always loads the latest version.

A good example of asset templates is CSS or JS files, which refer to assets (images, fonts, etc.), but are in turn referenced by HTML or PHP files.

Make sure both the `--assets` and the `--templates` options match the file to make it an asset template.

Please note that `kapocs` builds a dependency tree of asset templates and takes only their final shape into account. This means that if an image referenced by a CSS file is updated, the hash of the CSS file is also updated.

This also means that circular references will result in an error.

### Dropins

Dropins are files that you just want to copy to the target without processing them in any way.

Make sure the `--dropins` option matches your dropins.

## Options

| Option                      | Description                                                                                                                              |
| --------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| `--help`                    | Show help.                                                                                                                               |
| `--version`                 | Show version number.                                                                                                                     |
| `--source`, `--src`         | Path to the source folder. Default: `"./src"`                                                                                            |
| `--base`                    | Base path for absolute paths. Setting this to `""` will make all replaced paths relative. Default: `"/"`                                 |
| `--target`, `--out`         | Path to the target folder. Default: `"./build"`                                                                                          |
| `--dropins`, `--dropin`     | Glob for dropins. These are assets to just copy, but not to version or modify.                                                           |
| `--assets`, `--asset`       | Glob for assets. These are to be renamed. Default: `"**/*.{css,gif,jpg,json,png,webp,woff2}"`                                            |
| `--templates`, `--template` | Glob for templates. These are to be modified to expand references in their contents. Default: `"**/*.{css,html,json,php}"`               |
| `--prefix`                  | The prefix for references. Changing this will alter the reference format to search for in templates and asset templates. Default: `"{{"` |
| `--suffix`                  | The suffix for references. Changing this will alter the reference format to search for in templates and asset templates. Default: `"}}"` |
| `--no-clean`                | Disable cleaning the target folder.                                                                                                      |
| `--debug`                   | Show verbose log output.                                                                                                                 |

## License

MIT

## Version history

| Version | Breaking changes                                                    |
| ------- | ------------------------------------------------------------------- |
| 2.0.0   | Treat paths like `{{file.txt}}` and `{{sub/file.txt}}` as relative. |
