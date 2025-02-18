const truffleAssert = require('truffle-assertions');

const Unscatter = artifacts.require('Unscatter');
const Scatter = artifacts.require('SCATTER');

contract('Unscatter', function (accounts) {
  const OWNER = accounts[0];
  const SCATTER_OWNER = accounts[1];
  const NOBODY = accounts[2];

  const RECIPIENTS = accounts.slice(3);
  const INACTIVE = RECIPIENTS[0] = '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE';
  const INFECTED = RECIPIENTS[1];

  const DATA = require('../data/data.js');

  const SCATTER_SIZE = 64;
  const FILTER_SIZE = 1500;

  let scatter;
  let instance;

  before(async function () {
    assert(RECIPIENTS.length >= 3);
    assert(DATA.length > 1000, 'JSON address array must be placed in data/addresses/');

    for (let i = 0; i < SCATTER_SIZE; i++) {
      await web3.eth.sendTransaction({ to: DATA[i], from: SCATTER_OWNER, value: 1 });
    }
  });

  beforeEach(async function () {
    scatter = await Scatter.new({ from: SCATTER_OWNER });
    instance = await Unscatter.new(scatter.address, { from: OWNER });

    // infect address
    await scatter.transfer(INFECTED, web3.utils.toBN(1e18), { from: SCATTER_OWNER });

    // transfer remaining Scatter tokens to Unscatter instance
    await scatter.transfer(instance.address, await scatter.balanceOf.call(SCATTER_OWNER), { from: SCATTER_OWNER });
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

  describe('#scatter', function () {
    it('transfers given quantity Scatter token to recipients', async function () {
      let amount = web3.utils.toBN(2e18);
      let expectedBalances = RECIPIENTS.map(async (a) => (await scatter.balanceOf.call(a)).add(amount));

      await instance.scatter(RECIPIENTS, amount, { from: OWNER });

      for (let i = 0; i < RECIPIENTS.length; i++) {
        assert((await scatter.balanceOf.call(RECIPIENTS[i])).eq(await expectedBalances[i]));
      }
    });

    it('executes call with large dataset', async function () {
      await truffleAssert.passes(
        instance.scatter(DATA.slice(0, SCATTER_SIZE), web3.utils.toWei('2'), { from: OWNER })
      );
    });

    it('executes call with transfers to self', async function () {
      let data = [];

      for (let i = 0; i < SCATTER_SIZE; i++) {
        data[i] = instance.address;
      }

      await truffleAssert.passes(
        instance.scatter(data, web3.utils.toWei('2'), { from: OWNER })
      );
    });

    describe('reverts if', function () {
      it('sender is not owner', async function () {
        await truffleAssert.reverts(
          instance.scatter(RECIPIENTS, web3.utils.toWei('2'), { from: NOBODY }),
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

      await instance.scatter(DATA.slice(0, 5), web3.utils.toWei('2'), { from: OWNER });

      assert.equal(await instance.poolShares.call(), 5);
    });
  });
});
