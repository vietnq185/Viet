/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

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
  // start web server in dev mode
  const webOptions = {
    cwd: path.resolve(__dirname, '../src/client'),
  };
  spawn('yarn', ['start'], Object.assign({}, options, webOptions));
}

export default dev;
