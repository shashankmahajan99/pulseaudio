import React, { useEffect, useContext, useState, useRef } from "react";
import "./styles/app.scss";
import AudioPlayer from "./components/AudioPlayer";
import Song from "./components/Song";
import data from "./data";
import Library from "./components/Library";
import Nav from "./components/Nav";
import { playAudio } from "./util";
const App = () => {
  const [songs, setSongs] = useState(data());
  const [currentSong, setCurrentSong] = useState(songs[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  const [songInfo, setSongInfo] = useState({
    currTime: 0,
    duration: 0,
    animationPercentage: 0,
    volume: 1,
  });

  const [libraryStatus, setLibraryStatus] = useState(false);
  const timeUpdateHandler = (e) => {
    const currTime = e.target.currentTime;
    const duration = e.target.duration;
    const roundedCurr = Math.round(currTime);
    const roundedDuration = Math.round(duration);
    const animationPercentage = Math.round(
      (roundedCurr / roundedDuration) * 100
    );
    setSongInfo({
      ...songInfo,
      currTime,
      duration,
      animationPercentage,
    });
  };
  const activeLibraryHandler = (nextPrev) => {
    const newSongs = songs.map((song) => {
      if (song.id === nextPrev.id) {
        return { ...song, active: true };
      } else {
        return { ...song, active: false };
      }
    });
    setSongs(newSongs);
  };

  const songEndHandler = async () => {
    let currIndex = songs.findIndex((song) => song.id === currentSong.id);
    await setCurrentSong(songs[(currIndex + 1) % songs.length]);
    activeLibraryHandler(songs[(currIndex + 1) % songs.length]);
    playAudio(isPlaying, audioRef);
    return;
  };

  return (
    <div className={`App ${libraryStatus ? "library-active" : ""}`}>
      <Nav libraryStatus={libraryStatus} setLibraryStatus={setLibraryStatus} />
      <Song currentSong={currentSong} isPlaying={isPlaying} />
      <AudioPlayer
        currentSong={currentSong}
        setCurrentSong={setCurrentSong}
        isPlaying={isPlaying}
        setIsPlaying={setIsPlaying}
        audioRef={audioRef}
        songInfo={songInfo}
        setSongInfo={setSongInfo}
        songs={songs}
        setSongs={setSongs}
      />
      <Library
        audioRef={audioRef}
        songs={songs}
        setCurrentSong={setCurrentSong}
        isPlaying={isPlaying}
        setSongs={setSongs}
        libraryStatus={libraryStatus}
      />
      <audio
        onTimeUpdate={timeUpdateHandler}
        onLoadedMetadata={timeUpdateHandler}
        ref={audioRef}
        src={currentSong.audio}
        onEnded={songEndHandler}
      />
    </div>
  );
};

export default App;
