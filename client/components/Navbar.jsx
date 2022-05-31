import React, { useContext } from "react";
import logo from "../assets/logo.svg";
import Image from 'next/image';

import { TransactionContext } from "../context/TransactionContext";
const NavbarItem = ({title, classProps}) => {
    return (
        <li className={`mx-4 cursor-pointer ${classProps}`}>{title}</li>
    )
}
//https://cssgradient.io/gradient-backgrounds/
//https://javascript.plainenglish.io/10-killer-web-apps-that-will-increase-your-productivity-881e77766379

const Navbar = () => {
    const { connectWallet, currentAccount } = useContext(TransactionContext);

    return (
    <nav className="w-full flex md:justify-center justify-between p-4">
      <div className="md:flex-[0.5] flex-initial justify-center items-center">
        <Image src={logo} alt="logo" className="w-32 cursor-pointer" />
      </div>
        <ul className="text-white md:flex hidden list-none flex-row justify-between items-center flex-initial">
        {["How It Works"].map((item, index) => (
          <NavbarItem key={item + index} title={item} />
        ))}
        {!currentAccount ? (<button onClick={connectWallet} className="bg-[#2952e3] py-2 px-7 mx-4 rounded-full cursor-pointer hover:bg-[#2546bd]">
          Connect Wallet
        </button>) :
        (<button className="bg-[#2952e3] py-2 px-7 mx-4 rounded-full cursor-pointer hover:bg-[#2546bd]">
          {currentAccount.substring(0,12)}...
        </button> )}     
      </ul>
    </nav>
    );
}

export default Navbar;