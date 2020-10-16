/**
 * Copy all the non typescript but still required files from src to dist
 */
'use strict';

const shell = require('shelljs');

// Copy all the SQL related directories from database/sql
shell.cp('-R', 'src/database/sql', 'dist/database');
// But remove the typescript file
shell.rm('dist/database/sql/index.ts');

// Also remove the `export` hack from `js/sw.js`
shell.sed('-i', /export default null;/, '', 'assets/public/js/sw.js');
