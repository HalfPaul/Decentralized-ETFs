import React, { useContext, Fragment, useState, useRef, useEffect } from "react";
import { ethers } from "ethers"

import Image from 'next/image'
import { RiSettings3Fill } from 'react-icons/ri'
import { FiInfo } from 'react-icons/fi'
import { BsBroadcast } from 'react-icons/bs'
import { BsPerson } from 'react-icons/bs'
import { AiOutlineDown } from 'react-icons/ai'
import {GiConsoleController} from 'react-icons/gi';
import ethLogo from '../assets/eth.png'

import { TransactionContext } from "../context/TransactionContext";

import { Listbox, Transition, Popover} from '@headlessui/react'

const style = {
    wrapper: `w-screen flex items-center justify-center mt-14`,
    content: `bg-[#ffffff] w-[40rem] rounded-2xl p-4`,
    formHeader: `px-2 flex items-center justify-between font-semibold text-xl`,
    transferPropContainer: `bg-[#ebf0f7] my-3 rounded-2xl p-6 text-3xl hover:border-[#41444F]  flex justify-between`,
    transferPropInput: `bg-transparent placeholder:text-[#B2B9D2] outline-none mb-6 w-full text-2xl`,
    currencySelector: `flex w-1/4`,
    currencySelectorContent: `w-full h-min flex justify-between items-center bg-[#ffffff] hover:bg-[#41444F] rounded-2xl text-xl font-medium cursor-pointer p-2 mt-[-0.2rem]`,
    currencySelectorIcon: `flex items-center`,
    currencySelectorTicker: `mx-2 `,
    currencySelectorArrow: `text-lg`,
    confirmButton: `bg-[#2172E5] my-2 rounded-2xl py-6 px-8 text-xl font-semibold flex items-center justify-center cursor-pointer border border-[#2172E5] hover:border-[#234169]`,
}

const EthLogoImage = () => {
  return (
    <div className={style.currencySelectorIcon}>
      <Image src={ethLogo} alt='eth logo' height={20} width={20} />
    </div>
  )
}

const logos = {
  "ETH": EthLogoImage,
  "BETF": BsBroadcast,
  "GETF": GiConsoleController,
  "ABETF": BsPerson
}
const people = [
  { name: 'ETH' },
  { name: 'BETF' },
  { name: 'GETF' },
  { name: 'ABETF' },
]

function MyPopover() {
  const [isShowing, setIsShowing] = useState(false)

  return (
      <Popover anchorReference={"none"}>
        {({ open }) => {
          return (
            <>
                   
                <Popover.Button  onMouseEnter={() => setIsShowing(true)}
                          onMouseLeave={() => setIsShowing(false)}>
                  <FiInfo aria-hidden="true"/>
                </Popover.Button>
                <Transition
                  show={isShowing}
                  onMouseEnter={() => setIsShowing(true)}
                  onMouseLeave={() => setIsShowing(false)}
                  as={Fragment}
                  enter="transition ease-out duration-200"
                  enterFrom="opacity-0 translate-y-1"
                  enterTo="opacity-100 translate-y-0"
                  leave="transition ease-in duration-150"
                  leaveFrom="opacity-100 translate-y-0"
                  leaveTo="opacity-0 translate-y-1"
                >
                  <Popover.Panel className="absolute inset-0 h-500 px-4 mt-0 sm:px-0 lg:max-w-3xl z-[10]">
                    <div
                      className="overflow-hidden items-center fixed w-[500] h-[200] overflow-hidden rounded-lg shadow-lg z-[20]"
                    >
                      <div className="relative bg-white p-7 w-auto">
                        Laba diena
                      </div>
                    </div>
                  </Popover.Panel>
                  </Transition>
            </>
          )
        }}
      </Popover>
  )
}

const CurrencyTicker = () => {

  const [selected, setSelected] = useState(people[0]);
  return (
  <div className={style.currencySelector}>
    <div className={style.currencySelectorContent}>
      <Listbox value={selected} onChange={setSelected}>
      <div className="relative mt-1">
        <Listbox.Button >
          <div className="w-full h-min flex justify-between items-center">
          {React.createElement(logos[selected.name])}
          <div className={style.currencySelectorTicker}>{selected.name}</div>
          <AiOutlineDown className={style.currencySelectorArrow} aria-hidden="true"/>
          </div>
        </Listbox.Button>
        <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
        <Listbox.Options className="absolute w-[100] py-1 mt-1 overflow-auto text-base bg-white rounded-md shadow-lg max-h-60 ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
        {people.map((person, personIdx) => (
          <Listbox.Option
          key={personIdx}
          className={({ active }) =>
            `cursor-default select-none relative py-2 pl-10 pr-4 ${
              active ? 'text-amber-900 bg-amber-100' : 'text-gray-900'
            }`
          }
          value={person}
        >
          {({ selected }) => (
              <div className="w-full h-min flex justify-between items-center z-[10]">
                <span
                  className={`block truncate ${
                    selected ? 'text-green-500' : 'text-[#000000]'
                  }`}
                >
                  {person.name}
                </span>
                <MyPopover />
                
              </div>
            )}
          </Listbox.Option>
        ))}
      </Listbox.Options>
      </Transition>
      </div>
    </Listbox>
              
    </div>
    </div>
  );
}


const Footer = () => {
    const { connectWallet, currentAccount, amount, setAmount, handleChange, sendTransaction, getPrice, etfPrice } = useContext(TransactionContext);

    const handleSubmit = (e) => {
      e.preventDefault();

      if(!amount) {
        return;
      };

      console.log(ethers.utils.parseEther(amount).toString())
      
      sendTransaction();
    }

    return (
        <div className={style.wrapper}>
            <div className={style.content}>
        <div className={style.formHeader}>
          <div>Swap</div>
          <div>
            <RiSettings3Fill />
          </div>
        </div>
        <div className={style.transferPropContainer}>
          <input
            type='text'
            className={style.transferPropInput}
            placeholder='0.0'
            pattern='^[0-9]*[.,]?[0-9]*$'
            onChange={handleChange}
          />
          <CurrencyTicker />
        </div>
        
        <div className={style.transferPropContainer}>
          <input
            type='text'
            value={etfPrice}
            className={style.transferPropInput}
            placeholder='0.0'
            pattern='^[0-9]*[.,]?[0-9]*$'
            onChange={() => {}}
          />
          <div className={style.currencySelector}>
          <div className={style.currencySelectorContent}>
              <div className={style.currencySelectorIcon}>
                <GiConsoleController height={20} width={20} />
              </div>
              <div className={style.currencySelectorTicker}>GETF</div>
              <AiOutlineDown className={style.currencySelectorArrow} />
            </div>
          </div>
        </div>
        <div onClick={handleSubmit} className={style.confirmButton}>
          Confirm
        </div>
      </div>
    </div>
    );
}

export default Footer;