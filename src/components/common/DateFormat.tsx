import React from 'react';

interface DateFormatProps {
  date: string | Date;
  className?: string;
}

export const DateFormat: React.FC<DateFormatProps> = ({ date, className = '' }) => {
  const formatRelativeTime = (dateInput: string | Date) => {
    const targetDate = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - targetDate.getTime()) / 1000);

    // Less than a minute
    if (diffInSeconds < 60) {
      return diffInSeconds <= 1 ? 'Just now' : `${diffInSeconds}s ago`;
    }

    // Less than an hour
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) {
      return `${diffInMinutes}m ago`;
    }

    // Less than a day
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    }

    // Less than a week
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) {
      return `${diffInDays}d ago`;
    }

    // Less than a month (30 days)
    if (diffInDays < 30) {
      const diffInWeeks = Math.floor(diffInDays / 7);
      return `${diffInWeeks}w ago`;
    }

    // More than a month - show date in YYYY/MM/DD format
    const year = targetDate.getFullYear();
    const month = String(targetDate.getMonth() + 1).padStart(2, '0');
    const day = String(targetDate.getDate()).padStart(2, '0');
    return `${year}/${month}/${day}`;
  };

  return (
    <span className={className} title={new Date(date).toLocaleString()}>
      {formatRelativeTime(date)}
    </span>
  );
};