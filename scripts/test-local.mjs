import { spawnSync } from 'node:child_process';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const playwrightCli = require.resolve('@playwright/test/cli');
const localApiBaseUrl = 'http://127.0.0.1:8080/api/v3';

function run(command, args, options = {}) {
  const result = spawnSync(command, args, {
    stdio: 'inherit',
    ...options,
  });

  if (result.error) {
    throw result.error;
  }

  return result.status ?? 1;
}

function isDockerRunning() {
  const result = spawnSync('docker', ['info'], {
    stdio: 'ignore',
  });

  return !result.error && result.status === 0;
}

let composeStarted = false;

try {
  if (!isDockerRunning()) {
    console.error(
      [
        'Docker nao esta em execucao.',
        'Inicie o Docker Desktop e aguarde o status "Engine running".',
        'Depois, execute novamente: npm run test:local',
      ].join('\n'),
    );
    process.exitCode = 1;
  } else {
    composeStarted = true;
    const upStatus = run('docker', ['compose', 'up', '-d', '--wait']);

    if (upStatus !== 0) {
      process.exitCode = upStatus;
    } else {
      process.exitCode = run(
        process.execPath,
        [playwrightCli, 'test', '--project=api'],
        {
          env: {
            ...process.env,
            API_BASE_URL: localApiBaseUrl,
          },
        },
      );
    }
  }
} finally {
  if (composeStarted) {
    const downStatus = run('docker', ['compose', 'down', '--volumes']);

    if (downStatus !== 0 && !process.exitCode) {
      process.exitCode = downStatus;
    }
  }
}
