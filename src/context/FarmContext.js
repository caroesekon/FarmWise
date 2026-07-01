import { createContext, useContext, useState } from 'react';

const FarmContext = createContext(null);

export function FarmProvider({ children }) {
  const [farm, setFarm] = useState(null);

  return (
    <FarmContext.Provider value={{ farm, setFarm }}>
      {children}
    </FarmContext.Provider>
  );
}

export const useFarmContext = () => {
  const context = useContext(FarmContext);
  if (!context) {
    throw new Error('useFarmContext must be used within FarmProvider');
  }
  return context;
};