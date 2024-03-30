import React, { useState, useEffect, useRef } from 'react';
import { ReactMic } from 'react-mic';
import SData from '../songs.json'
import {AiFillHome} from 'react-icons/ai'
import { NavLink   } from 'react-router-dom';
import stringSimilarity from 'string-similarity';
import './compare.css'
const DisplayInput = ({ recordedBlob, text, songTitle }) => {
  
  const MatchSong = SData.Songs.filter((song)=>
  song.lyrics.toLowerCase().includes(songTitle.toLowerCase())
  );

  if (MatchSong.length === 0) {
    // Handle case when no matching song is found
    return (
      <div>
        <h2>No matching song found for '{songTitle}'</h2>
      </div>
    );
  }

  let dummyText = MatchSong[0].lyrics.trim().toLowerCase();
  let recordedText = text.trim().toLowerCase();
  dummyText = dummyText.slice(0,recordedText.length)

   dummyText = dummyText.replace(/[^\w\s]/g,'');
   recordedText = recordedText.replace(/[^\w\s]/g,'');

   

   let similarity = stringSimilarity.compareTwoStrings(dummyText.toLowerCase(), recordedText.toLowerCase());

   if(recordedText.length === 0){
    similarity = 0;
   }

  

  return (
    <div>
    <div className='results'>
      <h2>Recorded Audio</h2>
      <div className='audio-style'>
        <audio controls>
            <source src={recordedBlob ? recordedBlob.blobURL : ""} type={recordedBlob ? recordedBlob.blob.type : ""} />
        </audio>
    </div>
      <h2>Comparing with Song Title</h2>
      <p>{songTitle}</p>
      <h2>Song Lyrics</h2>
      <p>{dummyText}</p>
      <h2>Your Lyrics</h2>
      <p>{recordedText}</p>
      <h2>Your Score</h2>
      <p className='score'>{(similarity * 100).toFixed(2)}%</p>
    </div>
    <div className='temp'></div>
    </div>
  );
};


const SpeechInputAndDisplay = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordedBlob, setRecordedBlob] = useState(null);
  const [convertedTexts, setConvertedTexts] = useState('');
  const [songTitle, setSongTitle] = useState('');

  const recognitionRef = useRef(null);

  const onData = (recordedBlob) => {
    console.log('chunk of real-time data is: ', recordedBlob);
  };

  const onStop = (recordedBlob) => {
    console.log('recordedBlob is: ', recordedBlob);
    setRecordedBlob(recordedBlob);
  };

  const startRecording = () => {
    setIsRecording(true);
    setRecordedBlob(null); // Clear the recorded blob when starting a new recording
    setConvertedTexts(''); // Reset the converted texts when starting a new recording

    recognitionRef.current = new window.webkitSpeechRecognition();
    recognitionRef.current.continuous = true;
    recognitionRef.current.interimResults = true;
    recognitionRef.current.lang = 'en-US';

    let allTranscripts = ''; // Variable to store all the text

    // Event listener when speech is recognized
    recognitionRef.current.onresult = (event) => {
      let finalTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript + ' ';
        }
      }
      allTranscripts += finalTranscript; // Append the latest transcript to the previous text
      setConvertedTexts(allTranscripts); // Update the state with all the text
    };

    // Start recognition
    recognitionRef.current.start();
  };

  const stopRecording = () => {
    setIsRecording(false);
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
  };

  const pauseRecording = () => {
    setIsRecording(false);
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
  };

  const resumeRecording = () => {
    setIsRecording(true);

    recognitionRef.current = new window.webkitSpeechRecognition();
    recognitionRef.current.continuous = true;
    recognitionRef.current.interimResults = true;
    recognitionRef.current.lang = 'en-US';

    recognitionRef.current.onresult = (event) => {
      let finalTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript + ' ';
        }
      }
      setConvertedTexts((prevText) => prevText + finalTranscript);
    };

    recognitionRef.current.start();
  };

  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  return (
    <div className='speech-input'>
      <div>
        <h2 className='about-text'>Let's Compare your lyrics here....</h2>
        <NavLink to='/' className='home'><AiFillHome size='35'/> Home</NavLink>
        <div className="stroke">
          <ReactMic mimeType="audio/mp3"record={isRecording} strokeColor={'#2c339c'} backgroundColor={'#6d6d62'}className="sound-wave" onStop={onStop} onData={onData}/>
        </div>
        <div className='input-song-name'>
            <input
            type="text"
            placeholder="Enter song title to compare"
            value={songTitle}
            onChange={(e) => setSongTitle(e.target.value)}
            />
        </div><br></br>
        <div className='buttons'>
        {isRecording ? (
          <>
            <button className='btn1'onClick={stopRecording}>Stop</button>
            <button className='btn2'onClick={pauseRecording}>Pause</button>
          </>
        ) : (
          <button className='btn3'onClick={startRecording}>Start</button>
        )}
        {convertedTexts && (
          <button className='btn4' onClick={resumeRecording} disabled={isRecording}>
            Resume
          </button>
        )}
          </div>
      </div>
      {recordedBlob && <DisplayInput recordedBlob={recordedBlob} text={convertedTexts} songTitle={songTitle} />}
    </div>
  );
};

const App = () => {
  return (
    <div>
      <SpeechInputAndDisplay />
    </div>
  );
};

export default App;