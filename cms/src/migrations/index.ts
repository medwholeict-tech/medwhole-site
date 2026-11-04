import * as migration_20261021_005037_initial_medwhole_cms from './20261021_005037_initial_medwhole_cms';
import * as payload_only from './20261104_160000_payload_only';

export const migrations = [
  {
    up: migration_20261021_005037_initial_medwhole_cms.up,
    down: migration_20261021_005037_initial_medwhole_cms.down,
    name: '20261021_005037_initial_medwhole_cms'
  },
  { up: payload_only.up, down: payload_only.down, name: '20261104_160000_payload_only' },
];
