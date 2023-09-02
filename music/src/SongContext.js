import React, { createContext, useContext, useState } from 'react';

const SongContext = createContext();

export const useSongContext = () => useContext(SongContext);

export const SongProvider = ({ children }) => {
  const [currentSong, setCurrentSong] = useState(null);

  return (
    <SongContext.Provider value={{ currentSong, setCurrentSong }}>
      {children}
    </SongContext.Provider>
  );
};
