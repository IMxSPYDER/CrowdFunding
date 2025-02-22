import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useStateContext } from '../context';
import { CountBox, CustomButton, Loader } from '../components';
import { calculateBarPercentage, daysLeft } from '../utils';
import { thirdweb } from '../assets';

const CampaignDetails = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { donate, getDonations, contract, address } = useStateContext();

  const [isLoading, setIsLoading] = useState(false);
  const [amount, setAmount] = useState('');
  const [donators, setDonators] = useState([]);
  const [targetInInr, setTargetInInr] = useState(null);
  const [collectedInInr, setCollectedInInr] = useState(null);

  const remainingDays = daysLeft(state.deadline);

  async function getInrValue(ethAmount) {
    try {
      const apiUrl = `https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=inr`;
      const response = await fetch(apiUrl);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      if (!data.ethereum || !data.ethereum.inr) {
        throw new Error("Invalid API response.");
      }
      return ethAmount * data.ethereum.inr;
    } catch (error) {
      console.error("Error getting INR value:", error);
      return null;
    }
  }

  useEffect(() => {
    getInrValue(state.target).then(setTargetInInr);
    getInrValue(state.amountCollected).then(setCollectedInInr);
  }, [state.target, state.amountCollected]);

  const fetchDonators = async () => {
    try {
      if (!contract || !address) return;
      const data = await getDonations(state.pId);
      setDonators(data);
    } catch (error) {
      console.error('Error fetching donators:', error);
    }
  };

  useEffect(() => {
    if (contract) {
      fetchDonators();
    }
  }, [contract, address]);

  const handleDonate = async () => {
    if (!amount || isNaN(amount) || parseFloat(amount) <= 0) {
      alert('Please enter a valid donation amount.');
      return;
    }

    setIsLoading(true);
    try {
      await donate(state.pId, amount);
      setAmount('');
      fetchDonators();
      navigate('/');
    } catch (error) {
      console.error('Donation failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      {isLoading && <Loader />}

      <div className="w-full flex md:flex-row flex-col mt-10 gap-[30px]">
        <div className="flex-1 flex-col">
          <img src={state.image} alt="campaign" className="w-full h-[410px] object-cover rounded-xl" />
          <div className="relative w-full h-[5px] bg-[#808083] mt-2">
            <div
              className="absolute h-full bg-blue-400"
              style={{
                width: `${calculateBarPercentage(state.target, state.amountCollected)}%`,
                maxWidth: '100%',
              }}
            ></div>
          </div>
        </div>

        <div className="flex md:w-[150px] w-full flex-wrap justify-between gap-[30px]">
          <CountBox title="Days Left" value={remainingDays} />
          <CountBox title={`Target of ${state.target} ETH`} value={state.amountCollected} />
          <CountBox title="Total Backers" value={donators.length} />
          
        </div>
      </div>
      <div className="mt-[60px] flex lg:flex-row flex-col gap-5">
        <div className="flex-[2] flex flex-col gap-[40px]">
          {/* Campaign Creator Section */}
          <div className='flex-col gap-[40px]'>
            <h4 className="font-epilogue text-[18px] font-bold text-black uppercase">
              {state.title}
            </h4>

            <div className="mt-[20px] flex flex-row items-center flex-wrap gap-[14px]">
              <div className="w-[52px] h-[52px] flex items-center justify-center rounded-full bg-[#2c2f32] cursor-pointer">
                <img src={thirdweb} alt="user" className="w-[60%] h-[60%] object-contain" />
              </div>
              <div>
                <h4 className="font-epilogue font-semibold text-[14px] text-black break-all">
                  {state.owner}
                </h4>
                <p className="mt-[4px] font-epilogue font-bold text-[12px] text-[#3d3d3d]">
                  10 Campaigns
                </p>
                {/* Display State and Region */}
                <p className="mt-[4px] font-epilogue font-bold text-[12px] text-[#3d3d3d]">
                  📍 {state.stateName}, {state.regionName}
                </p>
              </div>
            </div>
          </div>
          <div>
          {targetInInr && collectedInInr && (
            <CountBox
              title={`Target of ₹${targetInInr.toLocaleString()}`}
              value={`₹${collectedInInr.toLocaleString()}`}
            />
          )}
          </div>

          {/* Campaign Story */}
          <div>
            <h4 className="font-epilogue font-bold text-[18px] text-black uppercase">
              Description
            </h4>
            <div className="mt-[20px]">
              <p className="font-epilogue font-normal text-[16px] text-[#3d3d3d] leading-[26px] text-justify">
                {state.description}
              </p>
            </div>
          </div>

          {/* List of Donators */}
          <div>
            <h4 className="font-epilogue font-semibold text-[18px] text-black uppercase">
              Donators
            </h4>
            <div className="mt-[20px] flex flex-col gap-4">
              {donators.length > 0 ? (
                donators.map((item, index) => (
                  <div
                    key={`${item.donator}-${index}`}
                    className="flex justify-between items-center gap-4"
                  >
                    <p className="font-epilogue font-normal text-[16px] text-[#3d3d3d] leading-[26px] break-all">
                      {index + 1}. {item.donator}
                    </p>
                    <p className="font-epilogue font-normal text-[16px] text-[#3d3d3d] leading-[26px] break-all">
                      {item.donation} ETH
                    </p>
                  </div>
                ))
              ) : (
                <p className="font-epilogue font-normal text-[16px] text-[#5a5a5a] leading-[26px] text-justify">
                  No donators yet. Be the first one!
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Fund Campaign Section */}
        <div className="flex-1">
          <h4 className="font-epilogue font-bold text-[18px] text-black uppercase">Fund</h4>
          <div className="mt-[20px]  flex flex-col p-4 bg-[#d4d4d4] rounded-[10px]">
            <p className="font-epilogue font-semibold text-[20px] leading-[30px] text-center text-[#272727]">
              Fund the campaign
            </p>
            <div className="mt-[30px]">
              <input
                type="number"
                placeholder="ETH 0.1"
                step="0.01"
                className="w-full py-[10px] px-[15px] border-[1px] border-[#3a3a43] bg-transparent text-black text-[18px] rounded-[10px]"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
              <CustomButton title="Fund Campaign" styles="w-full mt-5 bg-blue-400 font-bold" handleClick={handleDonate} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CampaignDetails;
