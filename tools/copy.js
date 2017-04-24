import path from 'path';
import chokidar from 'chokidar';
import { readFile, writeFile, copyFile, makeDir, copyDir, cleanDir } from './lib/fs';
import pkg from '../src/api/package.json';
import { format } from './run';

/**
 * Copies static files such as robots.txt, favicon.ico to the
 * output (build) folder.
 */
async function copy() {
  const src = path.join(__dirname, '../', 'src');

  // copy API source
  await makeDir('build');
  await copyDir(`${src}/api/dist`, 'build/');
  await writeFile('build/package.json', JSON.stringify({
    private: true,
    engines: pkg.engines,
    dependencies: pkg.dependencies,
    scripts: {
      preinstall: 'npm install pm2',
      start: 'pm2 start --attach index.js',
    },
  }, null, 2));
  const env = await readFile(`${src}/api/.env.production`);
  await writeFile('build/.env', env);

  // copy web source
  await makeDir('build/web');
  await Promise.all([
    copyDir(`${src}/client/build`, 'build/web'),
  ]);
}

export default copy;
