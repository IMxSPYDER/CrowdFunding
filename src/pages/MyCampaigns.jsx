import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import CrowdFundingABI from '../constants/abi.json'; // Ensure ABI file is correctly placed

const CONTRACT_ADDRESS = "0x11890F0464fD0f80fce67C27125bd20b7c6bC5e9";

const MyCampaigns = ({ provider, userAddress }) => {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (provider && userAddress) {
      fetchUserCampaigns();
    }
  }, [provider, userAddress]);

  const fetchUserCampaigns = async () => {
    try {
      const signer = provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CrowdFundingABI, signer);

      const userCampaigns = await contract.getCampaignsByOwner(userAddress);

      // Format campaigns for display
      const formattedCampaigns = userCampaigns.map((campaign, index) => ({
        id: index,
        title: campaign.title,
        description: campaign.description,
        target: ethers.utils.formatEther(campaign.target),
        amountCollected: ethers.utils.formatEther(campaign.amountCollected),
        deadline: new Date(Number(campaign.deadline) * 1000).toLocaleDateString(),
        image: campaign.image,
      }));

      setCampaigns(formattedCampaigns);
    } catch (error) {
      console.error("Error fetching campaigns:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">My Campaigns</h2>
      {loading ? (
        <p>Loading campaigns...</p>
      ) : campaigns.length === 0 ? (
        <p>No campaigns found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {campaigns.map((campaign) => (
            <div key={campaign.id} className="border p-4 rounded-lg shadow-md">
              <img src={campaign.image} alt={campaign.title} className="w-full h-40 object-cover rounded-md" />
              <h3 className="text-lg font-semibold mt-2">{campaign.title}</h3>
              <p className="text-sm text-gray-600">{campaign.description}</p>
              <p className="mt-2">
                <strong>Target:</strong> {campaign.target} ETH
              </p>
              <p>
                <strong>Raised:</strong> {campaign.amountCollected} ETH
              </p>
              <p>
                <strong>Deadline:</strong> {campaign.deadline}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyCampaigns;
