const { ethers } = require("hardhat");

const overrides = {
  gasLimit: 9999999
}

async function main() {

        const [deployer] = await ethers.getSigners();
        Token = await ethers.getContractFactory("SimpleToken");
        WBNB = await ethers.getContractFactory("WETH9");

        token1 = await Token.deploy("Game Token", "GM", ethers.utils.parseEther("10000000"));
        Token2 = await ethers.getContractFactory("SimpleToken");
        token2 = await Token2.deploy("Meta Token", "MM",  ethers.utils.parseEther("10000000"));
        weth = WBNB.attach("0xc778417E063141139Fce010982780140Aa0cD5Ab").connect(deployer);

        await weth.deposit({value: ethers.utils.parseEther("0.5")});

        Factory = await ethers.getContractFactory("PancakeFactory");
        factory = Factory.attach("0x5c69bee701ef814a2b6a3edd4b1652cb9cc5aa6f").connect(deployer);

        ETF = await ethers.getContractFactory("ETF");
        etf = await ETF.deploy("Broad ETF", "BETF", "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D", token1.address, token2.address);

        PancakePair = await ethers.getContractFactory("contracts/PancakePair.sol:PancakePair");

        const tx1 = await factory.createPair(weth.address, token1.address);
        await tx1.wait()

        const tx2 =await factory.createPair(weth.address, token2.address);
        await tx2.wait()

        pairAddress1 = await factory.getPair(weth.address, token1.address);
        pair1 = await PancakePair.attach(pairAddress1).connect(deployer);


        const tx3 = await weth.approve(pairAddress1, ethers.utils.parseEther("0.1"), overrides);
        await tx3.wait()
        await weth.transferFrom(deployer.address, pairAddress1, ethers.utils.parseEther("0.1"), overrides);
        console.log("a")

        const tx4 = await token1.transfer(pairAddress1, ethers.utils.parseEther("10000"));
        await tx4.wait()
        console.log("b")

        await pair1.mint(deployer.address)

        pairAddress2 = await factory.getPair(weth.address, token2.address);
        pair2 = await PancakePair.attach(pairAddress2).connect(deployer);
        console.log("c")

        const tx5 = await weth.approve(pairAddress2, ethers.utils.parseEther("0.1"), overrides);
        await tx5.wait()
        await weth.transferFrom(deployer.address, pairAddress2, ethers.utils.parseEther("0.1"), overrides);
        console.log("d")

        const tx6 = await token2.transfer(pairAddress2, ethers.utils.parseEther("10000"), overrides);
        await tx6.wait(1)
        await pair2.mint(deployer.address, overrides)
        console.log("e")
  
        console.log("Token 1 address:", token1.address);
        console.log("Token 2 address:", token2.address);
        console.log("Weth address:", weth.address);
        console.log("ETF address:", etf.address);
  }
  
  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });