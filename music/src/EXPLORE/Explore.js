import { NavLink   } from 'react-router-dom';
import React, { useState, useRef, useEffect, useCallback} from 'react';
import './explore.css';
import songsData from '../songs.json';
import { BiSolidSkipPreviousCircle} from 'react-icons/bi';
import {BiSolidSkipNextCircle} from 'react-icons/bi';
import {AiFillHome} from 'react-icons/ai'
import {FcMusic} from 'react-icons/fc';
import { useSongContext } from '../SongContext';
const Explore = () => {
    const { setCurrentSong } = useSongContext();
  const [title, setTitle] = useState('');
  const [currentSongId, setCurrentSongId] = useState(null);
  const audioRef = useRef(null);

  const handleNextSong = useCallback(() => {
    if (!currentSongId) return;

    const currentIndex = songsData.Songs.findIndex((song) => song.id === currentSongId);
    const nextIndex = (currentIndex + 1) % songsData.Songs.length;
    setCurrentSongId(songsData.Songs[nextIndex].id);
  }, [currentSongId]);

  useEffect(() => {
    if (!currentSongId) return;

    const audio = audioRef.current;

    if (audio) {
      audio.load();
      audio.play();
    }

    const onEnded = () => {
      handleNextSong();
    };

    audio.addEventListener('ended', onEnded);

    return () => {
      audio.removeEventListener('ended', onEnded);
    };
  }, [currentSongId, handleNextSong]);

  const handleSearch = () => {
    if (!songsData || !Array.isArray(songsData.Songs)) {
      alert('Invalid songs data. Please check your JSON file.');
      return;
    }

    const matchedSongs = songsData.Songs.filter((song) =>
      song.lyrics.toLowerCase().includes(title.toLowerCase())
    );

    console.log('Found Songs:', matchedSongs);

    if (matchedSongs.length > 0) {
      setCurrentSongId(matchedSongs[0].id);
    //   setCurrentSong(matchedSongs[0]);
    } else {
      alert('Song not found. Please check your input.');
    }
  };

  const handlePreviousSong = () => {
    if (!currentSongId) return;

    const currentIndex = songsData.Songs.findIndex((song) => song.id === currentSongId);
    const prevIndex = (currentIndex - 1 + songsData.Songs.length) % songsData.Songs.length;
    setCurrentSongId(songsData.Songs[prevIndex].id);
  };

  const handleInputChange = (e) => {
    setTitle(e.target.value);
  };
  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleSearch(); 
    }
  };

  const currentSong = currentSongId ? songsData.Songs.find((song) => song.id === currentSongId) : null;
  setCurrentSong(currentSong)
    
  return (
    
    <div className="App">
      <h1>Soul Music</h1>
      <div>
        <input className='input-song'
          type="text"
          name="title"
          value={title}
          placeholder="Enter song title"
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
        />
        <button className='search-input' onClick={handleSearch}>Search <FcMusic /></button>
      </div>
      <NavLink to='/' className='home'><AiFillHome size='35'/> Home</NavLink>
      {currentSong && (
        <div>
            
          <h2>{currentSong.title}</h2>
          <h3>{currentSong.artist}</h3><br></br>
          <div className="PrevNext">
            <button className='prev' onClick={handlePreviousSong}><BiSolidSkipPreviousCircle size={50}/></button>
            <div style={{
                backgroundImage: `url(${currentSong.image})`,
                height:"200px",
                width:'250px',
                borderRadius:'50px',
                margin:'auto',
                backgroundRepeate:`no-repeat`,
                backgroundSize:'100% 100%',
                opacity:'1',
            }}></div>
            <button className='next'  onClick={handleNextSong}><BiSolidSkipNextCircle size={50}/></button>
        </div><br></br>
          <audio className="radio-audio"ref={audioRef} controls autoPlay>
            <source src={currentSong.url} type="audio/mpeg" />
            Your browser does not support the audio element.
          </audio>
          <div className="lyrics"><pre>{currentSong.lyrics}</pre></div>
          
        </div>
      )}
    </div>
  );
};

export default Explore;
