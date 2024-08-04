pragma solidity ^0.4.18;

contract SimpleStorage {
  uint storedData;

  function set(uint x) public returns (uint) {
    storedData = x;
    return 123;
  }

  function get() public view returns (uint) {
    return storedData;
  }
}
