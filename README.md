# **🌍 SevaChain - Blockchain-Powered Financial Emergency Relief & Real-Time Response System**

SevaChain is a decentralized crowdfunding platform built on Ethereum, leveraging smart contracts to automate and secure fund disbursement. It enhances transparency, prevents fraudulent activities, and ensures that donations reach the right beneficiaries through real-time tracking and decentralized identity verification.

----

# **🏆 Problem Statement**
In India, fraudulent charities exploit donors, leading to fund misuse and lack of trust in aid systems. SevaChain addresses this by using blockchain to automate fund disbursement, track transactions in real-time, and verify donors and beneficiaries using Decentralized Identity (DID).

-----

# **💡 Key Features**
- ✔️ Smart Contract-Based Fund Disbursement – Automates immediate aid transfers, preventing delays.
- ✔️ Real-Time Tracking – Immutable audit trails enhance transparency and donor confidence.
- ✔️ Automated Geolocation Verification – Ensures authenticity of beneficiaries through real-time GPS tracking.
- ✔️ Decentralized Identity (DID) & Zero-Knowledge Proofs (ZKP) – Prevents identity spoofing and duplicate donor registrations.
- ✔️ Multi-Factor Fraud Prevention – Verifies aid requests with real-time weather data, ensuring legitimacy.

-----

# **📜 Smart Contract Overview**

## 🔹 1. createCampaign
Creates a new crowdfunding campaign.

```solidity

function createCampaign(
    address _owner, 
    string memory _title, 
    string memory _description, 
    uint256 _target, 
    uint256 _deadline, 
    string memory _image, 
    string memory _state, 
    string memory _region
) public returns (uint256)
```
📌 Ensures deadline is in the future.
📊 Returns: Campaign ID.

## 🔹 2. donateToCampaign
Allows users to donate ETH to a campaign.

```solidity
function donateToCampaign(uint256 _id) public payable
```
📌 Transfers ETH to the campaign owner securely.

## 🔹 3. getDonators
Retrieves the list of donors and their donation amounts.

```solidity
function getDonators(uint256 _id) view public returns (address[] memory, uint256[] memory)
```
📊 Returns: Donor addresses and donation amounts.

## 🔹 4. getCampaigns
Fetches all active campaigns.

```solidity
function getCampaigns() public view returns (Campaign[] memory)
```

## 🔹 5. getCampaignsByOwner
Filters campaigns by owner address.

```solidity
function getCampaignsByOwner(address _owner) public view returns (Campaign[] memory)
```
📊 Returns: An array of campaigns created by a specific owner.

-----


# **🏗 Tech Stack**
- Blockchain: Solidity, Ethereum
- Smart Contract Deployment: Redmix IDE
- Frontend: React.js, Web3.js
- Database: IPFS for decentralized storage
- Identity Verification: Decentralized Identity (DID) & Zero-Knowledge Proofs (ZKP)
- Security: Multi-Factor Authentication (MFA), Weather-based validation

-----

# **🎯 Target Market**
- Government Relief Funds (PMNRF, CMRF)
- Charity Platforms & NGOs
- Crypto Donors & Web3 Philanthropists
- General Public Seeking Transparent Donations

------

![image](https://github.com/user-attachments/assets/29155a81-4a5c-49f2-a6a6-fc2f34c33721)
![image](https://github.com/user-attachments/assets/d004b147-6fbe-47e5-8396-c2516bfc623d)
![image](https://github.com/user-attachments/assets/01ba8d8b-a59e-498f-9723-98f9f1241298)
![image](https://github.com/user-attachments/assets/84600c37-3dfd-4527-890f-0f8337cd1de1)
![image](https://github.com/user-attachments/assets/6f5f8ebd-e67f-44e9-8360-3c4aa1725636)



