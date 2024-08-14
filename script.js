const movie_search_box = document.querySelector(".form-control");
const search_button = document.querySelector(".search-button");
const search_form = document.querySelector(".search_form");
const container = document.querySelector(".search-list");
const preSearch = document.querySelector(".preSearch");

const default_movie = "tt3896198"; // Guardians of the Galaxy Vol. 2

async function fetchMovieData(movieId) {
  try {
    const url = `https://www.omdbapi.com/?i=${movieId}&apikey=1679b940`;

    const response = await fetch(url);
    const data = await response.json();

    if (data.Poster === "N/A") {
      data.Poster = "img/image_not_found.png";
    }

    document.querySelector("#movie-poster").src = data.Poster;
    document.querySelector(".movie-title").textContent = `${data.Title}`;
    document.querySelector(".year").textContent = `Year: ${data.Year}`;
    document.querySelector(
      ".rated"
    ).textContent = `Ratings: ${data.imdbRating}`;
    document.querySelector(
      ".released"
    ).textContent = `Released: ${data.Released}`;
    document.querySelector(".genre").textContent = `Genre: ${data.Genre}`;
    document.querySelector(".writer").textContent = `Writer: ${data.Writer}`;
    document.querySelector(".actors").textContent = `Actors: ${data.Actors}`;
    document.querySelector(".plot").textContent = `Plot: ${data.Plot}`;
    document.querySelector(
      ".language"
    ).textContent = `Language: ${data.Language}`;
    document.querySelector(".awards").textContent = `Awards: ${data.Awards}`;

    console.log(data);
  } catch (error) {
    console.log(error);
  }
}

async function searchMovieData(movieTitle) {
  try {
    const url = `https://www.omdbapi.com/?s=${movieTitle}&apikey=1679b940`;

    const response = await fetch(url);
    const data = await response.json();

    container.innerHTML = ""; // Clear the container on new search

    if (data.Response === "True" && data.Search) {
      for (let i = 0; i < data.Search.length; i++) {
        if (data.Search[i].Poster === "N/A") {
          data.Search[i].Poster = "img/image_not_found.png";
        }
        const movieData = createSearchCardList(data.Search[i]);

        container.appendChild(movieData);
      }
    } else {
      const errorMessage = document.createElement("div");
      errorMessage.className = "error-message";
      errorMessage.textContent = data.Error || "No movies found.";
      container.appendChild(errorMessage);

      storeMovieSearch.pop();
    }
    //console.log(data);
  } catch (error) {
    console.log(error);
  }
}

function createSearchCardList(data) {
  // const search_list_item = document.createElement("div");
  // search_list_item.className = "search-list-item";

  // const search_item_thumbnail = document.createElement("div");
  // search_item_thumbnail.className = "search-item-thumbnail";
  // search_list_item.appendChild(search_item_thumbnail);

  // const img_search = document.createElement("img");
  // img_search.className = "img-search";
  // img_search.src = data.Poster;
  // search_item_thumbnail.appendChild(img_search);

  // const search_item_info = document.createElement("div");
  // search_item_info.className = "search-item-info";
  // search_list_item.appendChild(search_item_info);

  // const search_item_title = document.createElement("h3");
  // search_item_title.className = "search-item-title";
  // search_item_title.textContent = data.Title;
  // search_item_info.appendChild(search_item_title);

  // const search_item_year = document.createElement("h3");
  // search_item_year.className = "search-item-year";
  // search_item_year.textContent = data.Year;
  // search_item_info.appendChild(search_item_year);

    const search_list_item = document.createElement("div");
    search_list_item.className = "search-list-item";
    search_list_item.innerHTML = `
    <div class="search-item-thumbnail">
      <img src="${data.Poster}" alt="movie thumbnail" class="img-search">
    </div>
    <div class="search-item-info">
      <h3 class="search-item-title">${data.Title}</h3>
      <p class="search-item-year">${data.Year}</p>
    </div>`;

    search_list_item.addEventListener("click", () => {
      fetchMovieData(data.imdbID);
      container.innerHTML = "";
    });
  
  return search_list_item;
}

let storeMovieSearch = [];

search_form.addEventListener("submit", (e) => {
  e.preventDefault();

  let user_movie = movie_search_box.value.trim();

  if (user_movie === "") {
    alert("Please enter a movie title");
    return;
  }

  if (!storeMovieSearch.includes(user_movie)) {
    storeMovieSearch.push(user_movie);
    movie_search_box.value = "";

    searchMovieData(user_movie);
  }

  preSearch.textContent = storeMovieSearch.join(", ");
  //console.log(storeMovieSearch);
});

document.addEventListener("DOMContentLoaded", () => {
  container.innerHTML = "";
  fetchMovieData(default_movie);
});

