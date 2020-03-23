// test/Box.test.js

// Load dependencies
const { accounts, contract } = require('@openzeppelin/test-environment');
const { expect } = require('chai');

// Import utilities from Test Helpers
const { BN, expectEvent, expectRevert } = require('@openzeppelin/test-helpers');

// Load compiled artifacts
//const address = '0xCfEB869F69431e42cdB54A4F4f105C19C080A601';
//const box = loader.fromArtifact('Box',address);
const Box = contract.fromArtifact('Box');

// Start test block
describe('Box', function () {
  const [ owner, other ] = accounts;
 
  // Use large integers ('big numbers')
  const value = new BN('42');

  beforeEach(async function () {
    // Deploy a new Box contract for each test
    this.contract = await Box.new({ from: owner });
    await this.contract.initialize(owner);
    console.log("owner: " + owner);
    console.log("other: " + other);
  });

  // Test cases
  it('checking owner of contract', async function () {
    expect((await this.contract.owner()).toString()).to.equal(owner);
  });

  it('retrieve returns a value previously stored', async function () {
    // Store a value - recall that only the owner account can do this!
    await this.contract.store(42, { from: owner });

    // Test if the returned value is the same one
    // Note that we need to use strings to compare the 256 bit integers
    //expect((await this.contract.retrieve()).toString()).to.equal('42');
    expect(await this.contract.retrieve()).to.be.bignumber.equal(value);
  });

  it('store emits an event', async function () {
    const receipt = await this.contract.store(value, { from: owner });

    // Test that a ValueChanged event was emitted with the new value
    expectEvent(receipt, 'ValueChanged', { newValue: value });
  });

  it('non owner cannot store a value', async function () {
    // Test a transaction reverts
    await expectRevert(
      this.contract.store(value, { from: other }),
      'Ownable: caller is not the owner'
    );
  });
});