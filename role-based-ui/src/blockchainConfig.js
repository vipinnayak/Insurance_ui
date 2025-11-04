import { ethers } from "ethers";
import contractABI from "./InsuranceABI.json"; // ABI file next step me add karenge

// ⚙️ Contract details (apne Remix se)
const contractAddress = "0x94F80AA9dB850E50F990Fbc324C1d5A4340A619B"; // <-- Replace with your real contract address

// ✅ Blockchain connect function
export async function getContract() {
  if (!window.ethereum) {
    alert("MetaMask not found! Please install MetaMask.");
    return null;
  }

  // MetaMask connect
  await window.ethereum.request({ method: "eth_requestAccounts" });

  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();

  const contract = new ethers.Contract(contractAddress, contractABI, signer);
  return contract;
}
