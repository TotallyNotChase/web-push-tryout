/**
 * Copy all the non typescript but still required files from src to dist
 */
'use strict';

const shell = require('shelljs');

// Copy all the SQL related directories from database/sql
shell.cp('-R', 'src/database/sql', 'dist/database');
// But remove the typescript file
shell.rm('dist/database/sql/index.ts');
