# fbi-project-fullpack
Progressive frontend project template.

> This is a fbi project template. If you haven't installed [fbi](https://github.com/AlloyTeam/fbi) yet, use the following command to install.
>
> `$ npm i -g fbi` or `yarn global add fbi`

[中文 README](./README_zh.md)

## Requirements
- `fbi v3.0+`
- `node v7.6+`

## Features
- Support pure `HTML` and [Handlebars](http://handlebarsjs.com/) template.
- Support pure `CSS` and [Sass-like](https://github.com/jonathantneal/precss) [PostCSS](http://postcss.org/)
- Support `ES5`, `ES2015`, `ES2016`, `ES2017`. Adds specific imports for polyfills automatically when they are used in each file. (polyfills will increase the file size, please use as appropriate.) [see more](https://github.com/babel/babel/tree/master/packages/babel-preset-env#usebuiltins-usage)
- Unlimited environment data.
- Http proxy.
- Paths mapping.
- Javascript linting and CSS linting.
- Minify.
- Highly configurable. 


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


## Advanced
**How to change the build configuration?**
1. Initialize the options file to the project directory. 
```bash
$ cd path/to/project
$ fbi init -o # or `--options`
```
2. The options file will be located at `fbi/options.js`, includes instructions. 

**How to change the build logic?**
1. Initialize options file and tasks to the project directory. 
```bash
$ cd path/to/project
$ fbi init -t # or `--tasks`
```
2. Files will be located at `fbi` folder. Do what you want to do.

**Where is the build dependencies?**

Build dependencies are by default in fbi's store. You can use the following command to download to the project.

```bash
$ fbi init -a  # or `--all`
```
> Note: If local tasks or options exist, the original files will be backed up in `fbi-bak` folder.

## More
- [Official templates](https://github.com/fbi-templates)
- [`fbi` documentation](https://neikvon.gitbooks.io/fbi/content/)

## License
[MIT](https://opensource.org/licenses/MIT)

## Changelog

- **v2.1.0**  (2017.12.10)
  - Refactor: building logic, project structure.

- **v2.0.3**  (2017.12.09)
  - Compatible `webpack.commons` with old version

- **v2.0.2**  (2017.12.09)
  - Update package info. Add `.editorconfig` previously.

- **v2.0.0**  (2017.12.09)
  - initialization


