import type { NextPage } from 'next';
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Welcome from "../components/Welcome";


const Home: NextPage = () => {
  return (
    <div className="min-h-screen bg-[#ebf0f7]">
      <div className="gradient-bg-welcome">
        <Navbar />
        <Welcome />
      </div>
      
      <Footer />
    </div>
  )
}

export default Home
