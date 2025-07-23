import { createHeaders, handleApiResponse } from "./api";
import { UserTransaction } from "../types/transaction";

const TRANSACTIONS_API = "https://eletsa.cairns.co.za/php/transactions";

export const transactionsApi = {
  async fetchUserTransactions(): Promise<UserTransaction[]> {
    const response = await fetch(`${TRANSACTIONS_API}/api.php/transactions`, {
      method: "POST",
      headers: createHeaders(true),
      body: JSON.stringify({}), // Empty body for POST request
    });

    const data = await handleApiResponse(response);
    const transactions = Array.isArray(data) ? data : [data];

    // Convert string numbers to proper types where needed
    return transactions.map((transaction: any) => ({
      ...transaction,
      quantity: Number(transaction.quantity),
      transaction_id: Number(transaction.transaction_id),
      user_id: Number(transaction.user_id),
      order_id: Number(transaction.order_id),
      order_item_id: Number(transaction.order_item_id),
      ticket_id: Number(transaction.ticket_id),
      organizer_id: Number(transaction.organizer_id),
    }));
  },
};