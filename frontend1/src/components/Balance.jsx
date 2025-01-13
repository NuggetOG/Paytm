import { useState, useEffect } from "react";
import axios from "axios";

export const Balance = () => {
    const [balance, setBalance] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchBalance = async () => {
            try {
                const response = await axios.get("http://localhost:3000/api/v1/account/balance", {
                    headers: {
                        Authorization: "Bearer " + localStorage.getItem("token"),
                    },
                });
                setBalance(response.data.balance); // Assuming the API returns { balance: <value> }
            } catch (err) {
                setError("Failed to fetch balance");
                console.error(err);
            }
        };

        fetchBalance();
    }, []);

    if (error) {
        return <div className="text-red-500">Error: {error}</div>;
    }

    if (balance === null) {
        return <div className="text-gray-500">Loading...</div>;
    }

    return (
        <div className="flex">
            <div className="font-bold text-lg">Your balance</div>
            <div className="font-semibold ml-4 text-lg">Rs {balance}</div>
        </div>
    );
};
