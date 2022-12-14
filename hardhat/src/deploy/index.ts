import hre from 'hardhat';

export async function deployGLTrailContract() {
  const constructorArguments = [
    'https://greenlooptrail.base.uri/',
    'GreenLoopTrail',
    'GCJ',
  ];
  const contractFactory = await hre.ethers.getContractFactory('GLTrail');
  const contract = await contractFactory.deploy(...constructorArguments);

  await contract.deployed();

  console.log('GreenLoop Trail deployed to:', contract.address);

  await new Promise((r) => setTimeout(r, 1000 * 60));

  await hre.run('verify:verify', {
    address: contract.address,
    constructorArguments,
  });
  return contract;
}
