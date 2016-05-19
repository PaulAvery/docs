# Overriding parts of the theme
You may override any method or file a theme provides for your project. Simply create a `theme` folder next to your `src` folder.
Any method exported from a `theme.js` file will override the one from the used theme.

Any other file inside the folder will override the same file in the themes folder.

So if you want to add an external link to the main menu of the default theme, you may create the file `docs/theme/template/partials/menu.hbs` with the following content:

```html
<nav class="main-menu">
	<ul>
		<li><a href="http://external.link">External!</a></li>
		<li><a href="./{{up}}" {{#eq page.link ''}}class="active"{{/eq}}>Introduction</a></li>
		{{#top}}
			{{#each children}}
				<li><a href="{{up}}{{link}}" {{#eq link ../../page.link }}class="active"{{/eq}}>{{name}}</a></li>
			{{/each}}
		{{/top}}
	</ul>
</nav>
```
