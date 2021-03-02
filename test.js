const solanaWeb3 = require('@solana/web3.js');
var SystemProgram = solanaWeb3.SystemProgram;
var Transaction = solanaWeb3.Transaction;
var Account = solanaWeb3.Account;

const url = 'https://api.mainnet-beta.solana.com/';
const connection = new solanaWeb3.Connection(url);

const wallet = new solanaWeb3.Account(); // you'll have to pass as a parameter the array of numbers from keypair.json during wallet initialization
const destination = "6ZRCB7AAqGre6c72PRz3MHLC73VMYvJ8bi9KHf1HFpNk";
const amount = 0.0001;

async function signAndSendTransaction(connection,transaction,wallet,signers,skipPreflight = false,) {
  transaction.recentBlockhash = (
    await connection.getRecentBlockhash('max')
  ).blockhash;

  transaction.partialSign(wallet);
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
  tx.feePayer = wallet.publicKey;
  var res = await signAndSendTransaction(connection, tx, wallet, []);
  console.log(res); //print tx hash
}

nativeTransfer(connection, wallet, destination, amount);
