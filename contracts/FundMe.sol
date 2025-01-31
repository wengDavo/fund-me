// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@chainlink/contracts/src/v0.8/shared/interfaces/AggregatorV3Interface.sol";
import "./PriceConverter.sol";

error FundMe_NotOwner();

/// @title A contract for crowd funding
/// @author Weng Davo
/// @notice This contract is to demone a sample funding
/// @dev This implements price feeds as our library
contract FundMe {
    // Typle Declarations
    using PriceConverter for uint256;

    // State Variables
    address public i_owner;
    uint256 public constant MINIMUM_USD = 50 * 10 ** 18;
    AggregatorV3Interface public s_priceFeedAddr;
    mapping(address => uint256) public s_addressToAmountFunded;
    address[] public s_funders;


    modifier onlyOwner() {
        // require(msg.sender == owner);
        if (msg.sender != i_owner) revert FundMe_NotOwner();
        _;
    }

    constructor(address _priceFeedAddr) {
        i_owner = msg.sender;
        s_priceFeedAddr = AggregatorV3Interface(_priceFeedAddr);
    }

    fallback() external payable {
        fund();
    }

    receive() external payable {
        fund();
    }

    /// @notice This function funds this contract
    /// @dev This implements price feeds as our libraray
    function fund() public payable {
        require(
            msg.value.getConversionRate(s_priceFeedAddr) >= MINIMUM_USD,
            "You need to spend more ETH!"
        );
        // require(PriceConverter.getConversionRate(msg.value) >= MINIMUM_USD, "You need to spend more ETH!");
        s_addressToAmountFunded[msg.sender] += msg.value;
        s_funders.push(msg.sender);
    }

    function getVersion() public view returns (uint256) {
        return s_priceFeedAddr.version();
    }

    /// @notice This function allows the owner to withdraw from the contract
    /// @dev This implements price feeds as our libraray
    function withdraw() public onlyOwner {
        for (
            uint256 funderIndex = 0;
            funderIndex < s_funders.length;
            funderIndex++
        ) {
            address funder = s_funders[funderIndex];
            s_addressToAmountFunded[funder] = 0;
        }
        s_funders = new address[](0);
        // // transfer
        // payable(msg.sender).transfer(address(this).balance);
        // // send
        // bool sendSuccess = payable(msg.sender).send(address(this).balance);
        // require(sendSuccess, "Send failed");
        // call
        (bool callSuccess, ) = payable(msg.sender).call{
            value: address(this).balance
        }("");
        require(callSuccess, "Call failed");
    }
	
	function cheaperWithdraw() public payable onlyOwner{
		address[] memory funders = s_funders;
        for ( uint256 funderIndex = 0; funderIndex < funders.length; funderIndex++
        ) {
            address funder = funders[funderIndex];
            s_addressToAmountFunded[funder] = 0;
        }
        s_funders = new address[](0);
        (bool callSuccess, ) = payable(msg.sender).call{
            value: address(this).balance
        }("");
        require(callSuccess, "Call failed");
	}
	
	function getBalance() external view returns (uint256){
		return address(this).balance;
	}
}
