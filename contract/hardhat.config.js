require("@nomiclabs/hardhat-waffle");
module.exports = {
  solidity: {
    compilers: [
      {
        version: "0.8.0",
      },
      {
        version: "0.5.16",
        settings: {},
      },
      {
        version: "0.6.6",
        settings: {},
      },
    ],
  },
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {
      chainId: 1337,
      allowUnlimitedContractSize: true
    },
    rinkeby: {
      url: "https://eth-rinkeby.alchemyapi.io/v2/T1A9zZnRCXY34aGPcciRTjDJoFI-JVMk",
      accounts: [ "61d909c5411499cd5feb95c730ec48f6271b3944ad3ebe5a0893d4e766a49a05" ]
    }
  }
};
