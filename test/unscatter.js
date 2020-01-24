const truffleAssert = require('truffle-assertions');

const Unscatter = artifacts.require('Unscatter');
const Scatter = artifacts.require('SCATTER');

contract('Unscatter', function (accounts) {
  const OWNER = accounts[0];
  const NOBODY = accounts[1];

  const RECIPIENTS = accounts.slice(2);
  const INACTIVE = RECIPIENTS[0] = '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE';
  const INFECTED = RECIPIENTS[1];

  const DATA = require('../data/data.js');

  const SCATTER_SIZE = 50;
  const FILTER_SIZE = 1500;

  let scatter;
  let instance;

  before(async function () {
    assert(RECIPIENTS.length >= 3);
    assert(DATA.length > 1000, 'JSON address array must be placed in data/addresses/');

    for (let i = 0; i < SCATTER_SIZE; i++) {
      await web3.eth.sendTransaction({ to: DATA[i], from: NOBODY, value: 1 });
    }
  });

  beforeEach(async function () {
    scatter = await Scatter.new({ from: NOBODY });
    instance = await Unscatter.new(scatter.address, { from: OWNER });

    // infect address
    await scatter.transfer(INFECTED, web3.utils.toBN(1e18), { from: NOBODY });

    // transfer remaining Scatter tokens to Unscatter instance
    await scatter.transfer(instance.address, await scatter.balanceOf.call(NOBODY), { from: NOBODY });
  });

  describe('fallback function', function () {
    it('accepts ether', async function () {
      let initialBalance = web3.utils.toBN(await web3.eth.getBalance(instance.address));
      let deltaBalance = web3.utils.toBN(1);

      await truffleAssert.passes(
        instance.send('', { value: deltaBalance })
      );

      let finalBalance = web3.utils.toBN(await web3.eth.getBalance(instance.address));

      assert(initialBalance.add(deltaBalance).eq(finalBalance));
    });
  });

  describe('#withdraw', function () {
    it('transfers tokens to owner', async function () {
      let initialBalance = await scatter.balanceOf.call(OWNER);
      let deltaBalance = await scatter.balanceOf.call(instance.address);

      await instance.withdraw(scatter.address, { from: OWNER });

      assert(initialBalance.add(deltaBalance).eq(await scatter.balanceOf.call(OWNER)));
    });

    describe('reverts if', function () {
      it('sender is not owner', async function () {
        await truffleAssert.reverts(
          instance.withdraw(scatter.address, { from: NOBODY }),
          'Unscatter: sender must be owner'
        );
      });
    });
  });

  describe('#withdrawEther', function () {
    it('transfers ether to owner');

    describe('reverts if', function () {
      it('sender is not owner', async function () {
        await truffleAssert.reverts(
          instance.withdrawEther({ from: NOBODY }),
          'Unscatter: sender must be owner'
        );
      });
    });
  });

  describe('#scatter', function () {
    it('transfers 1e18 units of Scatter token to recipients', async function () {
      let expectedBalances = RECIPIENTS.map(async (a) => (await scatter.balanceOf.call(a)).add(web3.utils.toBN(1e18)));

      await instance.scatter(RECIPIENTS, { from: OWNER });

      for (let i = 0; i < RECIPIENTS.length; i++) {
        assert((await scatter.balanceOf.call(RECIPIENTS[i])).eq(await expectedBalances[i]));
      }
    });

    it('executes call with large dataset', async function () {
      await truffleAssert.passes(
        instance.scatter(DATA.slice(0, SCATTER_SIZE), { from: OWNER })
      );
    });

    it('executes call with transfers to self', async function () {
      let data = [];

      for (let i = 0; i < SCATTER_SIZE; i++) {
        data[i] = instance.address;
      }

      await truffleAssert.passes(
        instance.scatter(data, { from: OWNER })
      );
    });

    describe('reverts if', function () {
      it('sender is not owner', async function () {
        await truffleAssert.reverts(
          instance.scatter(RECIPIENTS, { from: NOBODY }),
          'Unscatter: sender must be owner'
        );
      });
    });
  });

  describe('#filter', function () {
    it('filters infected or inactive addresses', async function () {
      let filtered = await instance.filter.call(RECIPIENTS);
      assert(web3.utils.toBN(filtered[0]).isZero());
      assert(web3.utils.toBN(filtered[1]).isZero());
      assert.equal(filtered.reduce((acc, el) => acc + !web3.utils.toBN(el).isZero(), 0), RECIPIENTS.length - 2);
    });

    it('executes call with large dataset', async function () {
      await truffleAssert.passes(
        instance.filter.call(DATA.slice(0, FILTER_SIZE))
      );
    });
  });

  describe('#poolShares', function () {
    it('returns number of reward pool slots held by the contract', async function () {
      assert.equal(await instance.poolShares.call(), 0);

      await instance.scatter(DATA.slice(0, 5), { from: OWNER });

      assert.equal(await instance.poolShares.call(), 5);
    });
  });
});
