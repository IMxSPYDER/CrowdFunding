import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import { CountBox, Loader } from "../components";
import { Link } from "react-router-dom";
import contractABI from "../constants/abi.json"; // Ensure ABI is correct
const contractAddress = "0x11890F0464fD0f80fce67C27125bd20b7c6bC5e9"; // Replace with your deployed contract address

const UserProfile = ({ userAddress }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [campaigns, setCampaigns] = useState([]);
  const [account, setAccount] = useState(null);

  // Function to connect wallet and prompt account selection
  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({
          method: 'wallet_requestPermissions',
          params: [{ eth_accounts: {} }]
        }).then(() =>
          window.ethereum.request({ method: 'eth_accounts' })
        );
        setAccount(accounts[0]);
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

  // Fetch user campaigns from the smart contract
  useEffect(() => {
    const fetchUserCampaigns = async () => {
      if (!window.ethereum || !account) return;
      setIsLoading(true);

      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(contractAddress, contractABI, signer);

        // Fetch campaigns owned by the user
        const userCampaigns = await contract.getCampaignsByOwner(account);

        if (!Array.isArray(userCampaigns)) {
          console.error("Invalid response, expected array:", userCampaigns);
          setCampaigns([]);
          setIsLoading(false);
          return;
        }

        console.log("User Campaigns:", userCampaigns); // Debugging log

        // Transform campaign data into a structured format
        const formattedCampaigns = userCampaigns.map((campaign) => ({
          owner: campaign.owner,
          title: campaign.title,
          description: campaign.description,
          target: ethers.utils.formatEther(campaign.target || "0"),
          amountCollected: ethers.utils.formatEther(campaign.amountCollected || "0"),
          deadline: campaign.deadline ? campaign.deadline.toNumber() : 0,
          state: campaign.state || "",
          region: campaign.region || "",
          image: campaign.image || "https://via.placeholder.com/150", // Default image
        }));

        setCampaigns(formattedCampaigns);
      } catch (error) {
        console.error("Error fetching user campaigns:", error);
      }
      setIsLoading(false);
    };

    if (account) {
      fetchUserCampaigns();
    }
  }, [account]);

  return (
    <div>
      <h1 className="text-2xl font-bold text-black">Your Profile</h1>

      {isLoading && <Loader />}

      <div className="bg-[#1c1c24] p-6 mt-5 rounded-lg">
        <h2 className="text-xl font-semibold text-white">
          👤 Wallet Address: <span className="text-gray-400 break-all">{account}</span>
        </h2>
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-semibold text-black">📢 Your Campaigns:</h2>

        {campaigns.length === 0 ? (
          <p className="text-gray-400 mt-4">You haven't created any campaigns yet.</p>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
            {campaigns.map((campaign, index) => (
              <div key={index} className="bg-[#cccccc] p-4 rounded-lg">
                <img
                  src={campaign.image}
                  alt={campaign.title}
                  className="w-full h-40 object-cover rounded-lg"
                />
                <h3 className="text-black text-lg font-semibold mt-3">{campaign.title}</h3>
                <p className="text-gray-800 text-sm mt-2">
                  {campaign.description?.slice(0, 100)}...
                </p>
                <div className="flex justify-between mt-3">
                  <CountBox title="Raised" value={`${campaign.amountCollected || 0} ETH`} />
                  {/* <CountBox title="Goal" value={`${campaign.target || 0} ETH`} /> */}
                  <CountBox
                    title="Days Left"
                    value={
                      campaign.deadline > 0
                        ? Math.max(
                            0,
                            Math.floor((campaign.deadline * 1000 - Date.now()) / (1000 * 60 * 60 * 24))
                          )
                        : "N/A"
                    }
                  />
                </div>
                <Link to={`/campaign-details/${campaign.title}`} className="block mt-3 font-bold text-blue-400">
                  View Details →
                </Link>
                <div className="p-4 cursor-pointer bg-blue-400 font-bold text-center text-white" onClick={() => alert(`${campaign.amountCollected} ETH Amount credited`)}>
                  Get Payment
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
