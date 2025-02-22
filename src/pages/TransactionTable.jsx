import React, { useEffect, useState } from "react";
import axios from "axios";

const API_KEY = "sYGSc-m5-C4Je3YHYcFD0E80n7WC0NsW";
const ALCHEMY_URL = `https://opt-sepolia.g.alchemy.com/v2/${API_KEY}`;

const TransactionTable = () => {
    const [transactions, setTransactions] = useState([]);
    const [blacklistedUsers, setBlacklistedUsers] = useState(new Set());
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchTransactions();
    }, []);

    const fetchTransactions = async () => {
        try {
            const payload = {
                jsonrpc: "2.0",
                method: "alchemy_getTransactionReceipts",
                params: [{ blockNumber: "latest" }],
                id: 1
            };

            const response = await axios.post(ALCHEMY_URL, payload);
            const data = response.data?.result?.receipts || [];

            if (data.length === 0) {
                setLoading(false);
                return;
            }

            let newBlacklistedUsers = new Set();

            const analyzedTxs = data.map(tx => {
                const fraudFlag = detectFraud(tx, data);
                if (fraudFlag !== "No issues detected") {
                    newBlacklistedUsers.add(tx.from); // Flag user
                }
                return {
                    transactionHash: tx.transactionHash,
                    from: tx.from || "Unknown",
                    to: tx.to || "Unknown",
                    value: extractValue(tx),
                    fraudFlag
                };
            });

            setTransactions(analyzedTxs);
            setBlacklistedUsers(newBlacklistedUsers);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching transactions:", error);
            setLoading(false);
        }
    };

    const extractValue = (tx) => {
        let value = 0;
        tx.logs.forEach(log => {
            if (log.value) value = parseFloat(log.value);
        });
        return value;
    };

    const detectFraud = (tx, allTxs) => {
        if (tx.value > 5) return "High-Value Transaction";
        if (tx.from === tx.to) return "Self-Transfer Detected";

        const senderTxs = allTxs.filter(t => t.from === tx.from);
        if (senderTxs.length > 3) return "High-Frequency Withdrawals";

        return "No issues detected";
    };

    return (
        <div className="container">
            <h2>Latest Transactions</h2>
            {loading ? (
                <p>Loading transactions...</p>
            ) : (
                <table className="w-full min-w-max border border-gray-300 shadow-md overflow-x-auto">
    <thead className="bg-gray-200 text-xs md:text-sm">
        <tr>
            <th className="px-3 py-2">Tx Hash</th>
            <th className="px-3 py-2">From</th>
            <th className="px-3 py-2">To</th>
            <th className="px-3 py-2">Value</th>
            <th className="px-3 py-2">Fraud Flag</th>
            <th className="px-3 py-2">Action</th>
        </tr>
    </thead>
    <tbody className="text-xs md:text-sm">
        {transactions.map((tx, index) => (
            <tr key={index} className={`${tx.fraudFlag !== "No issues detected" ? "bg-red-500 text-white" : "bg-white"} border-b`}>
                <td className="px-3 py-2 truncate max-w-[150px]">{tx.transactionHash}</td>
                <td className="px-3 py-2 truncate">{tx.from}</td>
                <td className="px-3 py-2 truncate">{tx.to}</td>
                <td className="px-3 py-2">{tx.value}</td>
                <td className="px-3 py-2">{tx.fraudFlag}</td>
                <td className="px-3 py-2">
                    {blacklistedUsers.has(tx.from) ? (
                        <button className="bg-gray-500 text-white px-2 py-1 rounded cursor-not-allowed" disabled>
                            Blocked
                        </button>
                    ) : (
                        <button className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600">
                            Allow
                        </button>
                    )}
                </td>
            </tr>
        ))}
    </tbody>
</table>
            )}
        </div>
    );
};

export default TransactionTable;
