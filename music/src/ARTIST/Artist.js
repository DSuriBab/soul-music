import React, { useState, useRef } from 'react';
import { NavLink   } from 'react-router-dom';
import {AiFillHome} from 'react-icons/ai'
import songsData from '../songs.json';
import artistsData from './Artist.json'; 
import './Artist.css';
import { useSongContext } from '../SongContext';

function Artist() {
    const { setCurrentSong } = useSongContext();
  const [selectedArtist, setSelectedArtist] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentSong,setcurrentSong] = useState('')
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);


  const handlePlay = () => {
    setIsPlaying(true);
    
  };

  const handlePause = () => {
    setIsPlaying(false);
  };

  const handleArtistClick = (artistName) => {
    if (selectedArtist && selectedArtist.name === artistName) {
      // Clear the selected artist if clicked again
      setSelectedArtist(null);
    } else {
      const matchedArtist = artistsData.Artist.find(
        (artist) => artist.name.toLowerCase() === artistName.toLowerCase()
      );

      if (matchedArtist) {
        setSelectedArtist(matchedArtist);
      }
    }
  };

  const handleSongPlay = (song) => {
    if (audioRef.current) {
      audioRef.current.src = song.url;
      setcurrentSong(song);
      setCurrentSong(song)
    }
  };

  const handleSearchChange = (event) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);
    // setSelectedArtist(null); // Clear the selected artist when searching
    // setcurrentSong(null); // Clear the current song when searching
  };

  return (
    
    <div className='main-container'>
        <NavLink to='/'><AiFillHome className='artist-to-home' size='35'/></NavLink>
    {!selectedArtist ? (
      <div className='search-container'>
        <input
          type='text'
          placeholder='Search artists...'
          value={searchQuery}
          onChange={handleSearchChange}
        />
      </div>):''}

      {!selectedArtist ? (
        <div className='Artist-images'>
        {artistsData.Artist.filter(artist =>
          artist.name.toLowerCase().includes(searchQuery.toLowerCase())
        ).map((artist) => (
          <div key={artist.name} className='artist-container'>
            <img
              src={artist.image1}
              alt={artist.name}
              onClick={() => handleArtistClick(artist.name)}
            />
    <p className="artist-name">{artist.name}</p>
  </div>
    ))}
        </div>
      ) : (
        <div className='container'>
          {selectedArtist.image1 && (
            
            <img
              className='second-image'
              src={selectedArtist.image2}
              alt={selectedArtist.name}
            />
           
          )}
         
          
          <div className='Artist-songs'>
            <ul style={{ listStyleType: 'none', padding: 0 }}>
              {songsData.Songs
                .filter((song) => song.artist === selectedArtist.name)
                .map((song) => (
                    
                  <li
                    key={song.id}
                    onClick={() => handleSongPlay(song)}
                    style={{ cursor: 'pointer', margin: '10px 0' }}
                  >
                    {song.title} 
                  </li>
                 
                ))}
            </ul>  
          </div>
          <audio ref={audioRef} className='audio-block' autoPlay controls onPlay={handlePlay} onPause={handlePause}/>
          <div  className='artist-lyrics'>
            <details>
                <summary className='summary'>Do you want Lyrics</summary>
                <pre className='pre'>{currentSong.lyrics}</pre> 
            </details>
       
         </div>
         {!currentSong ? '':<img className={!isPlaying?'movie-image':'movie-rotate-image'} src={currentSong.image} alt='movieimage'/>}
         
        </div>
      )}
    </div>
    
  );
}

export default Artist;
