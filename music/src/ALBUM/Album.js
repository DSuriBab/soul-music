import React, { useState, useRef } from 'react';
import { NavLink } from 'react-router-dom';
import { AiFillHome } from 'react-icons/ai';
import albumData from './Album.json';
import songsData from '../songs.json'
import '../ARTIST/Artist.css'
import { useSongContext } from '../SongContext';

function Artist() {
    const { setCurrentSong } = useSongContext();
    const [selectedAlbum, setSelectedAlbum] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [currentSong, setcurrentSong] = useState('');
    const [isPlaying, setIsPlaying] = useState(false);
    const audioRef = useRef(null);
  
    const handlePlay = () => {
      setIsPlaying(true);
    };
  
    const handlePause = () => {
      setIsPlaying(false);
    };
  
    const handleAlbumClick = (albumName) => {
      if (selectedAlbum && selectedAlbum.movie === albumName) {
        setSelectedAlbum(null);
      } else {
        const matchedAlbum = albumData.Album.find(
          (album) => album.movie.toLowerCase() === albumName.toLowerCase()
        );
  
        if (matchedAlbum) {
          setSelectedAlbum(matchedAlbum);
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
    };
  
    return (
      <div className='main-container'>
        <NavLink to='/'>
          <AiFillHome className='artist-to-home' size='35' />
        </NavLink>
        {!selectedAlbum ? (
          <div className='search-container'>
            <input
              type='text'
              placeholder='Search albums...'
              value={searchQuery}
              onChange={handleSearchChange}
            />
          </div>
        ) : (
          ''
        )}
  
        {!selectedAlbum ? (
          <div className='Artist-images'>
            {albumData.Album.filter((album) =>
              album.movie.toLowerCase().includes(searchQuery.toLowerCase())
            ).map((album) => (
              <div
                key={album.movie}
                className='artist-container'
                onClick={() => handleAlbumClick(album.movie)}
              >
                <img src={album.image} alt={album.movie} />
                <p className='artist-name'>{album.movie}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className='container'>
            {selectedAlbum.image && (
              <img
                className='second-image'
                src={selectedAlbum.image}
                alt={selectedAlbum.movie}
              />
            )}
  
            <div className='Artist-songs'>
              <ul style={{ listStyleType: 'none', padding: 0 }}>
                {songsData.Songs.filter(
                  (song) => song.movie === selectedAlbum.movie
                ).map((song) => (
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
            <audio
              ref={audioRef}
              className='audio-block'
              autoPlay
              controls
              onPlay={handlePlay}
              onPause={handlePause}
            />
            <div className='artist-lyrics'>
              <details>
                <summary className='summary'>Do you want Lyrics</summary>
                <pre className='pre'>{currentSong.lyrics}</pre>
              </details>
            </div>
            {!currentSong ? (
              ''
            ) : (
              <img
                className={!isPlaying ? 'movie-image' : 'movie-rotate-image'}
                src={currentSong.image}
                alt='movieimage'
              />
            )}
          </div>
        )}
      </div>
    );
  }
  
  export default Artist;