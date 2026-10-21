import { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [shows, setShows] = useState([]);
  const [status, setStatus] = useState(0);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  const limit = 8;

  useEffect(() => {
    const fetchShows = async () => {
      try {
        const response = await fetch('https://api.tvmaze.com/shows');

        if (!response.ok) {
          throw new Error('Unable to fetch shows');
        }

        const result = await response.json();
        setShows(result);
        setStatus(200);
      } catch (error) {
        setStatus(500);
      }
    };

    fetchShows();
  }, []);

  const filteredShows = shows.filter((show) =>
    show.name.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filteredShows.length / limit);
  const start = (page - 1) * limit;
  const currentShows = filteredShows.slice(start, start + limit);

  const handleSearch = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };

  return (
    <div className="app">
      <h1 className="page-title">Explore Shows</h1>

      <input
        className="search-input"
        type="text"
        placeholder="Search your favorite show..."
        value={search}
        onChange={handleSearch}
      />

      {status === 200 && (
        <div className="status success">
          Status 200: Shows fetched successfully!
        </div>
      )}

      {status === 0 && (
        <div className="status loading">
          Loading shows...
        </div>
      )}

      {status === 500 && (
        <div className="status error">
          Status 500: Failed to load shows. Please try again.
        </div>
      )}

      <main className="main">
        {status === 200 && (
          <div className="result-count">
            {filteredShows.length} shows found
          </div>
        )}

        {status === 200 && filteredShows.length === 0 && (
          <p className="message">
            No shows found. Try another name.
          </p>
        )}

        {status === 200 && filteredShows.length > 0 && (
          <>
            <div className="show-grid">
              {currentShows.map((show) => (
                <div className="show-card" key={show.id}>
                  <img
                    className="show-image"
                    src={
                      show.image?.medium ||
                      'https://placehold.co/300x220/f3effa/6040a0?text=No+Poster'
                    }
                    alt={show.name}
                  />

                  <div className="show-info">
                    <h2>
                      <span>Name:</span> {show.name}
                    </h2>

                    <p>
                      <span>Genre:</span>{' '}
                      {show.genres?.length
                        ? show.genres.join(', ')
                        : 'Not available'}
                    </p>

                    <p>
                      <span>Language:</span>{' '}
                      {show.language || 'Unknown'}
                    </p>

                    <p>
                      <span>Status:</span>{' '}
                      {show.status || 'Unknown'}
                    </p>

                    <p>
                      <span>Rating:</span>{' '}
                      {show.rating?.average ?? 'N/A'}
                    </p>

                    <p className="description">
                      <span>Summary:</span>{' '}
                      {show.summary
                        ? show.summary.replace(/<[^>]*>/g, '')
                        : 'Description not available'}
                    </p>

                    <a
                      href={show.url}
                      target="_blank"
                      rel="noreferrer"
                      className="details-link"
                    >
                      View Details ↗
                    </a>
                  </div>
                </div>
              ))}
            </div>

            <div className="pagination">
              <button
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
              >
                ← Previous
              </button>

              <span>
                Page {page} of {totalPages}
              </span>

              <button
                disabled={page === totalPages}
                onClick={() => setPage(page + 1)}
              >
                Next →
              </button>
            </div>

            <p className="showing">
              Showing {start + 1}–
              {Math.min(start + limit, filteredShows.length)}
              {' '}of {filteredShows.length} shows
            </p>
          </>
        )}
      </main>
    </div>
  );
}

export default App;
