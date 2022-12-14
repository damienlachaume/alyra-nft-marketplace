import {ethers} from 'hardhat';
import {expect} from 'chai';
import {loadFixture} from '@nomicfoundation/hardhat-network-helpers';

describe('GLTrailFactory contract', function () {
  async function deployFactoryFixture() {
    const GLTrailFactory = await ethers.getContractFactory('GLTrailFactory');
    const [owner, addr1] = await ethers.getSigners();

    const glTrailFactory = await GLTrailFactory.deploy();

    await glTrailFactory.deployed();

    return {GLTrailFactory, glTrailFactory, owner, addr1};
  }

  describe('Create collection', function () {
    it('Should be deployed at address', async function () {
      const {glTrailFactory} = await loadFixture(deployFactoryFixture);
      const contractAddress = glTrailFactory.address;
      console.log(contractAddress);
      expect(contractAddress).to.be.not.null;
    });

    it('Should increase the number of collection', async function () {
      const {glTrailFactory, addr1} = await loadFixture(deployFactoryFixture);

      const nbOfCollectionBefore = await glTrailFactory.numberOfCollection(
        addr1.address
      );

      await glTrailFactory.connect(addr1).createNFTCollection('NAME');

      const nbOfCollectionAfter = await glTrailFactory.numberOfCollection(
        addr1.address
      );

      expect(Number(nbOfCollectionAfter)).to.be.equal(
        Number(nbOfCollectionBefore) + 1
      );
    });

    it('Should fail if name is not provided', async function () {
      const {glTrailFactory, addr1} = await loadFixture(deployFactoryFixture);

      await expect(
        glTrailFactory.connect(addr1).createNFTCollection('')
      ).to.be.revertedWith("Collection's name is mandatory");
    });

    it('Should fail if a contract has already been deployed with the same name', async function () {
      const {glTrailFactory, addr1} = await loadFixture(deployFactoryFixture);

      await glTrailFactory.connect(addr1).createNFTCollection('NAME');

      await expect(
        glTrailFactory.connect(addr1).createNFTCollection('NAME')
      ).to.be.revertedWithoutReason();
    });

    it('Should fail if an address create more than three collections', async function () {
      const {glTrailFactory, addr1} = await loadFixture(deployFactoryFixture);

      await glTrailFactory.connect(addr1).createNFTCollection('NAME1');
      await glTrailFactory.connect(addr1).createNFTCollection('NAME2');
      await glTrailFactory.connect(addr1).createNFTCollection('NAME3');

      await expect(
        glTrailFactory.connect(addr1).createNFTCollection('NAME4')
      ).to.be.revertedWith('Not allowed to create more than 3 collections');
    });
  });

  describe('Whitelist address', function () {
    it('Should whitelist an address', async function () {
      const {glTrailFactory, addr1} = await loadFixture(deployFactoryFixture);

      const whitelistStatusBefore = await glTrailFactory.whitelists(
        addr1.address
      );

      expect(whitelistStatusBefore).to.be.false;

      await glTrailFactory.whitelist(addr1.address);

      const whitelistStatusAfter = await glTrailFactory.whitelists(
        addr1.address
      );

      expect(whitelistStatusAfter).to.be.true;
    });

    it('Should fail if caller is not the owner', async function () {
      const {glTrailFactory, addr1} = await loadFixture(deployFactoryFixture);

      await expect(
        glTrailFactory.connect(addr1).whitelist(addr1.address)
      ).to.be.revertedWith('Ownable: caller is not the owner');
    });

    it('should emit a AddressWhitelisted event', async function () {
      const {glTrailFactory, addr1} = await loadFixture(deployFactoryFixture);

      await expect(glTrailFactory.whitelist(addr1.address))
        .to.emit(glTrailFactory, 'AddressWhitelisted')
        .withArgs(addr1.address);
    });
  });
});
