import path from 'path';
import { spawn } from './lib/cp';

async function dev() {
  const options = {
    stdio: ['ignore', 'inherit', 'inherit'],
    shell: true,
  };
  // start API server in dev mode
  const apiOptions = {
    cwd: path.resolve(__dirname, '../src/api'),
  };
  spawn('yarn', ['install'], Object.assign({}, options, apiOptions));
  // start web server in dev mode
  const webOptions = {
    cwd: path.resolve(__dirname, '../src/client'),
  };
  spawn('yarn', ['install'], Object.assign({}, options, webOptions));
}

export default dev;
