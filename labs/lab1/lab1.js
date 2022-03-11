"use strict";
const dayjs = require('dayjs');
const customParseFormat = require("dayjs/plugin/customParseFormat");
const isSameOrAfter = require("dayjs/plugin/isSameOrAfter");
const isSameOrBefore = require("dayjs/plugin/isSameOrBefore");
dayjs.extend(customParseFormat);
dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

function Film(id, title,/*  isFavorite = false, date, rating */ ...pars){
    this.id = id;
    this.title = title;
    // this.isFavorite = isFavorite;
    // this.date = dayjs(date, "YYYY/MM/DD");
    // this.rating =rating;
    // optional parameters
    for(let i=0; i<pars.length;i++){
        let type = typeof(pars[i]);
        if(type=="boolean" && i==0) // must be in first pos
            this.isFavorite = pars[i];
        else if(type=="string" && i<=1) // can be first o second position 
            // the par (rating, date) is valid and parsed correctly, even if they are reversed
            this.date = dayjs(pars[i]);
        else if(type=="number" && i<=2) // can be first, second or third
            this.rating = pars[i];
        else
            console.log("Invalid parameters");
    }

    // default values
    this.isFavorite = this.isFavorite || false; 
    this.date = this.date || dayjs("");

    this.print = () => console.log(`Id : ${this.id}, Title: ${this.title}, Favorite: ${this.isFavorite}, Watch date: ${this.date}, Score: ${this.rating}`);
}

function FilmLibrary(){
    this.films = [];

    // tranformations
    this.addNewFilm = (newFilm) => {
        this.films.push(newFilm);
        // if i want to do like spark i have to create e new library and return it, here i return the library itself, it's more easy and readable;
        return this;
    };
    this.deleteFilm = (deletingFilmId) => {
        this.films = this.films.filter((f) => f.id!=deletingFilmId);
        return this;
    };
    this.resetWatchedFilms = () => {
        this.films.forEach(f => f.date = dayjs(""));
        return this;
    };
    // actions
    this.print = () => this.films.forEach( (film) => film.print() );
    this.sortByDate = () => {
        console.log("***** List of films sorted by date *****");
        this.films
            .sort((f1,f2) =>{
                if(!f1.date.isValid() && !f2.date.isValid()) return f1.id-f2.id;
                if(!f1.date.isValid()) return 1;
                if(!f2.date.isValid()) return -1;
                return f1.date.isSameOrAfter(f2) ? -1 : 1;
            })
            .forEach(f => f.print());
    };
    this.getRated = () => {
        console.log("***** Films filtered, only the rated ones *****");
        // the filter avoid the sorting in place
        this.films.filter((film) => film.rating!=undefined)
            .sort((f1,f2) => -(f1.rating-f2.rating))
            .forEach(f => f.print());
    };
}

let library = new FilmLibrary();
library.addNewFilm(new Film(1,"Pulp Fiction",true,"2022/03/10",3))
    .addNewFilm(new Film(2,"21 Grams",true,"2022/03/17",4))
    .addNewFilm(new Film(3,"Star Wars",false))
    .addNewFilm(new Film(4,"Matrix",false))
    .addNewFilm(new Film(5,"Shrek",false,"2022/03/21",5))
    .addNewFilm(new Film(6,"Leo", true))
    .addNewFilm(new Film(7,"Batman", "2022/03/30"))
    .addNewFilm(new Film(8,"Spiderman", 5))
    .addNewFilm(new Film(9,"Amelie", 4, "2022/04/07", true))
    .addNewFilm(new Film(10,"Padrino","2022/03/14", 3))
    .print();

console.log("\n");
library.sortByDate();

console.log("\n");
library.getRated();

console.log("\n");
library.deleteFilm(2).deleteFilm(3).print();

console.log("\n");
library.resetWatchedFilms().print();