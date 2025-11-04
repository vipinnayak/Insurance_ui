const functions = require("firebase-functions");
const admin = require("firebase-admin");
const { ethers } = require("ethers");
const ClaimsABI = require("./ClaimsRegistryABI.json");

admin.initializeApp();
const db = admin.firestore();

const RPC_URL = functions.config().blockchain.rpc;
const PRIVATE_KEY = functions.config().blockchain.private_key;
const CONTRACT_ADDRESS = functions.config().blockchain.contract_address;

const provider = new ethers.providers.JsonRpcProvider(RPC_URL);
const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
const contract = new ethers.Contract(CONTRACT_ADDRESS, ClaimsABI, wallet);

function canonicalPayload(claim) {
  const parts = [
    claim.policyNo || "",
    claim.policyName || "",
    claim.customerEmail || "",
    String(claim.amountRequested || ""),
    String(claim.createdAt || "")
  ];
  return parts.join("|");
}

exports.onClaimCreated = functions.firestore
  .document("claims/{claimId}")
  .onCreate(async (snap, context) => {
    const claim = snap.data();
    const docId = context.params.claimId;

    try {
      const payloadString = canonicalPayload(claim);
      const hash = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(payloadString));

      const tx = await contract.storeRecord(docId, hash, { gasLimit: 300000 });
      const receipt = await tx.wait();

      let onChainId = null;
      const evt = receipt.events?.find(e => e.event === "RecordStored");
      if (evt && evt.args) onChainId = evt.args.recordId?.toString();

      await snap.ref.update({
        onChainTx: receipt.transactionHash,
        onChainId,
        onChainHash: hash,
        onChainTimestamp: admin.firestore.FieldValue.serverTimestamp(),
      });

      console.log("✅ Claim added to blockchain:", docId);
      return null;
    } catch (err) {
      console.error("❌ Error adding claim:", err);
      await snap.ref.update({ onChainError: String(err.message || err) });
      return null;
    }
  });
