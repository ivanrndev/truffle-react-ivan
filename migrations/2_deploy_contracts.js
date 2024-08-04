var SimpleStorage = artifacts.require("./SimpleStorage.sol");
var Field = artifacts.require("./Field.sol");

module.exports = function(deployer) {
  deployer.deploy(SimpleStorage);
  deployer.deploy(Field);
};
