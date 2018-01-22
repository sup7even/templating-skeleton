# Templating Skeleton

### Infos

* using yarn as package manager instead of npm
* using bootstrap 4 beta 2
* using jquery latest
* using gulp tasks for 
	* scss compile
	* scss minify
	* js concat
	* inline svg
	* nunjucks template engine (https://mozilla.github.io/nunjucks/)
	* json data
	* export nunjucks to fluid templates for better typo3 integration
	
### Features
* added breakpoints in javascript
* fixed the plugin for new bootstrap version
* export nunjucks template to fluid ready to use templates

## IMPORTANT
**ALLWAYS WORK IN SRC FOLDER! FILES GETTING COMPILED TO DIST FOLDER**
<br>
**EVERY CHANGE WILL BE REMOVED IN DIST FOLDER BEFORE RECOMPILING**

### Install

1. yarn install
2. run gulp default or watch task
3. all files are merged/copied/minified in dist folder
4. use gulp task "serve" for browsersync 

_KTHXBYE!_