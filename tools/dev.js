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
  spawn('yarn', ['dev'], Object.assign({}, options, apiOptions));
  // start client web server in dev mode
  const clientWebOptions = {
    cwd: path.resolve(__dirname, '../src/client'),
  };
  spawn('yarn', ['start'], Object.assign({}, options, clientWebOptions));
  // start admin web server in dev mode
  const adminWebOptions = {
    cwd: path.resolve(__dirname, '../src/admin'),
  };
  spawn('yarn', ['start'], Object.assign({}, options, adminWebOptions));
}

export default dev;
