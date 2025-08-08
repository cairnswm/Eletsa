import { useEffect, useState, createContext, useContext } from 'react';

const TxContext = createContext();

export const TxProvider = ({ children }) => {
    const [userId, setUserId] = useState(null);
    const [appId, setAppId] = useState(null);
    const [balance, setBalance] = useState(null);
    const [ledger, setLedger] = useState([]);
    const [api, setApi] = useState(null);

    useEffect(() => {
        const loadApi = async () => {
            try {
                const script = document.createElement('script');
                script.src = 'https://tx.cairnsgames.co.za/tx.js';
                script.async = true;
                script.onload = () => {
                    if (window.TX) {
                        setApi(window.TX);
                    }
                };
                document.body.appendChild(script);
            } catch (error) {
                console.error('Failed to load TX API:', error);
            }
        };

        loadApi();
    }, []);

    useEffect(() => {
        if (api && appId) {
            api.setAppId(appId);
        }
    }, [api, appId]);

    useEffect(() => {
        if (api && userId) {
            api.setUserId(userId);
            fetchBalance();
            fetchLedger();
        }
    }, [api, userId]);

    const fetchBalance = async () => {
        try {
            const response = await api.makeApiCall('GET', '/account');
            setBalance(response.user);
        } catch (error) {
            console.error('Error fetching balance:', error);
        }
    };

    const fetchLedger = async () => {
        try {
            const response = await api.makeApiCall('GET', `/account/${userId}/ledger`);
            setLedger(response);
        } catch (error) {
            console.error('Error fetching ledger:', error);
        }
    };

    const contextValue = {
        userId,
        setUserId,
        appId,
        setAppId,
        balance,
        ledger,
        requestPayout: api?.requestPayout.bind(api),
        approvePayoutRequest: api?.approvePayoutRequest.bind(api),
        rejectPayoutRequest: api?.rejectPayoutRequest.bind(api),
        markPayoutAsPaid: api?.markPayoutAsPaid.bind(api),
        createPromoCode: api?.createPromoCode.bind(api),
        validatePromoCode: api?.validatePromoCode.bind(api),
        recordPromoCodeUsage: api?.recordPromoCodeUsage.bind(api),
        getTransactionDetails: api?.getTransactionDetails.bind(api),
        getPayoutHistory: api?.getPayoutHistory.bind(api),
        getPromoCodeUsage: api?.getPromoCodeUsage.bind(api),
    };

    return (
        <TxContext.Provider value={contextValue}>
            {children}
        </TxContext.Provider>
    );
};

export const useTx = () => {
    return useContext(TxContext);
};
