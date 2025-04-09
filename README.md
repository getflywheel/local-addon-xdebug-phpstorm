# ⚠️ ARCHIVED ⚠️

Local now supports PhpStorm's [zero-config debugging](https://www.jetbrains.com/help/phpstorm/zero-configuration-debugging.html). 🎉

See the [official docs on using Xdebug in Local with PhpStorm](https://localwp.com/help-docs/local-features/use-xdebug-in-local-with-phpstorm/).

# Local Add-on: Xdebug + PhpStorm [![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/getflywheel/local-addon-volumes/pulls/)

## Manual Installation

### Clone

Clone the repository into the following directory depending on your platform:

- macOS: `~/Library/Application Support/Local/addons`
- Windows: `%AppData%\Local\addons`
- Linux: `~/.config/Local/addons`

### Install Dependencies
- `yarn install`

### Build
- `yarn build`

## Development

### Folder Structure
All files in `/src` will be transpiled to `/lib` using [TypeScript](http://www.typescriptlang.org/). Anything in `/lib` will be overwritten.

## License

MIT
