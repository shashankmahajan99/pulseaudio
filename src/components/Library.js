import React from "react";
import LibrarySong from "./LibrarySong";
const Library = ({
  songs,
  setSongs,
  setCurrentSong,
  audioRef,
  isPlaying,
  libraryStatus,
}) => {
  return (
    <div className={`library ${libraryStatus ? "active-library" : ""}`}>
      <h2>Library</h2>
      <div className="library-songs">
        {songs.map((song) => (
          <LibrarySong
            key={song.id}
            song={song}
            songs={songs}
            setCurrentSong={setCurrentSong}
            isPlaying={isPlaying}
            audioRef={audioRef}
            setSongs={setSongs}
          />
        ))}
      </div>
    </div>
  );
};

export default Library;
