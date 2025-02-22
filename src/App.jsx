import React, { useEffect, useState } from 'react';
import { Route, Routes } from 'react-router-dom';

import { Sidebar, Navbar } from './components';
import { CampaignDetails, CreateCampaign, Home, Profile } from './pages';
import Google_login from './pages/Google_login';
import DisasterCheckForm from './pages/DisasterCheckForm';
import logo from './assets/logo11.jpg';

const App = () => {

  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 3000); // Auto-hide after 3 seconds
    return () => clearTimeout(timer);
  }, []);

  const startApp = () => {
    setShowSplash(false);
  };


  const [account, setAccount] = useState(null);

   // Function to connect wallet and prompt account selection
   const connectWallet = async () => {
    if (window.ethereum) {
      try {
        // Request account permissions to force MetaMask to show account selection
        const accounts = await window.ethereum.request({
          method: 'wallet_requestPermissions',
          params: [{ eth_accounts: {} }]
        }).then(() =>
          window.ethereum.request({ method: 'eth_accounts' })
        );
        setAccount(accounts[0]); // Set to the first selected account
      } catch (error) {
        console.error("Error connecting to MetaMask", error);
      }
    } else {
      alert('MetaMask not detected. Please install it.');
    }
  };

  // Check if a wallet is already connected on load
  useEffect(() => {
    const checkIfWalletIsConnected = async () => {
      if (window.ethereum) {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        if (accounts.length > 0) {
          setAccount(accounts[0]);
        }
      }
    };
    checkIfWalletIsConnected();
  }, []);

  return (
    <div className="relative sm:-8 p-4 bg-[#e2e2e2] min-h-screen flex flex-row">
    {showSplash ? (
        <div
          className="fixed inset-0 flex flex-col items-center justify-center bg-white animate-slideUp"
        >
          <img src={logo} alt="Logo" className="w-[500px] h-[500px]" />
          <button
            onClick={startApp}
            className="mt-5 px-6 py-3 bg-orange-500 text-white text-lg font-semibold rounded-md hover:bg-orange-600 transition"
          >
            Start ->
          </button>
        </div>
      ) : (
        <>
        <div className="sm:flex hidden mr-10 relative">
        <Sidebar />
      </div>

      <div className="flex-1 max-sm:w-full max-w-[1280px] mx-auto sm:pr-5">
        <Navbar account={account} connectWallet={connectWallet}/>
        {/* <Google_login /> */}

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/create-campaign" element={<CreateCampaign />} />
          <Route path='/your-location' element={<DisasterCheckForm/>}/>
          <Route path="/campaign-details/:id" element={<CampaignDetails />} />
        </Routes>
      </div>
        </>
      )}
      
    </div>
  )
}

export default App