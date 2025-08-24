import React from 'react';
import { Receipt, AlertCircle, DollarSign } from 'lucide-react';
import { useTransaction } from '../../contexts/TransactionContext';

export const TransactionsTab: React.FC = () => {
  const { accounts, transactions, loading, error } = useTransaction();

  const formatCurrency = (amount: string) => {
    const num = parseFloat(amount);
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR',
    }).format(num);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-ZA', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getTransactionTypeColor = (type: string) => {
    switch (type) {
      case 'sale_organizer':
        return 'bg-green-100 text-green-800';
      case 'purchase':
        return 'bg-blue-100 text-blue-800';
      case 'payout':
        return 'bg-purple-100 text-purple-800';
      case 'refund':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTransactionTypeLabel = (type: string) => {
    switch (type) {
      case 'sale_organizer':
        return 'Organizer Earnings';
      case 'purchase':
        return 'Ticket Purchase';
      case 'payout':
        return 'Payout';
      case 'refund':
        return 'Refund';
      default:
        return type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Receipt className="w-6 h-6 text-[#1E30FF]" />
          <h2 className="text-2xl font-bold text-gray-900">Transactions</h2>
        </div>
        <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm">
          {transactions.length} total
        </span>
      </div>

      {/* Account Balance */}
      {accounts.length > 0 && (
        <div className="mb-6 bg-gradient-to-r from-[#1E30FF]/10 to-[#FF2D95]/10 rounded-lg p-6 border border-[#1E30FF]/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-r from-[#1E30FF] to-[#FF2D95] rounded-full flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Account Balance</h3>
                <p className="text-sm text-gray-600">Available funds</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-[#1E30FF]">
                {formatCurrency(accounts[0].balance)}
              </div>
              <div className="text-sm text-gray-600 capitalize">
                {accounts[0].account_type} Account
              </div>
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-center space-x-2">
          <AlertCircle className="w-5 h-5 text-red-600" />
          <span className="text-red-600 text-sm">{error}</span>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1E30FF]"></div>
          <span className="ml-3 text-gray-600">Loading transactions...</span>
        </div>
      ) : transactions.length > 0 ? (
        <>
          {/* Desktop Table View */}
          <div className="hidden lg:block bg-white rounded-lg border border-gray-200 overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Reference
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {transactions.map((transaction) => (
                  <tr key={transaction.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {transaction.description}
                        </div>
                        {transaction.transaction_description && (
                          <div className="text-sm text-gray-500">
                            {transaction.transaction_description}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getTransactionTypeColor(transaction.type)}`}>
                        {getTransactionTypeLabel(transaction.type)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatDate(transaction.created_at)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {formatCurrency(transaction.gross_amount)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">
                      {transaction.reference}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="lg:hidden space-y-4">
            {transactions.map((transaction) => (
              <div key={transaction.id} className="bg-white rounded-lg border border-gray-200 p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-[#1E30FF] to-[#FF2D95] rounded-full flex items-center justify-center">
                      <Receipt className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 text-sm">
                        {transaction.description}
                      </h3>
                      {transaction.transaction_description && (
                        <p className="text-xs text-gray-600">
                          {transaction.transaction_description}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-gray-900">
                      {formatCurrency(transaction.gross_amount)}
                    </div>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getTransactionTypeColor(transaction.type)}`}>
                      {getTransactionTypeLabel(transaction.type)}
                    </span>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Date:</span>
                    <span className="ml-2 font-medium">{formatDate(transaction.created_at)}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Reference:</span>
                    <span className="ml-2 font-medium font-mono text-xs">{transaction.reference}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="text-center py-12">
          <Receipt className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No transactions yet</h3>
          <p className="text-gray-600">Your transaction history will appear here once you make purchases or earn from events</p>
        </div>
      )}
    </div>
  );
};