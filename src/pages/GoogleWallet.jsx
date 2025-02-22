import React, { useState, useEffect } from "react";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { initializeApp } from "firebase/app";
import { ethers } from "ethers";

// 🔹 Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyDVyBifwOhyJP7vyEbSG1kFn19omCnOi_U",
    authDomain: "crowdfunding-ee178.firebaseapp.com",
    projectId: "crowdfunding-ee178",
    storageBucket: "crowdfunding-ee178.firebasestorage.app",
    messagingSenderId: "669756785159",
    appId: "1:669756785159:web:0e8fb1a3ec60992016a0a2",
    measurementId: "G-0SXM4WEX1P"
};

// 🔹 Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

const GoogleWallet = () => {
  const [walletAddress, setWalletAddress] = useState("");

  const loginWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // ✅ Generate a deterministic private key from UID
      const privateKey = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(user.uid));
      const wallet = new ethers.Wallet(privateKey);

      setWalletAddress(wallet.address);
      console.log("Google Wallet Address:", wallet.address);

      // 🔹 Automatically connect MetaMask after Google login
      await connectWallet();
    } catch (error) {
      console.error("Login failed", error);
    }
  };

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
        setWalletAddress(accounts[0]); // Update state with MetaMask wallet
        console.log("Connected MetaMask Address:", accounts[0]);
      } catch (error) {
        console.error("MetaMask connection failed", error);
      }
    } else {
      alert("Please install MetaMask!");
    }
    window.location.reload();
    loginWithGoogle();
  };

  return (
    <div>
      <button onClick={loginWithGoogle}>Login with Google</button>
      {walletAddress && <p>Wallet Address: {walletAddress}</p>}
    </div>
  );
};

export default GoogleWallet;
