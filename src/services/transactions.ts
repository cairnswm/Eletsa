import { UserAccount, UserTransaction } from "../types/transaction";

// Declare TX API on window object
declare global {
  interface Window {
    TX: {
      setAppId: (appId: string) => void;
      setUserId: (userId: number) => void;
      getUserBalances: () => Promise<UserAccount[]>;
      getAccountLedger: (accountId: number, limit?: number) => Promise<UserTransaction[]>;
    };
  }
}

export const transactionsApi = {
  async fetchUserAccounts(): Promise<UserAccount[]> {
    if (!window.TX) {
      console.error('transactionsApi: TX API not available');
      throw new Error('TX API not available');
    }

    console.log('transactionsApi: Calling TX.getUserBalances()');
    const accounts = await window.TX.getUserBalances();
    console.log('transactionsApi: getUserBalances response:', accounts);
    return Array.isArray(accounts) ? accounts : [accounts];
  },

  async fetchAccountLedger(accountId: number, limit: number = 100): Promise<UserTransaction[]> {
    if (!window.TX) {
      console.error('transactionsApi: TX API not available');
      throw new Error('TX API not available');
    }

    console.log('transactionsApi: Calling TX.getAccountLedger with:', { accountId, limit });
    const transactions = await window.TX.getAccountLedger(accountId, limit);
    console.log('transactionsApi: getAccountLedger response:', transactions);
    return Array.isArray(transactions) ? transactions : [transactions];
  },
};