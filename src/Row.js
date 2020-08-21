import React, { useState, useEffect } from "react";
import axios from "./axios";
import "./Row.css";
import YouTube from "react-youtube";
import movieTrailer from "movie-trailer";

const baseUrl = "https://image.tmdb.org/t/p/original/";

function Row({ title, fetchUrl, isLargeRow }) {
    const [movies, setMovies] = useState([]);
    const [trailerUrl, setTrailerUrl] = useState("");

    // A snippet of code which runs based on a specific condition/variable
    useEffect(() => {
        async function fetchData() {
            const request = await axios.get(fetchUrl);
            setMovies(request.data.results);
            return request;
        }
        fetchData();
        return () => {
            fetchData();
        };
    }, [fetchUrl]);

    const opts = {
        height: "460",
        width: "100%",
        playerVars: {
            autoplay: 1,
        },
    };

    const handleClick = (movie) => {
        if (trailerUrl) {
            setTrailerUrl("");
        } else {
            movieTrailer(movie?.name || "")
                .then((url) => {
                    const urlParams = new URLSearchParams(new URL(url).search);
                    setTrailerUrl(urlParams.get("v"));
                })
                .catch((error) => console.log(error));
        }
    };

    return (
        <div className="row">
            {/* Title */}
            <h2>{title}</h2>

            {/* Container -> posters */}
            <div className="row__posters">
                {/* posters */}
                {movies.map((movie) =>
                    !movie.poster_path || !movie.backdrop_path ? (
                        false
                    ) : (
                        <img
                            key={movie.id}
                            onClick={() => handleClick(movie)}
                            className={`row__poster ${
                                isLargeRow && "row__posterLarge"
                            }`}
                            src={`${baseUrl}${
                                isLargeRow
                                    ? movie.poster_path
                                    : movie.backdrop_path
                            }`}
                            alt={movie.name}
                        />
                    )
                )}
            </div>
            {trailerUrl && <YouTube videoId={trailerUrl} opts={opts} />}
        </div>
    );
}

export default Row;
