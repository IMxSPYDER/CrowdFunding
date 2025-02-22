import { useState, useEffect } from "react";
import { Web3Auth } from "@web3auth/web3auth";  // ✅ Use web3auth/web3auth (NOT modal)
import { OpenloginAdapter } from "@web3auth/openlogin-adapter";
import { ethers } from "ethers";
import Login from "./Login";


const Google_login = () => {


  return (
    <Login/>
  );
};

export default Google_login;
