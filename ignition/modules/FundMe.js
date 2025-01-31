const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");
const MockV3AggregatorModule = require("./Mocks");

module.exports = buildModule("FundMeModule", (m) => {
  let ethUsdPriceFeedAddress;

  if (hre.network.config.tags.includes("dev")) {
    const { MockV3Aggregator } = m.useModule(MockV3AggregatorModule);
    ethUsdPriceFeedAddress = MockV3Aggregator;
  }

  if (
    hre.network.config.tags.includes("testnet") ||
    hre.network.config.tags.includes("mainnet")
  ) {
    let priceFeed = hre.network.config.ethUsdPriceFeed;
    if (!priceFeed) {
      throw new Error(
        `Price feed address not found for network: ${hre.network.name}`
      );
    }
    ethUsdPriceFeedAddress = priceFeed;
  }

  const FundMe = m.contract("FundMe", [ethUsdPriceFeedAddress], {});
  return { FundMe };
});
