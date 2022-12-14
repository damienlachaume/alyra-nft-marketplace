import {deployGLTrailContract} from '../src/deploy';

async function main() {
  await deployGLTrailContract();
}

main()
  .then(() => {
    process.exit(0);
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
