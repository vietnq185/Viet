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
  // build web client
  const clientWebOptions = {
    cwd: path.resolve(__dirname, '../src/client'),
  };
  await spawn('yarn', ['build'], Object.assign({}, options, clientWebOptions));
  // build web admin
  const adminWebOptions = {
    cwd: path.resolve(__dirname, '../src/admin'),
  };
  await spawn('yarn', ['build'], Object.assign({}, options, adminWebOptions));
}

export default build;
