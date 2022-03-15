"use strict";
const dayjs = require("dayjs");
const customParseFormat = require('dayjs/plugin/customParseFormat')
const isAfter = require("dayjs/plugin/isSameOrAfter")
dayjs.extend(isAfter);
dayjs.extend(customParseFormat)
const sqlite = require("sqlite3");

function Exam(code, name, cfu, score, date){
    this.code = code;
    this.name = name;
    this.cfu = cfu;
    this.score = score;
    this.date = dayjs(date,"YYYY-MM-DD");
}

function ExamList(pathSQLite){
    const db  = new sqlite.Database(pathSQLite,(err) => {
        if(err){
            console.log("Error creating DB");
        }
    })

    this.add = (exam) => {
        return new Promise((resolve,reject) => {
            const sql = "INSERT INTO exam(code,name,cfu,date,score) VALUES (?,?,?,?,?);";
            db.run(sql,[exam.code,exam.name,exam.cfu,exam.date.format("YYYY-MM-DD"),exam.score],(err) => {
                if(err) 
                    reject(err);
                else
                    resolve("correctly added");
            })
        })
    }

    this.getAll = () => {
        return new Promise((resolve, reject) => {
            const sql = "SELECT * FROM exam";
            db.all(sql,(err,rows) => {
                if(err)
                    reject(err);
                else
                    resolve(rows.map((row) => new Exam(row.code,row.name,row.cfu, row.score,row.date)));
            })
        })
    }

    this.find = (courseCode) => {
        return new Promise((resolve, reject) => {
            const sql="SELECT * FROM exam e WHERE e.code=?";
            db.all(sql,[courseCode],(err,rows) => {
                if(err)
                    reject(err);
                else
                    resolve(rows.map((row) => new Exam(row.code,row.name,row.cfu, row.score,row.date))[0]);
            })
        })
    }

    this.afterDate = (date) => {
        return new Promise((resolve, reject) => {
            const sql="SELECT * FROM exam e WHERE date>?";
            db.all(sql,[date],(err,rows) => {
                if(err)
                    reject(err);
                else
                    resolve(rows.map((row) => new Exam(row.code,row.name,row.cfu, row.score,row.date)));
            })
        })
    }

    this.getWorst = (num) => {
        return new Promise((resolve,reject) => {
            let sql="SELECT * FROM exam e WHERE e.score<>\"NULL\" ORDER BY e.score LIMIT ?";
            db.all(sql,[num],(err,rows) => {
                if(err) reject(err);
                else resolve(rows.map(row => new Exam(row.code,row.name,row.cfu, row.score,row.date)))
            })
        })
    }
}

async function main(){
    const examList = new ExamList("./random/ex3/transcript.sqlite");
    try{
        let message = await examList.add(new Exam('ZZZZZ5', 'title', 6, 24, '2021-09-01'));
        console.log(message);
    }catch(err){
        console.log("Error adding a new exam:",err);
    }

    const exams = await examList.getAll();
    console.log(exams);

    const exam = await examList.find("01TXYOV");
    console.log(exam);

    console.log(await examList.afterDate("2022-01-01"));

    console.log(await examList.getWorst(3));

    debugger;
}

main();