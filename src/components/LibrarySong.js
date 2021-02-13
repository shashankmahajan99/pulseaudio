import React from "react";
const LibrarySong = ({
  song,
  songs,
  setSongs,
  setCurrentSong,
  audioRef,
  isPlaying,
}) => {
  const songSelectHandler = async () => {
    setCurrentSong(song);
    const newSongs = songs.map((songList) => {
      if (songList.id === song.id) {
        return { ...songList, active: true };
      } else {
        return { ...songList, active: false };
      }
    });
    await setSongs(newSongs);
    if (isPlaying) audioRef.current.play();
  };
  return (
    <div
      onClick={songSelectHandler}
      className={`library-song ${song.active ? "selected" : ""}`}
    >
      <img src={song.cover} alt={song.name} />
      <div className="song-description">
        <h3>{song.name}</h3>
        <h4>{song.artist}</h4>
      </div>
    </div>
  );
};

export default LibrarySong;
