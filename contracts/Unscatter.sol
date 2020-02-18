pragma solidity ^0.5.0;

import '@openzeppelin/contracts/token/ERC20/IERC20.sol';
import './Scatter.sol';

contract Unscatter {
  address payable private _owner;
  SCATTER private _scatter;

  modifier onlyOwner {
    require(msg.sender == _owner, 'Unscatter: sender must be owner');
    _;
  }

  constructor (address payable scatter) public {
    _owner = msg.sender;
    _scatter = SCATTER(scatter);
  }

  /**
   * @notice remove ERC20 tokens (STT) from contract
   * @param token address of ERC20 token
   */
  function withdraw (address token) external onlyOwner {
    IERC20(token).transfer(_owner, IERC20(token).balanceOf(address(this)));
  }

  /**
   * @notice transfer to a given list of pre-filtered targets
   * @param targets list of target addresses
   */
  function scatter (address[] calldata targets, uint amount) external onlyOwner {
    for (uint i = 0; i < targets.length; i++) {
      _scatter.transfer(targets[i], amount);
    }
  }

  /**
   * @notice filter a list of targets for ether balance and STT infection status
   * @param targets list of target addresses to filter
   * @return address[] list of passed addresses with ineligible members replaced with zero address
   */
  function filter (address[] calldata targets) external view returns (address[] memory) {
    address[] memory validTargets = new address[](targets.length);

    for (uint i = 0; i < targets.length; i++) {
      if (!_scatter.active(targets[i]) && targets[i].balance > 0) {
        validTargets[i] = targets[i];
      }
    }

    return validTargets;
  }

  /**
   * @notice get number of STT pool shares held by current contract
   * @return uint number of pool shares
   */
  function poolShares () external view returns (uint) {
    uint shares = 0;

    for (uint i = 0; i < 256; i++) {
      if (_scatter.rewardlist(i) == address(this)) {
        shares++;
      }
    }

    return shares;
  }
}
