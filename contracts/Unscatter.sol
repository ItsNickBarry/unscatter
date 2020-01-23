pragma solidity ^0.5.0;

import '@openzeppelin/contracts/token/ERC20/IERC20.sol';
import './Scatter.sol';

contract Unscatter {
  address private _owner;
  SCATTER private _scatter;

  modifier onlyOwner {
    require(msg.sender == _owner, 'Unscatter: sender must be owner');
    _;
  }

  constructor (address payable scatter) public {
    _owner = msg.sender;
    _scatter = SCATTER(scatter);
  }

  function withdraw (address token) external onlyOwner {
    IERC20(token).transfer(_owner, IERC20(token).balanceOf(address(this)));
  }

  function scatter (address[] calldata targets) external onlyOwner {
    for (uint i = 0; i < targets.length; i++) {
      _scatter.transfer(targets[i], 1e18);
    }
  }

  function filter (address[] calldata targets) external view returns (address[] memory) {
    address[] memory validTargets = new address[](targets.length);

    for (uint i = 0; i < targets.length; i++) {
      if (!_scatter.active(targets[i]) && targets[i].balance > 0) {
        validTargets[i] = targets[i];
      }
    }

    return validTargets;
  }
}
