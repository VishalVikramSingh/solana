const solanaWeb3 = require('@solana/web3.js');
var PublicKey = solanaWeb3.PublicKey;
var SystemProgram = solanaWeb3.SystemProgram;
var Transaction = solanaWeb3.Transaction;
var Account = solanaWeb3.Account;
var TransactionInstruction = solanaWeb3.TransactionInstruction;


let url;
url = 'https://api.mainnet-beta.solana.com/';
const connection = new solanaWeb3.Connection(url);

const wallet = new solanaWeb3.Account(); // my array of numbers from keypair.json
const destination = "6gfi6GSjrhqc5xDLtDkVrTR61Hi7GMNPmJknxvbqzb1x";
const amount = 1000;

console.log(wallet)

async function signAndSendTransaction(connection,transaction,wallet,signers,skipPreflight = false,) {
  transaction.recentBlockhash = (
    await connection.getRecentBlockhash('max')
  ).blockhash;
  transaction.setSigners(
    // fee payed by the wallet owner
    wallet.publicKey,
    ...signers.map((s) => s.publicKey),
  );

  if (signers.length > 0) {
    transaction.partialSign(...signers);
  }

  transaction = await wallet.signTransaction(transaction);
  const rawTransaction = transaction.serialize();
  return await connection.sendRawTransaction(rawTransaction, {
    skipPreflight,
    preflightCommitment: 'single',
  });
}

async function nativeTransfer(connection, wallet, destination, amount) {
  const tx = new Transaction().add(
    SystemProgram.transfer({
      fromPubkey: wallet.publicKey,
      toPubkey: destination,
      lamports: amount,
    }),
  );
  return await signAndSendTransaction(connection, tx, wallet, []);
}

nativeTransfer(connection, wallet, destination, amount);
