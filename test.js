// constants
const apikey="0818b83e0b90ab1e7b053d86806fccda";
const apiEndpoint = "https://api.themoviedb.org/3";
const imgPath = "https://image.tmdb.org/t/p/original";
const youtube_api = "AIzaSyD29jSFQxOFfCSEN_xrXQ_NmpyzpCK3_Dg";


const apiPaths = {
    fetchAllCategories: `${apiEndpoint}/genre/movie/list?api_key=${apikey}&language=en-US`,
    fetchMoviesList: (id) => `${apiEndpoint}/discover/movie?api_key=${apikey}&with_genres=${id}`,
    FetchTrending:`${apiEndpoint}/trending/all/day?api_key=${apikey}&language=en-US`,
    searchOnYoutube: (query) => `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${query}&key=${youtube_api}`
}

// boots up app
function init(){
   fetchTrendingMovies();
    fetchAndBuildAllSections(); // calling

}

function fetchTrendingMovies(){
   fetchAndbuildMovieSection(apiPaths.FetchTrending, 'Trending Now')
   .then(list => {
      const randomIndex = parseInt(Math.random() * list.length);
      buildBannerSection(list[randomIndex]);
   }).catch(err=>{
      console.error(err);
   });
}
function buildBannerSection(movie){
  const bannerCont = document.getElementById('banner-section');
  bannerCont.style.backgroundImage = `url('${imgPath}${movie.backdrop_path}')`;
  const div = document.createElement('div');
  //check for null or undefined with nullish coalescing operator - ?? is used to check for null or undefined
   div.innerHTML = `
   <h2 class="banner_title">${movie.title ?? ""}</h2>
   <p class="banner_info">Trending in movies | Released - ${movie.release-date ?? ""} </p>
   <p class="banner_overview">${movie.overview && movie.overview.length > 200 ? movie.overview.slice(0,200).trim()+ '...':movie.overview}</p>
   <div class="action-button-cont">
   <button class="action-button"></button>
   <button class="action-button"></button>
</div> `;
   div.className = "banner-content container";

   bannerCont.append(div);

}
//search
function livesearch(){
    // locate the card elements
    let cards = document.querySelectorAll('.movie-item')
    // locate the search input
    let search_query = document.getElementById("searchbox").value;
    // loop through the cards
    for (var i=0; i < cards.length; i++) {
        // If the text is within the card..
        if(cards[i].innerText.toLowerCase()
        // ....and the text matches the search query...
        .includes(search_query.toLowerCase())){
        // ...remove the `.is-hidden` class.
                 cards[i].classList.remove("is-hidden");
    } else {
        // otherwise,and the class.
        cards[i].classList.add("is-hidden");
    }
  }
} 
function searchMovieTrailer(movieName,iframeId){
    if(!movieName) return;
    fetch(apiPaths.searchOnYoutube(movieName))
    .then(res => res.json())
    .then(res => {
        const bestResult = res.items[0];
         const elements = document.getElementById(iframeId);
         console.log(elements,iframeId);
          
         const div = document.createElement('div');
         div.innerHTML=`<iframe width = "245px" height = "150px" allowfullscreen= "true" src="https://www.youtube.com/embed/${bestResult.id.videoId}?&autoplay=1&mute=1&controls=1"></iframe>`
         elements.append(div);    
    })
    .catch(err=>console.log(err));
}

function fetchAndBuildAllSections(){
    fetch(apiPaths.fetchAllCategories)
    .then(res => res.json())
    .then(res => {
        const categories = res.genres;
        // check if array
        if(Array.isArray(categories) && categories.length){
            categories.forEach((category, i) => {
            // categories.slice(0,3).forEach((category, i) => {
                // fetchAndbuildMovieSection(category);
                fetchAndbuildMovieSection(
                    apiPaths.fetchMoviesList(category.id),
                     category.name);

            });
        } // check if array and not empty
        // console.table(categories);
    } )
    .catch(err => console.error('error from api',err))
}
// fetch and buildMovieSection
function fetchAndbuildMovieSection(fetchUrl,categoryName){
    // console.log('category', category, fetchUrl);
    return fetch(fetchUrl)
    .then(res => res.json())
    .then(res => {
      //   console.table(res.results);
        const movies = res.results;
        if(Array.isArray(movies) && movies.length){
            buildMoviesSection(movies.slice(0,6),categoryName);
        }
        return movies;
    })
    .catch(err => console.error('error from api',err))
}

// build movies section
function buildMoviesSection(list, categoryName){
    console.log(list, categoryName);

    const moviesCont =  document.getElementById('movies-cont');

    const moviesListHTML = list.map(item => {
        return `
        <div class="movie-item" onmouseenter="searchMovieTrailer('${item.title}','yt${item.id}')">
            <img class="move-item-img" src="${imgPath}${item.backdrop_path}" alt="${item.title}" />
            <div class="iframe-wrap" id="yt${item.id}"></div>
            <span class="movie-name">${item.title}</span>
        </div>`;
    }).join('');

    const moviesSectionHTML = `
        <h2 class="movie-section-heading">${categoryName} <span class="explore-nudge">Explore All</span></span></h2>
        <div class="movies-row">
            ${moviesListHTML}
        </div>
    `

    const div = document.createElement('div');
    div.className = "movies-section"
    div.innerHTML = moviesSectionHTML;

    // append html into movies container
    moviesCont.append(div);


}

// AIzaSyD29jSFQxOFfCSEN_xrXQ_NmpyzpCK3_Dg
// function init() {
//    fetchTrendingMovies();
//    fetchAndBuildAllSections();

// }


window.addEventListener("load", function(){
   init();
   livesearch();
   window.addEventListener('scroll', function(){

      //header ui update
      const header = document.getElementById('header');
      if (window.scroll > 5) header.classList.add('black-bg')
      else header.classList.remove('black-bg');
   })
   
});