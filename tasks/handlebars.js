var handlebars = require('handlebars');
var declare = require('nsdeclare');

module.exports = function(grunt) {

	grunt.registerMultiTask('handlebars', 'Compile handlebars templates.', function() {
		var options = this.options({
			namespace: 'HandlebarsTemplates',
			node: true,
			nodePassIn: false,
			amd: true,
			global: 'this'
		});

		this.files.forEach(function(file) {
			var destFile = file.dest;
			var inputFiles = file.src.filter(function(filepath) {
				// Warn on and remove invalid source files (if nonull was set).
				if (!grunt.file.exists(filepath)) {
					grunt.log.warn('Source file "' + filepath + '" not found.');
					return false;
				} else {
					return true;
				}
			});

			if (inputFiles.length !== 1) {
				grunt.log.error('grunt-handlebars-universal can only process a single template per destination.  Found '+inputFiles.length+ ' files destined for '+destFile);
				return;
			}

			var filepath = inputFiles[0];
			
			var src = grunt.file.read(filepath),
				compiled;

			try {
				compiled = handlebars.precompile(handlebars.parse(src), {knownHelpersOnly: false});
				compiled = 'Handlebars.template('+compiled+')\n';
			} catch (e) {
				grunt.log.error(e);
				grunt.fail.warn('Handlebars failed to compile '+filepath+'.');
				return;
			}

			var contents = ["(function (init, context) {"];

			if (options.node) {
				if (options.nodePassIn) {
					contents.push("if ( typeof module === 'object' && module && typeof module.exports === 'object' ) {module.exports = function (hb) {return init(hb);};return;}");
				} else {
					contents.push("if ( typeof module === 'object' && module && typeof module.exports === 'object' ) {module.exports = init(require('Handlebars'));return;}");
				}
			}

			if (options.amd) {
				contents.push("if ( typeof define === 'function' && define.amd ) {define(['Handlebars'], function (Handlebars) { return init(Handlebars); });return;}");
			}

			if (options.namespace) {
				var namespace;
				if (typeof options.namespace === 'function') {
					namespace = options.namespace(filepath);
					namespace = declare(namespace, { value: "init(context.Handlebars)", global: options.global });
				} else {
					namespace = declare(options.namespace, { value: "", global: options.global }).slice(0, -4);
					namespace += '["'+ filepath + '"] = init(context.Handlebars);';
				}

				contents.push(namespace);
			}

			contents.push("})(function (Handlebars, undefined) {");
			contents.push('return ' + compiled);
			contents.push(';});');

			grunt.file.write(destFile, contents.join('\n'));

			grunt.log.writeln('File ' + destFile.cyan + ' created.');

		});

	});

};