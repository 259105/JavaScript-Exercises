"use strict";

function Film(id, title,/*isFavorite, date, rating */ ...pars){
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
        //else
            //console.log("Invalid parameters");
    }

    // default values
    this.isFavorite = this.isFavorite || false;
    this.date = this.date || dayjs("");

    this.print = () => console.log(`Id : ${this.id}, Title: ${this.title}, Favorite: ${this.isFavorite}, Watch date: ${this.date}, Score: ${this.rating}`);

    this.getDate = () => {
        return this.date.format("MMMM DD, YYYY");
    }
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
        this.films = this.films.filter((f) => f.id !== deletingFilmId);
        return this;
    };
    this.resetWatchedFilms = () => {
        this.films.forEach(f => f.date = dayjs(""));
        return this;
    };

    // actions
    this.print = () => this.films.forEach( (film) => film.print() );
    this.sortByDate = () => {
        return this.films
            .filter((film) => true) // for avoiding sorting in place
            .sort((f1,f2) =>{
                if(!f1.date.isValid() && !f2.date.isValid()) return f1.id-f2.id;
                if(!f1.date.isValid()) return 1;
                if(!f2.date.isValid()) return -1;
                return f1.date.isSameOrAfter(f2) ? -1 : 1;
            });
    };
    this.seenLastMonth = () => {
        return this.films
            .filter((film) => dayjs().diff(film.date,"M")<=1 )
    }
    this.getRated = () => {
        return this.films.filter((film) => film.rating!=undefined)
            .sort((f1,f2) => -(f1.rating-f2.rating));
    };
    this.get5Stars = () => {
        return this.films.filter((film) => film.rating==5);
    }
    this.getFavorite = () => {
        return this.films
            .filter((film) => film.isFavorite);
    }
    this.getAll = () => {
        return this.films;
    }

    // db interactions
    this.connectDB = (pathSQLite) => {
        this.db = new sqlite.Database(pathSQLite, (err) => {
            if(err)
                throw err;
        });
    }

    this.getAllDB = () => {
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

    this.getFavoriteDB = () => {
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
    // const library = new FilmLibrary();
    // library.connectDB("./labs/lab2/films.db");
    // console.log(await library.getAll());
    // console.log(await library.getFavorite());
    // console.log(await library.getWatchedToday());
    // console.log(await library.getEarlierDate("2022-03-17"));
    // console.log(await library.getRating(4));
    // console.log(await library.getTitle("Matrix"));
    // //console.log(await library.store(new Film(7,"Batman", "2022-03-30")));
    // //console.log(await library.delete(7));
    // console.log(await library.deleteDate());
    // debugger;
}

main();
