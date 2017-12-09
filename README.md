# fbi-project-fullpack
Normal front-end project template

> This is a fbi project template. If you haven't installed [fbi](https://github.com/AlloyTeam/fbi) yet, use the following command to install.
>
> `$ npm i -g fbi` or `yarn global add fbi`

## Requirements
- `fbi v3.0+`
- `node v7.6+`

## Usage

**Create a project**
```bash
$ cd path/to/workspace
$ fbi init https://github.com/fbi-templates/fbi-project-fullpack.git my-project
```

or

```bash
$ fbi add https://github.com/fbi-templates/fbi-project-fullpack.git
$ cd path/to/empty-folder
$ fbi init fullpack
```

**Show available tasks**
```bash
$ fbi ls
```

**Run a task**
```bash
$ fbi <task> [params]
```

## Tasks

### `serve`
- Description: Start development server.
- Params:
  - `port` `{Number}` Server starting port. If occupied, switch automatically.
  - `p`, `prod` `{Boolean}` Serve production dist folder.
  - `t`, `test` `{Boolean}` Serve test dist folder.
- Alias: `s`
- Examples:
  - `fbi s -port=9999`
  - `fbi s -t`
  - `fbi s -p`

### `build`
- Description: Build the project for the specified environment.
- Params:
  - `p`, `prod` `{Boolean}` (default) Production environment.
  - `t`, `test` `{Boolean}` Test environment.
  - `d`, `dev` `{Boolean}` Development environment.
- Alias: `b`
- Examples:
  - `fbi b -t`
  - `fbi b -t=true`
  - `fbi b -test=true`
  - `fbi b --p`
  - `fbi b -d`
### `clean`
- Description: Clean up destinations.
- Params: none
- Alias: `c`
- Examples:
  - `fbi c`
  - `fbi clean`

## More
- [Official templates](https://github.com/fbi-templates)
- [`fbi` documentation](https://neikvon.gitbooks.io/fbi/content/)

## License
[MIT](https://opensource.org/licenses/MIT)

## Changelog

- **v2.0.0**  (2017.12.09)
  - initialization


