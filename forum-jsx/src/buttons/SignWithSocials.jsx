import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  FacebookAuthProvider,
} from "firebase/auth";
import { app } from "../config/firebase-config";
import React from "react";
import googleLogo from "../assets/google.png";
import facebookLogo from "../assets/facebook.png";

const auth = getAuth(app);

function Socials() {
  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      alert("Error signing in with Google: " + (error?.message || error));
    }
  };

  const handleFacebookLogin = async () => {
    const provider = new FacebookAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      alert("Error signing in with Facebook: " + (error?.message || error));
    }
  };

  return (
    <div className="flex flex-col gap-3 mt-2">
      <button
        onClick={handleGoogleLogin}
        className="bg-gray-300 py-2 px-4 rounded flex items-center justify-center cursor-pointer"
      >
        <img src={googleLogo} alt="Google" className="inline w-5 mr-2" />
        Sign in with Google
      </button>
      <button
        onClick={handleFacebookLogin}
        className="bg-white py-2 px-4 rounded flex items-center justify-center cursor-pointer
        "
      >
        <img src={facebookLogo} alt="Facebook" className="inline w-5 mr-2" />
        Sign in with Facebook
      </button>
    </div>
  );
}

export default Socials;
