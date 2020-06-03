const path = require('path');
const fs = require('fs-extra');

const OUTPUT = 'dist';
const FILES = [
	'package.json',
	'binding.gyp',
	'README.md',
	'LICENSE',
	'index.d.ts',
	{
		from: 'src/index.js',
		to: 'index.js'
	},
	{
		from: 'src/lib',
		to: 'src/lib'
	}
];

async function build(
	output,
	files
) {
	try {
		if (!fs.existsSync(output)) {
			fs.mkdirSync(output);
		}

		for (let file of files) {
			let source;
			let dist;

			if (typeof file === 'string') {
				source = file;
				dist = file;
			} else {
				source = file.from;
				dist = file.to;
			}

			fs.copy(source, path.join(output, dist));
		}


	} catch (e) {
		console.log(e.message);
		process.exit(1);
	}
}

build(OUTPUT, FILES);
