grunt-handlebars-universal
===

GHU is a plugin for the Grunt task runner for pre-compiling Handlebars templates.

Why make *another* Grunt Handlebars plugin? Because none of the other ones I found did what I actually wanted, which is create templates that could be used in any environment.  `grunt-contrib-handlebars`, for example, will let you compile with wrappers for either CommonJS loading, AMD loading, *or* a global namespace. I wanted to be able to compile to all three in the same file.

GHU does not do any special processing for partials.  It is up to you to register your templates as partials within your own environment.

GHU does not support multiple templates per file. If you need multiple template files, it is recommended that you use [`grunt-contrib-concat`](https://github.com/gruntjs/grunt-contrib-concat) or [`grunt-requirejs`](https://github.com/gruntjs/grunt-contrib-requirejs) to combine this plugin's output.

## Getting Started
This plugin requires Grunt `~0.4.0`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-handlebars-universal --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-handlebars-universal');
```

## Handlebars task
_Run this task with the `grunt handlebars` command._

Task targets, files and options may be specified according to the grunt [Configuring tasks](http://gruntjs.com/configuring-tasks) guide.
### Options

#### namespace
Type: `String` or `false` or `function`  
Default: `'HandlebarsTemplates'`

The namespace in which the precompiled template will be assigned.  *Use dot notation (e.g. App.Templates) for nested namespaces or false for no namespace wrapping.*

Example:
```js
options: {
  namespace: 'MyApp.Templates'
}
```

You can generate nested namespaces based on the file system paths of your templates by providing a function. The function will be called with one argument (the template filepath).  *The function must return a dot notation based on the filepath*.

Example:
```js
options: {
  namespace: function(filename) {
    var names = filename.replace(/modules\/(.*)(\/\w+\.hbs)/, '$1');
    return names.split('/').join('.');
  },
  files: {
    'ns_nested_tmpls.js' : [ 'modules/**/*.hbs']
  }
}
```

#### global
Type: `Boolean`  
Default: `'this'`

Defines the variable name for the global context that the namespace will be applied to within the template.

#### amd
Type: `Boolean`  
Default: `true`

Wraps the compiled template with an AMD define function.  The template wrapper will require Handlebars itself in order to prepare a ready-to-use template function.


#### node
Type: `Boolean`  
Default: `true`

Wraps the compiled template with a CommonJS module export.  The template wrapper will require Handlebars directly in order to prepare a ready-to-use template function.

#### nodePassIn
Type: `Boolean`  
Default: `false`

By default the compiled templates will load Handlebars internally and return a template function.  Depending upon node_modules structure, this may result in a node.js process passing in a different Handlebars instance than the module your code registers partials and helpers on.  Setting this option to true will cause the wrapper to instead generate a closure that you will need to call to get the ready to use template, passing in a specific Handlebars instance.

Example:

```js
var handlebars = require('handlebars');
var template = require('path/to/compiled/template.js')(handlebars);
// template now contains a ready-to-use function
```


### Usage Examples

```js
handlebars: {
  compile: {
    options: {
      namespace: "app.templates"
    },
    files: [{
      expand: true,
      cwd: 'views/',
      src: [
        '**/*.hbs.html',
      ],
      dest: 'views/',
      ext: '.hbs.js'
    }]
  }
}
```

##License and Accreditation

grunt-handlebars-universal is released under a standard MIT license, as defined in the included LICENSE file.

grunt-handlebars-universal is copyrighted 2014 by Jarvis Badgley.