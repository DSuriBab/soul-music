import React from 'react';
import { Routes, Route} from 'react-router-dom';
import Home from './HOME/Home';
import Album from './ALBUM/Album';
import Artist from './ARTIST/Artist';
import Explore from './EXPLORE/Explore';
import Compare from './COMPARE/Compare';
import { SongProvider } from './SongContext';
function App() {
  return (
        <SongProvider>
            <div>
            <Routes>
            <Route path="/" element={<Home/>} />
            <Route path="/artist" element={<Artist />} />
            <Route path="/album" element={<Album />} />
            <Route path="/explore" element={<Explore />} />
            <Route path="/compare" element={<Compare />} />
            </Routes>
        </div>
        </SongProvider>
      
     
  );
}

export default App;
