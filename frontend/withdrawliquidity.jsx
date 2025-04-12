import React, { useState} from 'react';
import {ethers} from 'ethers';
import PoolContract from './Pool.json'

const WithdrawLiquidity = ({ signer, contractAddress }) => {
    const [amount, setAmount] = useState('');
    const [txStatus, setTxStatus] = useState('');

    const handleWithdeaw = async () => {
        setTxStatus('Processing ...');
        try{
            const poolContract = new ethers.Contract(contractAddress, PoolContract.abi, signer);
            const tx = await poolContract.withdrawLiquidity(ethers.utils.parseEther(amount));
            await tx.wait();
            setTxStatus('Transaction successful!');
        } catch (error) {
            console.error('Error:', error);
            setTxStatus('Transaction failed. Please try again.');
        }
};
    return (
        <div>
            <h2>Withdraw Liquidity</h2>
            <input
                type="text"
                placeholder="Amount to withdraw"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
            />
            <button onClick={handleWithdeaw}>Withdraw</button>
            {txStatus && <p>Transaction Hash: {txStatus}</p>}
        </div>
    );
};

export default WithdrawLiquidity;