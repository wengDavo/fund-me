const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("MockV3AggregatorModule", (m) => {
	if (!hre.network.config.tags.includes("dev")) {
		throw new Error(`Not a Development network: ${hre.network.name}`);
	}
	const MOCK_DECIMAL_PLACES = 8;
	const MOCK_INITIAL_PRICEFEED = 2000_00000000;

	console.log("Local network deploying mocks ...");
	const MockV3Aggregator = m.contract(
		"MockV3Aggregator",
		[MOCK_DECIMAL_PLACES, MOCK_INITIAL_PRICEFEED],
		{
			log: true,
		}
	);
	console.log("Mocks Deployed");

	return { MockV3Aggregator };
});
