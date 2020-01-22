pragma solidity *;

interface IScatter {
  function transfer (address to, uint256 tokens) external returns (bool success);
  function active (address) external view returns (bool);
}
