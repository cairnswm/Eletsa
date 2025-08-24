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
      throw new Error('TX API not available');
    }

    const accounts = await window.TX.getUserBalances();
    return Array.isArray(accounts) ? accounts : [accounts];
  },

  async fetchAccountLedger(accountId: number, limit: number = 100): Promise<UserTransaction[]> {
    if (!window.TX) {
      throw new Error('TX API not available');
    }

    const transactions = await window.TX.getAccountLedger(accountId, limit);
    return Array.isArray(transactions) ? transactions : [transactions];
  },
};