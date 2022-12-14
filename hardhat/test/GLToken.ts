import {ethers} from 'hardhat';
import {expect} from 'chai';
import {loadFixture, time} from '@nomicfoundation/hardhat-network-helpers';

describe('GLToken contract', function () {
  async function deployTokenFixture() {
    const GLToken = await ethers.getContractFactory('GLToken');
    const [owner, addr1, addr2] = await ethers.getSigners();

    const glToken = await GLToken.deploy(1000000);

    await glToken.deployed();

    return {GLToken, glToken, owner, addr1, addr2};
  }

  describe('Deployment', function () {
    it('Should assign the total supply of tokens to the owner', async function () {
      const {glToken, owner} = await loadFixture(deployTokenFixture);
      const ownerBalance = await glToken.balanceOf(owner.address);
      expect(await glToken.totalSupply()).to.equal(ownerBalance);
    });
  });

  describe('Transactions', function () {
    it('Should transfer tokens between accounts', async function () {
      const {glToken, owner, addr1, addr2} = await loadFixture(
        deployTokenFixture
      );

      // Transfer 50 tokens from owner to addr1
      await expect(() =>
        glToken.transfer(addr1.address, 50)
      ).to.changeTokenBalances(glToken, [owner, addr1], [-50, 50]);

      // Transfer 50 tokens from addr1 to addr2
      await expect(() =>
        glToken.connect(addr1).transfer(addr2.address, 50)
      ).to.changeTokenBalances(glToken, [addr1, addr2], [-50, 50]);
    });

    it('should emit Transfer events', async function () {
      const {glToken, owner, addr1, addr2} = await loadFixture(
        deployTokenFixture
      );

      // Transfer 50 tokens from owner to addr1
      await expect(glToken.connect(owner).transfer(addr1.address, 50))
        .to.emit(glToken, 'Transfer')
        .withArgs(owner.address, addr1.address, 50);

      // Transfer 50 tokens from addr1 to addr2
      await expect(glToken.connect(addr1).transfer(addr2.address, 50))
        .to.emit(glToken, 'Transfer')
        .withArgs(addr1.address, addr2.address, 50);
    });

    it("Should fail if sender doesn't have enough tokens", async function () {
      const {glToken, owner, addr1} = await loadFixture(deployTokenFixture);
      const initialOwnerBalance = await glToken.balanceOf(owner.address);

      // Try to send 1 token from addr1 (0 tokens) to owner.
      // require will evaluate false and revert the transaction.
      await expect(
        glToken.connect(addr1).transfer(owner.address, 1)
      ).to.be.revertedWith('ERC20: transfer amount exceeds balance');

      // Owner balance shouldn't have changed.
      expect(await glToken.balanceOf(owner.address)).to.equal(
        initialOwnerBalance
      );
    });
  });

  describe('Faucet', function () {
    it('Should transfer 100 Greencoins', async function () {
      const {glToken, addr1} = await loadFixture(deployTokenFixture);

      await expect(() =>
        glToken.connect(addr1).faucet(addr1.address)
      ).to.changeTokenBalances(
        glToken,
        [addr1],
        [ethers.utils.parseUnits('100')]
      );
    });

    it('Should transfer 100 more Greencoins after an hour', async function () {
      const {glToken, addr1} = await loadFixture(deployTokenFixture);

      await expect(() =>
        glToken.connect(addr1).faucet(addr1.address)
      ).to.changeTokenBalances(
        glToken,
        [addr1],
        [ethers.utils.parseUnits('100')]
      );

      // advance time by one hour and mine a new block
      await time.increase(3600);

      await expect(() =>
        glToken.connect(addr1).faucet(addr1.address)
      ).to.changeTokenBalances(
        glToken,
        [addr1],
        [ethers.utils.parseUnits('100')]
      );
    });

    it('should emit Faucet events', async function () {
      const {glToken, addr1, addr2} = await loadFixture(deployTokenFixture);

      await expect(glToken.connect(addr1).faucet(addr2.address))
        .to.emit(glToken, 'Faucet')
        .withArgs(addr1.address, addr2.address);
    });

    it("Should fail if caller don't wait at least an hour between two calls", async function () {
      const {glToken, addr1} = await loadFixture(deployTokenFixture);

      await glToken.connect(addr1).faucet(addr1.address);

      await expect(
        glToken.connect(addr1).faucet(addr1.address)
      ).to.be.revertedWith('Wait at least one hour');
    });
  });
});
