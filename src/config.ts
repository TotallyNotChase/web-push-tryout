import { readFileSync } from 'fs';
import path from 'path';

// Custom types/interfaces
import { UserConfig } from './types/userconfig';

// Construct the path to 'userconfig.json' - should be in root directory
const config_path: string = path.join(path.dirname(__dirname), process.env.configfile || 'userconfig.json');

// Read data into a JSON
const config: UserConfig = JSON.parse(readFileSync(config_path).toString());

export default config;
