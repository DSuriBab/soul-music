import React, { useState, useEffect } from 'react';
import songsData from '../songs.json';
import './Home.css';
import { NavLink } from 'react-router-dom';
import { AiTwotoneHeart } from 'react-icons/ai';
import { useSongContext } from '../SongContext';
import logo from './soul-logo1.png'
function Home() {
  const { currentSong } = useSongContext();
  const [isPlaying, setIsPlaying] = useState(false);
  const [randomSongs, setRandomSongs] = useState([]);
  const [currentPlayingSong, setCurrentPlayingSong] = useState(null);

  useEffect(() => {
    const shuffledSongs = [...songsData.Songs].sort(() => Math.random() - 0.5);
    setRandomSongs(shuffledSongs.slice(0, 10));

    // Set the first song as the initial currentPlayingSong
    if (shuffledSongs.length > 5) {
      setCurrentPlayingSong(shuffledSongs[4]);
    }
  }, []);

  const handlePlay = () => {
    setIsPlaying(true);
  };

  const handlePause = () => {
    setIsPlaying(false);
  };

  return (
    <div className="body">
      <header>
            <div>
                <img className='logo'src={logo} alt='soul-music logo'/>
            </div>
        <nav>
          <NavLink to="/">Home</NavLink>
          <NavLink to="/artist">Artist</NavLink>
          <NavLink to="/album">Album</NavLink>
          <NavLink to="/explore">Explore</NavLink>
          <NavLink to="/Compare">Compare</NavLink>
          <div className='animation'></div>
        </nav>
      </header>
      <div className='brand-name'>
        <h1>Soul Music</h1>
        <p>Let's your voice reach to heaven</p>
      </div>
      
      <div className="back-ground"></div>
      <div className="song-list-main">
        <ul className = 'song-list'>
        {randomSongs.map((song) => (
            <li key={song.id} >
                <p onClick={() => {
                setCurrentPlayingSong(song);
                setIsPlaying(false);
            }}>{song.title}</p>
            </li>
        ))}
        </ul>
      </div>
      <div className="footer">
        <h1 className="songTitle" style={{ color: 'white', fontSize: '24px' }}>
          {currentSong ? currentSong.title : currentPlayingSong?.title}
        </h1>
        {isPlaying ? (
          <AiTwotoneHeart className="heart-beat" color="red" size="40" />
        ) : (
          <AiTwotoneHeart className="heart" color="red" size="40" />
        )}
        <audio
          className="audio" 
          controls
          onPlay={handlePlay}
          onPause={handlePause}
          src={currentSong ? currentSong.url : currentPlayingSong?.url}
        />
      </div>
    </div>
  );
}

export default Home;
