import { useState, useEffect } from "react";

const KEY = "2537ed22";

export function useMovies(query, callback) {
  // using effect to react to search bar type
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  useEffect(
    function () {
      callback?.();
      const controller = new AbortController();
      // including an async function to use async/await
      async function fetchMovies() {
        // try/catch/finally block
        try {
          // set the loading effect and reset the error message
          setIsLoading(true);
          setError("");
          // fetching movies matching query
          const res = await fetch(
            `http://www.omdbapi.com/?apikey=${KEY}&s=${query}`,
            { signal: controller.signal }
          );
          // guard clause to check for correct response
          if (!res.ok) throw new Error("Something went wrong...");

          const data = await res.json();
          // guard clause to check for response
          if (data.Response === "False") throw new Error("Movie not found");
          // setting movies array with the query
          setMovies(data.Search);
          setError("");
          // handling error
        } catch (err) {
          if (err.name !== "AbortError") {
            setError(err.message);
          }

          // turning off the loading effect
        } finally {
          setIsLoading(false);
        }
      }
      // checking for query length and empty string
      if (query.length < 3) {
        setMovies([]);
        setError("");
        return;
      }

      //   handleCloseMovie();
      fetchMovies();

      return function () {
        controller.abort();
      };
    },
    [query]
  );
  return { movies, isLoading, error };
}
