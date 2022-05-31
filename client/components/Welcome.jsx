import {AiFillPlayCircle} from "react-icons/ai";
import {SiEthereum} from "react-icons/si";
import {BsInfoCircle} from "react-icons/bs";
import { TiTick } from "react-icons/ti";



const Welcome = () => {
    return (
        <div className="w-full flex justify-center items-center">
            <div className="flex md:flex-row flex-col items-start justify-between md:p-20 py-12 px-4">
                <div className="flex flex-1 justify-start flex-col md:mr-10">
                    <h1 className="text-3xl sm:text-5xl text-white text-gradient py-1">Invest in  <br /> Decentralized ETFs </h1> 
                    <div className="flex justify-left">
                    <TiTick className="mt-5"/>       
                    <p className="text-left mt-5 ml-2 text-white font-light md:w-9/12 w-11/12 text-base">
                    Invest in industry and not one risky token </p>
                    </div>
                    <div className="flex justify-left">
                    <TiTick className="mt-5"/>       
                    <p className="text-left mt-5 ml-2 text-white font-light md:w-9/12 w-11/12 text-base">
                    Easily diversify your investment </p>
                    </div>
                    <div className="flex justify-left">
                    <TiTick className="mt-5"/>       
                    <p className="text-left mt-5 ml-2 text-white font-light md:w-9/12 w-11/12 text-base">
                    Save on gas fees </p>
                    </div>
                    
                </div>
            </div>
        </div>
    );
}

export default Welcome;