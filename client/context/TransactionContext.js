import React, { useEffect, useState } from "react"
import { ethers } from "ethers"
import {contractABI, etfAddress } from '../utils/constants'
import { EventFragment } from "ethers/lib/utils";

export const TransactionContext = React.createContext();


if (typeof window !== 'undefined') {
    const { ethereum } = window;
}


const getEthereumContract = () => {
    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
    const etfContract = new ethers.Contract(etfAddress, contractABI, signer);

    return etfContract;
}



export const TransactionProvider = ({children}) => {
    const [currentAccount, setCurrentAccount] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const [amount, setAmount] = useState("");
    const [etfPrice, setEtfPrice] = useState("0.0");

    const handleChange = async(e) => {
        setAmount(e.target.value)

        let price = await getPrice(e.target.value);

        setEtfPrice(price)
    }


    const isConnected = async() => {
        try {
            if(!ethereum) return alert("Please install Metamask");
            const accounts = await ethereum.request({ method: 'eth_accounts'});

            if (accounts.length) {
                setCurrentAccount(accounts[0]);
            }
        } catch (error) {
            console.log(error);
            throw new Error("No eth object");
        }
    }

    const connectWallet = async() => {
        try {
            if(!ethereum) return alert("Please install Metamask");
            const accounts = await ethereum.request({ method: 'eth_requestAccounts'});

            setCurrentAccount(accounts[0]);
        } catch (error) {
            console.log(error);

            throw new Error("No eth object");
        }
    }

    const getPrice = async(eth_amount) => {
        try {
            const transactionContract = getEthereumContract();
    
            let etf_amount = await transactionContract.getEtfPrice(ethers.utils.parseEther(eth_amount));

            return etf_amount;
        } catch {
            return 0;
        }
    }

    const sendTransaction = async() => {
        try {
            if(!ethereum) return alert("Please install Metamask");
            console.log("A")
            const transactionContract = getEthereumContract();
    
            const tx = await transactionContract.mint({value: ethers.utils.parseEther(amount)})
    
            setIsLoading(true);
    
            await tx.wait();
            setIsLoading(false);
        } catch(error) {
            console.log(error);
            throw new Error("No eth object");
        }
    }

    useEffect(() => {
        isConnected();
    }, [])
    return (
        <TransactionContext.Provider value={{ connectWallet, currentAccount, amount, setAmount, handleChange, sendTransaction, getPrice, etfPrice }}>
            {children}
        </TransactionContext.Provider>
    )
}