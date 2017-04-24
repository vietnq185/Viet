import path from 'path';
import { spawn } from './lib/cp';

async function build() {
  const options = {
    stdio: ['ignore', 'inherit', 'inherit'],
    shell: true,
  };
  // build API
  const apiOptions = {
    cwd: path.resolve(__dirname, '../src/api'),
  };
  await spawn('yarn', ['build'], Object.assign({}, options, apiOptions));
  // build web
  const webOptions = {
    cwd: path.resolve(__dirname, '../src/client'),
  };
  await spawn('yarn', ['build'], Object.assign({}, options, webOptions));
}

export default build;
