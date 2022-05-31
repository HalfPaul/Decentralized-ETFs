

const { expect } = require("chai");
const { ethers } = require("hardhat");

const overrides = {
  gasLimit: 9999999
}


describe("ETF Testing", function () {
    beforeEach(async () => {
        [owner, pancakeOwner, addr1, ...addrs] = await ethers.getSigners();
        Token = await ethers.getContractFactory("SimpleToken");
        WBNB = await ethers.getContractFactory("WBNB");

        token1 = await Token.deploy("Game Token", "GM", ethers.utils.parseEther("10000000"));
        token2 = await Token.deploy("Meta Token", "MM",  ethers.utils.parseEther("10000000"));
        weth = await WBNB.deploy();

        await weth.deposit({value: ethers.utils.parseEther("20")});

        Factory = await ethers.getContractFactory("PancakeFactory");
        factory = await Factory.deploy(pancakeOwner.address);

        Router = await ethers.getContractFactory("PancakeRouter");
        router = await Router.deploy(factory.address, weth.address);

        ETF = await ethers.getContractFactory("ETF");
        etf = await ETF.deploy("Broad ETF", "BETF", router.address, token1.address, token2.address);

        PancakePair = await ethers.getContractFactory("contracts/PancakePair.sol:PancakePair");

        await factory.createPair(weth.address, token1.address);

        await factory.createPair(weth.address, token2.address);

        pairAddress1 = await factory.getPair(weth.address, token1.address);
        pair1 = await PancakePair.attach(pairAddress1).connect(owner);


        await weth.approve(pairAddress1, ethers.utils.parseEther("10"), overrides);
        await weth.transferFrom(owner.address, pairAddress1, ethers.utils.parseEther("10"), overrides);

        await token1.transfer(pairAddress1, ethers.utils.parseEther("10000"));
        await pair1.mint(owner.address)
        pairAddress2 = await factory.getPair(weth.address, token2.address);
        pair2 = await PancakePair.attach(pairAddress2).connect(owner);

        await weth.approve(pairAddress2, ethers.utils.parseEther("10"), overrides);
        await weth.transferFrom(owner.address, pairAddress2, ethers.utils.parseEther("10"), overrides);

        await token2.transfer(pairAddress2, ethers.utils.parseEther("10000"));
        await pair2.mint(owner.address)

        //console.log(await router.getAmountsOut(ethers.utils.parseEther("10"), [weth.address, token1.address]))
    });

    describe("Router", function () {
        it("swap 1 succesfully", async function () {

          //await router.swapExactETHForTokens(ethers.utils.parseEther("0.2"), [weth.address, token1.address], owner.address, 1845102659, {value: ethers.utils.parseEther("1")})
        });

        it("swap 2 succesfully", async function () {

          //await router.swapExactETHForTokens(ethers.utils.parseEther("0.2"), [weth.address, token2.address], owner.address, 1845102659, {value: ethers.utils.parseEther("1")})
        });
        
      });

      describe("ETF", function () {
        it("token amounts should be correct", async function() {
          expect(await etf.token1amount()).to.equal(50);
          expect(await etf.token2amount()).to.equal(50);
        });
        it("fee should be correct", async function() {
          expect((await etf.owner_fee()) / 10**(await etf.fee_percentage_decimals())).to.equal(0.005);
        });
        it("should get token price", async function() {
          //expect(await etf.getTokenPrice()[0]).to.equal(0)
          expect(await etf.getTokenPrice()).to.not.be.undefined;
        })
        it("should get minimum tokens", async function() {
          const prices = await etf.getTokenPrice();
          /* console.log(await etf.getMinimumTokens(prices[0], [weth.address, token1.address]))
          console.log(await etf.getMinimumTokens(prices[1], [weth.address, token1.address])) */
          expect(await etf.getMinimumTokens(prices[0], [weth.address, token1.address])).to.not.equal(0);
          expect(await etf.getMinimumTokens(prices[1], [weth.address, token2.address])).to.not.equal(0);
          
          
        });
        it("should buy and mint tokens", async function() {
          
          await etf.mint({value: ethers.utils.parseEther("0.1")});

          console.log("User got " + (await etf.balanceOf(owner.address)) + " etf tokens");
          console.log("Contract got " + (await token1.balanceOf(etf.address)) + " tokens 1");
          console.log("Contract got " + (await token2.balanceOf(etf.address)) + " tokens 2");
          expect(await token1.balanceOf(etf.address)).to.not.equal(0);
          expect(await etf.balanceOf(owner.address)).to.not.equal(0);
        });
        it("should sell and burn tokens", async function() {
          const provider = ethers.provider;

          const balance1 = await provider.getBalance(owner.address);
          await etf.mint({value: ethers.utils.parseEther("0.1")});

          

          const amount = await etf.balanceOf(owner.address);
          await etf.approve(etf.address, amount);
          await etf.approve(router.address, amount);
          expect(await etf.allowance(owner.address, etf.address)).to.equal(await amount);
          await etf.connect(owner).burn(amount);
          
          const balance2 = await provider.getBalance(owner.address);

          console.log(balance1.toString());
          console.log(balance2.toString());
          //console.log(await provider.getBalance(etf.address))
          //expect(balance2).to.not.equal(balance1)

        });
        it("should sell and burn tokens of 2 users", async function() {
          const provider = ethers.provider;

          const balance1 = await provider.getBalance(owner.address);
          const balance2 = await provider.getBalance(addr1.address);
          await etf.mint({value: ethers.utils.parseEther("1")});
          await etf.connect(addr1).mint({value: ethers.utils.parseEther("5")})

          const balance3 = await provider.getBalance(owner.address);
          const balance4 = await provider.getBalance(addr1.address);

          const amount = await etf.balanceOf(owner.address);

          await etf.connect(owner).approve(etf.address, amount);

          await etf.connect(addr1).approve(etf.address, amount);
          
          await etf.connect(owner).burn(amount);
          await etf.connect(addr1).burn(amount);
          
          

          const amount2 = await etf.balanceOf(addr1.address);
          await etf.connect(addr1).approve(etf.address, amount2);
          await etf.connect(addr1).burn(amount2);

          const balance5 = await provider.getBalance(owner.address);
          const balance6 = await provider.getBalance(addr1.address);

          console.log(ethers.utils.formatEther(balance1).toString());
          console.log(ethers.utils.formatEther(balance3).toString());
          console.log(ethers.utils.formatEther(balance5).toString());
          console.log(ethers.utils.formatEther(balance2).toString());
          console.log(ethers.utils.formatEther(balance4).toString());
          console.log(ethers.utils.formatEther(balance6).toString());

          
          //console.log(await provider.getBalance(etf.address))
          //expect(balance2).to.not.equal(balance1)

        });
      })
})