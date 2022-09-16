import './songs-list.css';

const SongsList = ({ songsListInfo }) => {
  return (
    <table className='songs-list-table'>
      <thead>
        <tr>
          <th scope='col'>#</th>
          <th scope='col'>Song</th>
          <th scope='col'>Duration</th>
        </tr>
      </thead>
      {songsListInfo && (
        <tbody>
          {songsListInfo.map((song) => (
            <tr key={song.songId}>
              <td>{songsListInfo.indexOf(song) + 1}</td>
              <td>{song.songTitle}</td>
              <td>{song.songDuration}</td>
            </tr>
          ))}
        </tbody>
      )}
    </table>
  );
};

export default SongsList;