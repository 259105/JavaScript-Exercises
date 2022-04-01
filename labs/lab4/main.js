"use strict";

function generateTable(filmQuery , queryStr) {
    const filmTable = document.querySelector("#filmTable");
    filmTable.innerHTML = "";
    document.querySelectorAll(".li-aside").forEach((child) => {
        child.className = "li-aside ";
    })
    document.querySelector("#" + queryStr).className +="current";
    document.querySelector("#titleTable").textContent = document.querySelector("#" + queryStr).textContent;
    filmQuery().forEach( (film) => {
        //film.print();
    
        // creating row
        const row = document.createElement("div");
        row.className="row row-film ";
        if(film.isFavorite) row.className += "favorite-film";

        // adding title, favorite, date
        row.innerHTML = `
        <div class="col-4 film-title">${film.title}</div>
        <div class="col">
            <div class="form-check">
                <input class="form-check-input" type="checkbox" value="" id="flexCheckDefault">
                <label class="form-check-label" for="flexCheckDefault">
                  Favorite
                </label>
              </div>
        </div>
        <div class="col"> ${film.getDate() || ""} </div>
        `;

        // create element stars
        const colStars = document.createElement("div");
        colStars.className = "col stars-box ";

        // adding single star
        for(let i = 0;i<5;i++){
            let star = document.createElement("span");
            star.className = "fa fa-star ";
            if(i<film.rating){
                star.className += "checked-star";
            }
            colStars.appendChild(star);
        }

        row.appendChild(colStars);

        // add delete button
        row.innerHTML += `
        <div class="col">
            <button type="button" class="btn btn-danger delete-button">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">
                    <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
                    <path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
                </svg>
            </button>
        </div>
        `;

        row.querySelector("#flexCheckDefault").checked = film.isFavorite;

        //select the button of this row
        row.querySelector(".delete-button").addEventListener("click", (event) => {
            filmsLib.deleteFilm(film.id);
            generateTable(filmQuery,queryStr);
        });

        filmTable.appendChild(row);
    });
}

const filmsLib = new FilmLibrary();
filmsLib.addNewFilm(new Film(1,"Pulp Fiction",true,"2022/03/10",3))
.addNewFilm(new Film(2,"21 Grams",true,"2022/03/17",4))
.addNewFilm(new Film(3,"Star Wars",false))
.addNewFilm(new Film(4,"Matrix",false))
.addNewFilm(new Film(5,"Shrek",false,"2022/03/21",5))
.addNewFilm(new Film(6,"Leo", true))
.addNewFilm(new Film(7,"Batman", "2022/01/30"))
.addNewFilm(new Film(8,"Spiderman", 5))
.addNewFilm(new Film(9,"Amelie",true, 4, "2022/01/07"))
.addNewFilm(new Film(10,"Padrino","2022/01/14", 3));

document.addEventListener("DOMContentLoaded", (event) => {
    generateTable(filmsLib.getAll, "all");
});

document.querySelector("#all").addEventListener("click", (event) => {
    generateTable(filmsLib.getAll, "all");
})

document.querySelector("#favorites").addEventListener("click", (event) => {
    generateTable(filmsLib.getFavorite, "favorites");
})

document.querySelector("#best-rated").addEventListener("click", (event) => {
    generateTable(filmsLib.get5Stars, "best-rated");
})

document.querySelector("#seen-last-month").addEventListener("click", (event) =>{
    generateTable(filmsLib.seenLastMonth, "seen-last-month");
})


