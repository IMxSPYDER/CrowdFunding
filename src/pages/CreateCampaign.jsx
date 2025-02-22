import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ethers } from 'ethers';
import CrowdFundingABI from '../constants/abi.json'; // Import your ABI here
import { money } from '../assets';
import { CustomButton, FormField, Loader } from '../components';
import { checkIfImage } from '../utils';

const CreateCampaign = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState({
    name: '',
    title: '',
    description: '',
    target: '',
    deadline: '',
    image: '',
    state: '',  // New field
    region: ''  // New field
  });

  const handleFormFieldChange = (fieldName, e) => {
    setForm({ ...form, [fieldName]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    checkIfImage(form.image, async (exists) => {
      if (exists) {
        setIsLoading(true);
        try {
          // Connect to MetaMask
          if (window.ethereum) {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
          
            // Prompt MetaMask connection if necessary
            await window.ethereum.request({ method: 'eth_requestAccounts' });
            
            const signer = provider.getSigner();
          
            // Contract details
            const contractAddress = '0x11890F0464fD0f80fce67C27125bd20b7c6bC5e9';
            const contract = new ethers.Contract(contractAddress, CrowdFundingABI, signer);

            // Convert target to wei
            const targetInWei = ethers.utils.parseUnits(form.target, 'ether');

            // Create campaign transaction
            const tx = await contract.createCampaign(
              await signer.getAddress(),
              form.title,
              form.description,
              targetInWei,
              Math.floor(new Date(form.deadline).getTime() / 1000), // Convert deadline to timestamp
              form.image,
              form.state, // Include state
              form.region, // Include region
              { gasLimit: ethers.utils.hexlify(1000000) },

            );

            // Wait for transaction confirmation
            await tx.wait();

            alert('Campaign created successfully!');
            navigate('/');
          } else {
            alert('Please install MetaMask!');
          }
        } catch (error) {
          console.error(error);
          alert('Transaction failed! Please try again.');
        } finally {
          setIsLoading(false);
        }
      } else {
        alert('Provide a valid image URL');
        setForm({ ...form, image: '' });
      }
    });
  };

  return (
    <div className="bg-[#d4d4d4] flex justify-center items-center flex-col rounded-[10px] sm:p-10 p-4">
      {isLoading && <Loader />}
      <div className="flex justify-center items-center p-[16px] sm:min-w-[380px] bg-[#838385] rounded-[10px]">
        <h1 className="font-epilogue font-bold sm:text-[25px] text-[18px] leading-[38px] text-white">Start a Campaign</h1>
      </div>

      <form onSubmit={handleSubmit} className="w-full mt-[65px] flex flex-col gap-[30px]">
        <div className="flex flex-wrap gap-[40px]">
          <FormField 
            labelName="Your Name *"
            placeholder="John Doe"
            inputType="text"
            value={form.name}
            handleChange={(e) => handleFormFieldChange('name', e)}
          />
          <FormField 
            labelName="Campaign Title *"
            placeholder="Write a title"
            inputType="text"
            value={form.title}
            handleChange={(e) => handleFormFieldChange('title', e)}
          />
        </div>

        <FormField 
          labelName="Story *"
          placeholder="Write your story"
          isTextArea
          value={form.description}
          handleChange={(e) => handleFormFieldChange('description', e)}
        />

        <div className="w-full flex justify-start items-center p-4 bg-[#6d93fd] h-[120px] rounded-[10px]">
          <img src={money} alt="money" className="w-[40px] h-[40px] object-contain"/>
          <h4 className="font-epilogue font-bold text-[25px] text-white ml-[20px]">You will get 100% of the raised amount</h4>
        </div>

        <div className="flex flex-wrap gap-[40px]">
          <FormField 
            labelName="Goal *"
            placeholder="ETH 0.50"
            inputType="text"
            value={form.target}
            handleChange={(e) => handleFormFieldChange('target', e)}
          />
          <FormField 
            labelName="End Date *"
            placeholder="End Date"
            inputType="date"
            value={form.deadline}
            handleChange={(e) => handleFormFieldChange('deadline', e)}
          />
        </div>

        <div className="flex flex-wrap gap-[40px]">
          <FormField 
            labelName="State *"
            placeholder="Enter State"
            inputType="text"
            value={form.state}
            handleChange={(e) => handleFormFieldChange('state', e)}
          />
          <FormField 
            labelName="Region *"
            placeholder="Enter Region"
            inputType="text"
            value={form.region}
            handleChange={(e) => handleFormFieldChange('region', e)}
          />
        </div>

        <FormField 
          labelName="Campaign image *"
          placeholder="Place image URL of your campaign"
          inputType="url"
          value={form.image}
          handleChange={(e) => handleFormFieldChange('image', e)}
        />

        <div className="flex justify-center items-center mt-[40px]">
          <CustomButton 
            btnType="submit"
            title="Submit new campaign"
            styles="bg-blue-400"
          />
        </div>
      </form>
    </div>
  );
};

export default CreateCampaign;
