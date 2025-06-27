export const loadFromLocalStorage = <T>(key: string): T | null => {
  const data = localStorage.getItem(key);
  if (data) {
    try {
      return JSON.parse(data);
    } catch (error) {
      console.error(`Error parsing localStorage data for key "${key}":`, error);
    }
  }
  return null;
};

export const saveToLocalStorage = (key: string, value: unknown): void => {
  localStorage.setItem(key, JSON.stringify(value));
};

export const removeFromLocalStorage = (key: string): void => {
  localStorage.removeItem(key);
};
