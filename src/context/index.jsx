import React, { useContext, createContext } from 'react';
import { ethers } from 'ethers';
import abi from '../constants/abi.json';
const StateContext = createContext();

export const StateContextProvider = ({ children }) => {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  const contractAddress = '0x11890F0464fD0f80fce67C27125bd20b7c6bC5e9';

  const contract = new ethers.Contract(contractAddress, abi, signer);

  const address = signer.getAddress();

  const connect = async () => {
    try {
      await provider.send('eth_requestAccounts', []);
    } catch (error) {
      console.error('Error connecting to Metamask:', error);
    }
  };

  const publishCampaign = async (form) => {
    try {
      // Ensure form.target is a string
      const targetInWei = ethers.utils.parseUnits(form.target.toString(), 18);
  
      const data = await createCampaign({
        args: [
          address, // owner
          form.title, // title
          form.description, // descriptione
          targetInWei, // target converted to Wei
          new Date(form.deadline).getTime(), // deadline
          form.image, // image URL
          form.state,
          form.region,
        ],
      });
  
      console.log("contract call success", data);
    } catch (error) {
      console.error("contract call failure", error);
    }
  };
  
  const getCampaigns = async () => {
    const campaigns = await contract.getCampaigns();
    console.log(campaigns)
    const parsedCampaigns = campaigns.map((campaign, i) => ({
      owner: campaign.owner,
      title: campaign.title,
      description: campaign.description,
      target: ethers.utils.formatEther(campaign.target.toString()),
      deadline: campaign.deadline.toNumber(),
      amountCollected: ethers.utils.formatEther(campaign.amountCollected.toString()),
      image: campaign.image,
      stateName : campaign.state,
      regionName: campaign.region,
      pId: i
    }));
    return parsedCampaigns;
  };

  const getUserCampaigns = async () => {
    try {
        console.log("Fetching campaigns...");

        // Fetch campaigns from the smart contract
        const allCampaigns = await getCampaigns();
        console.log("All Campaigns:", allCampaigns);

        // Ensure we received an array
        if (!Array.isArray(allCampaigns)) {
            console.error("getCampaigns() did not return an array", allCampaigns);
            return [];
        }

        // Check if address is defined
        console.log("User Address:", address);
        if (!address) {
            console.error("User address is undefined");
            return [];
        }

        // Filter campaigns by owner (using lowercase for address comparison)
        const filteredCampaigns = allCampaigns.filter(
            (campaign) => campaign.owner === address
        );
        console.log("Filtered Campaigns:", filteredCampaigns);

        return filteredCampaigns;
    } catch (error) {
        console.error("Error fetching campaigns:", error);
        return [];
    }
};


  const donate = async (pId, amount) => {
    try {
      const transaction = await contract.donateToCampaign(pId, {
        value: ethers.utils.parseEther(amount)
      });
      await transaction.wait();
      console.log('Donation successful');
    } catch (error) {
      console.error('Donation failed:', error);
    }
  };

  const getDonations = async (pId) => {
    const donations = await contract.getDonators(pId);
    const numberOfDonations = donations[0].length;
    const parsedDonations = [];

    for (let i = 0; i < numberOfDonations; i++) {
      parsedDonations.push({
        donator: donations[0][i],
        donation: ethers.utils.formatEther(donations[1][i].toString())
      });
    }

    return parsedDonations;
  };

  return (
    <StateContext.Provider
      value={{
        address,
        contract,
        connect,
        publishCampaign,
        getCampaigns,
        getUserCampaigns,
        donate,
        getDonations,
      }}
    >
      {children}
    </StateContext.Provider>
  );
};

export const useStateContext = () => useContext(StateContext);
