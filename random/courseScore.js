"use strict";

function Exam(code, name, cfu, score, date){
    this.code = code;
    this.name = name;
    this.cfu = cfu;
    this.score = score;
    this.date = date;
}

function ExamList(){
    const examslist = [];
    return {
        add : (exam) => examslist.push(exam),
        find : (course_code) => {
            for(let exam of examslist)
                if(exam.code==course_code)
                    return exam;
        },
        afterDate : function(date) {
            const returnList = [];
            for(let exam of examslist)
                if(exam.date > date)
                    returnList.push(exam);
            return returnList;
        },
        listByDate : () => {
            const returnList = [...examslist];
            return returnList.sort((e1,e2) => e1.date - e2.date);
        },
        listByScore : () => {
            const returnList = [...examslist];
            return returnList.sort((e1,e2) => e1.score - e2.score);
        },
        average: () => {
            let sumScoreWeigh = 0.0;
            let sumCfu = 0;
            for(let exam of examslist){
                sumScoreWeigh += exam.score*exam.cfu;
                sumCfu += exam.cfu;
            }
            return sumScoreWeigh/sumCfu;
        }
    };
}

const e1 = new Exam(1, "c1", 8, 25, "2022/01/26");
const e2 = new Exam(2, "c2", 10, 30, "2022/02/07");
const e3 = new Exam(3, "c3", 8, 25, "2022/01/30");
const e4 = new Exam(4, "c4", 10, 30, "2022/02/12");

const exlist = new ExamList();
exlist.add(e1);
exlist.add(e2);
exlist.add(e3);
exlist.add(e4);

console.log(exlist.average());