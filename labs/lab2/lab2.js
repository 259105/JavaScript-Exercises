"use strict";
const dayjs = require('dayjs');
const customParseFormat = require("dayjs/plugin/customParseFormat");
const isSameOrAfter = require("dayjs/plugin/isSameOrAfter");
const isSameOrBefore = require("dayjs/plugin/isSameOrBefore");
const { resolve } = require('path');
dayjs.extend(customParseFormat);
dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);
const sqlite = require("sqlite3");

function Film(id, title,isFavorite = false,/* date, rating */ ...pars){
    this.id = id;
    this.title = title;
    // this.isFavorite = isFavorite;
    // this.date = dayjs(date, "YYYY/MM/DD");
    // this.rating =rating;
    // optional parameters
    for(let i=0; i<pars.length;i++){
        let type = typeof(pars[i]);
        if(type=="string" && i==0)
            this.date = dayjs(pars[i],"YYYY-MM-DD");
        else if(type=="number" && i<=1) // can be first, second
            this.rating = pars[i];
        else
            console.log("Invalid parameters");
    }

    // default values
    this.isFavorite = !!isFavorite;
    this.date = this.date || dayjs("");

    this.print = () => console.log(`Id : ${this.id}, Title: ${this.title}, Favorite: ${this.isFavorite}, Watch date: ${this.date}, Score: ${this.rating}`);
}

function FilmLibrary(){
    this.films = [];
    this.db = undefined;

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
    // db interactions
    this.connectDB = (pathSQLite) => {
        this.db = new sqlite.Database(pathSQLite, (err) => {
            if(err)
                throw err;
        });
    }

    this.getAll = () => {
        return new Promise((resolve,reject) => {
            let sql = "SELECT * FROM films";
            this.db.all(sql,(err, rows) => {
                if(err)
                    reject(err);
                else
                    resolve(rows.map((row) => new Film(row.id,row.title,row.favorite,row.watchdate,row.rating)));
            })
        })
    }

    this.getFavorite = () => {
        return new Promise((resolve,reject) => {
            const sql = "SELECT * FROM films WHERE favorite=1;";
            this.db.all(sql,(err,rows) => {
                if(err)
                    reject(err);
                else
                    resolve(rows.map((row) => new Film(row.id,row.title,row.favorite,row.watchdate,row.rating)));
            })
        })
    }

    this.getWatchedToday = () => {
        return new Promise((resolve,reject) => {
            const sql = "SELECT * FROM films WHERE watchdate=?;";
            this.db.all(sql,[dayjs().format("YYYY-MM-DD")],(err,rows) => {
                if(err)
                    reject(err);
                else
                    resolve(rows.map((row) => new Film(row.id,row.title,row.favorite,row.watchdate,row.rating)));
            })
        })
    }

    this.getEarlierDate = (date) => {
        return new Promise((resolve,reject) => {
            const sql = "SELECT * FROM films WHERE watchdate<?;";
            this.db.all(sql,[date],(err,rows) => {
                if(err)
                    reject(err);
                else
                    resolve(rows.map((row) => new Film(row.id,row.title,row.favorite,row.watchdate,row.rating)));
            })
        })
    }

    this.getRating = (rate) => {
        return new Promise((resolve,reject) => {
            const sql = "SELECT * FROM films WHERE rating>=?;";
            this.db.all(sql,[rate],(err,rows) => {
                if(err)
                    reject(err);
                else
                    resolve(rows.map((row) => new Film(row.id,row.title,row.favorite,row.watchdate,row.rating)));
            })
        })
    }

    this.getTitle = (title) => {
        return new Promise((resolve,reject) => {
            const sql = "SELECT * FROM films WHERE title=?;";
            this.db.all(sql,[title],(err,rows) => {
                if(err)
                    reject(err);
                else
                    resolve(rows.map((row) => new Film(row.id,row.title,row.favorite,row.watchdate,row.rating)));
            })
        })
    }

    this.store = (film) => {
        return new Promise ((resolve, reject) => {
            const sql = "INSERT INTO films(id,title,favorite,watchdate,rating) VALUES (?,?,?,?,?);"
            this.db.run(sql,[film.id,film.title,film.isFavorite,film.date,film.rating], (err) => {
                if(err)
                    reject(false);
                else
                    resolve(true);
            })
        })
    }

    this.delete = (id) => {
        return new Promise ((resolve, reject) => {
            const sql = "DELETE FROM films WHERE id=?;"
            this.db.run(sql,[id], (err) => {
                if(err)
                    reject(false);
                else
                    resolve(true);
            })
        })
    }

    this.deleteDate = () => {
        return new Promise ((resolve, reject) => {
            const sql = "UPDATE films SET watchdate=NULL"
            this.db.run(sql, (err) => {
                if(err)
                    reject(false);
                else
                    resolve(true);
            })
        })
    }
}

async function main(){
    const library = new FilmLibrary();
    library.connectDB("./labs/lab2/films.db");
    console.log(await library.getAll());
    console.log(await library.getFavorite());
    console.log(await library.getWatchedToday());
    console.log(await library.getEarlierDate("2022-03-17"));
    console.log(await library.getRating(4));
    console.log(await library.getTitle("Matrix"));
    //console.log(await library.store(new Film(7,"Batman", "2022-03-30")));
    //console.log(await library.delete(7));
    console.log(await library.deleteDate());
    debugger;
}
main();
