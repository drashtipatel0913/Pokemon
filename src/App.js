import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Pagination from './Pagination';
import './App.css'; // Import custom styles

function App() {
  const [pokemon, setPokemon] = useState([]);
  const [currentPageUrl, setCurrentPageUrl] = useState("https://pokeapi.co/api/v2/pokemon");
  const [nextPageUrl, setNextPageUrl] = useState();
  const [prevPageUrl, setPrevPageUrl] = useState();
  const [loading, setLoading] = useState(true);
  const perPage = 10; // Number of Pokémon per page

  useEffect(() => {
    setLoading(true);
    let cancel;
    const source = axios.CancelToken.source();

    axios.get(currentPageUrl, {
      cancelToken: source.token,
    })
      .then((res) => {
        setLoading(false);
        setNextPageUrl(res.data.next);
        setPrevPageUrl(res.data.previous);
        fetchPokemonDetails(res.data.results);
      })
      .catch((error) => { });

    return () => {
      source.cancel();
    };
  }, [currentPageUrl]);

  const fetchPokemonDetails = async (pokemonList) => {
    const slicedPokemonList = pokemonList.slice(0, perPage); // Slice to get only 10 Pokémon
    const pokemonWithDetails = await Promise.all(
      slicedPokemonList.map(async (p) => {
        const response = await axios.get(p.url);
        return {
          name: capitalizeFirstLetter(p.name),
          image: response.data.sprites.other['official-artwork'].front_default,
        };
      })
    );
    setPokemon(pokemonWithDetails);
  };

  function capitalizeFirstLetter(name) {
    return name.charAt(0).toUpperCase() + name.slice(1);
  }

  function goToNextPage() {
    setCurrentPageUrl(nextPageUrl);
  }

  function goToPrevPage() {
    setCurrentPageUrl(prevPageUrl);
  }

  if (loading) return <div className="text-center mt-5">Loading ...</div>;

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4 pokemon-font">Pokémon</h1>
      <div className="row row-cols-1 row-cols-md-5 g-4">
        {pokemon.map((p, index) => (
          <div key={index} className="col">
            <div className="card h-100 border-0">
              <img
                src={p.image}
                className="card-img-top img-thumbnail border-0"
                alt={p.name}
              />
              <div className="card-body text-center">
                <h5 className="card-title">{p.name}</h5>
              </div>
            </div>
          </div>
        ))}
      </div>
      <Pagination
        goToNextPage={nextPageUrl ? goToNextPage : null}
        goToPrevPage={prevPageUrl ? goToPrevPage : null}
      />
    </div>
  );
}

export default App;
