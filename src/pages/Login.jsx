import React, { useEffect, useState } from "react";
import { magic, provider } from "./magic";

const Login = ({ onLogin }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const handleOAuthRedirect = async () => {
      if (window.location.search.includes("magic_credential")) {
        try {
          const result = await magic.oauth.getRedirectResult();
          if (result) {
            const { email } = result.userInfo;
            setUser({ email });
            onLogin(email);
          }
        } catch (error) {
          console.error("OAuth Redirect Error:", error);
        }
      }
    };
  
    handleOAuthRedirect();
  }, [onLogin]);
  

  const handleGoogleLogin = async () => {
    try {
      await magic.oauth.loginWithRedirect({
        provider: "google",
        redirectURI: window.location.origin, // Ensures the user is redirected back
      });
    } catch (error) {
      console.error("Login error:", error);
    }
  };
  
  return (
    <div>
      {!user ? (
        <button onClick={handleGoogleLogin}>Login with Google</button>
      ) : (
        <div>
          <p>Logged in as: {user.email}</p>
          <p>Wallet Address: {user.address}</p>
        </div>
      )}
    </div>
  );
};

export default Login;
