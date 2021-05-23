import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAngleLeft,
  faAngleRight,
  faPlay,
  faPause,
  faVolumeUp,
  faVolumeMute,
} from "@fortawesome/free-solid-svg-icons";
const AudioPlayer = ({
  currentSong,
  setCurrentSong,
  isPlaying,
  setIsPlaying,
  audioRef,
  songInfo,
  setSongInfo,
  songs,
  setSongs,
}) => {
  //Event Handlers
  const playSongHandler = () => {
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(!isPlaying);
    } else {
      audioRef.current.play();
      setIsPlaying(!isPlaying);
    }
  };

  const getTime = (time) => {
    return (
      Math.floor(time / 60) + ":" + ("0" + Math.floor(time % 60)).slice(-2)
    );
  };

  const dragHandler = async (e) => {
    const dragValue = e.target.value;
    await setSongInfo({ ...songInfo, currTime: dragValue });
    audioRef.current.currentTime = e.target.value;
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

  const skipTrackHandler = async (direction) => {
    let currIndex = songs.findIndex((song) => song.id === currentSong.id);
    if (direction === "skip-forward") {
      await setCurrentSong(songs[(currIndex + 1) % songs.length]);
      activeLibraryHandler(songs[(currIndex + 1) % songs.length]);
    }
    if (direction === "skip-back") {
      if ((currIndex - 1) % songs.length === -1) {
        await setCurrentSong(songs[songs.length - 1]);
        activeLibraryHandler(songs[songs.length - 1]);
        if (isPlaying) audioRef.current.play();
        return;
      }
      await setCurrentSong(songs[(currIndex - 1) % songs.length]);
      activeLibraryHandler(songs[(currIndex - 1) % songs.length]);
    }
    if (isPlaying) audioRef.current.play();
  };

  const volDragHandler = (e) => {
    const dragValue = e.target.value / 100;
    audioRef.current.volume = e.target.value / 100;
    setSongInfo({ ...songInfo, volume: dragValue });
  };
  const maxVolHandler = () => {
    audioRef.current.volume = 1;
    setSongInfo({ ...songInfo, volume: 1 });
  };
  const muteVolHandler = () => {
    audioRef.current.volume = 0;
    setSongInfo({ ...songInfo, volume: 0 });
  };
  //Add Styles
  const trackAnimation = {
    transform: `translateX(${songInfo.animationPercentage}%)`,
  };
  const volumeSlider = {
    transform: `translateX(${songInfo.volume * 100}%)`,
  };
  return (
    <div className="player">
      <div className="time-control">
        <p>{getTime(songInfo.currTime)}</p>
        <div
          style={{
            // background: "linear-gradient(to right,#EB727E,#48465E)",
            background: `linear-gradient(to right,${currentSong.color[0]},${currentSong.color[1]})`,
          }}
          className="track"
        >
          <input
            min={0}
            max={songInfo.duration || 0}
            value={songInfo.currTime}
            onChange={dragHandler}
            type="range"
          />
          <div style={trackAnimation} className="animate-track"></div>
        </div>
        <p>{songInfo.duration ? getTime(songInfo.duration) : "0:00"}</p>
      </div>
      <div className="play-control">
        <FontAwesomeIcon
          onClick={() => skipTrackHandler("skip-back")}
          icon={faAngleLeft}
          size="2x"
          className="skip-back"
        />
        {!isPlaying && (
          <FontAwesomeIcon
            onClick={playSongHandler}
            icon={faPlay}
            size="2x"
            className="play"
          />
        )}
        {isPlaying && (
          <FontAwesomeIcon
            onClick={playSongHandler}
            icon={faPause}
            size="2x"
            className="play"
          />
        )}
        <FontAwesomeIcon
          onClick={() => skipTrackHandler("skip-forward")}
          icon={faAngleRight}
          size="2x"
          className="skip-forward"
        />
        <div className="volume-container">
          <FontAwesomeIcon
            icon={faVolumeMute}
            size="2x"
            className="volumeMute"
            onClick={muteVolHandler}
          />
          <div
            style={{
              background: "linear-gradient(to right,#B7C1EB,#084DA6)",
            }}
            className="track volumeSlider"
          >
            <input
              value={songInfo.volume}
              onChange={volDragHandler}
              type="range"
            />
            <div
              style={volumeSlider}
              className="animate-track animate-volumeSlider"
            ></div>
          </div>
          <FontAwesomeIcon
            icon={faVolumeUp}
            size="2x"
            className="volumeUp"
            onClick={maxVolHandler}
          />
        </div>
      </div>
    </div>
  );
};

export default AudioPlayer;
