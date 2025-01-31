const { ethers, ignition } = require("hardhat");
const { expect, assert } = require("chai");

const FundMeModule = require("../../ignition/modules/FundMe");

describe("FundMe", async function () {
  let FundMe, owner;
  let sendValue = ethers.parseEther("1.0");

  this.beforeEach(async function () {
    // it should deploy the contract
    ({ FundMe } = await ignition.deploy(FundMeModule));
    [owner] = await ethers.getSigners();
  });

  it("it should have 0 ETH on initialization", async function () {
    const balance = await FundMe.getBalance();
    assert.equal(balance, ethers.parseEther("0"));
  });

  describe("fallback", async function () {
    it("should trigger fallback when sending ETH", async function () {
      const value = ethers.parseEther("1.0");
      const addr = await FundMe.address;

      const tx = await owner.sendTransaction({
        to: addr,
        value: value,
      });

      tx.wait();

      const bal = await FundMe.getBalance();
      assert(bal, val);
    });
  });

  describe("fund", async function () {
    it("fails if you do not send enough ETH", async function () {
      expect(FundMe.fund()).to.be.reverted;
    });

    it("updates the amount funded data mapping", async function () {
      await FundMe.fund({ value: sendValue });
      const resp = await FundMe.s_addressToAmountFunded(owner.address);
      assert.equal(resp.toString(), sendValue.toString());
    });

    it("adds funder to the array of funders", async function () {
      await FundMe.fund({ value: sendValue });
      const funder = await FundMe.s_funders(0);
      assert.equal(funder, owner.address);
    });
  });

  describe("withdraw", async function () {
    this.beforeEach(async function () {
      await FundMe.fund({ value: sendValue });
    });

  });
});
