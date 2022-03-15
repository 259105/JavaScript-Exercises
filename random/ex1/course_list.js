"use strict";

const coursesS = "Web Applications I, Computer Architectures, Data Science and Database Technology, Computer network technologies and services, Information systems security, Software engineering, System and device programming";

const courses = coursesS.split(",");
for(let i=0 ;i<courses.length;i++){
    courses[i] = courses[i].trim();
}

const acronysm = [];
for(let course of courses){
    const wordsCourse = course.split(" ");
    let acro="";
    for(let word of wordsCourse){
        acro+=word[0];
    }
    acronysm.push(acro.toUpperCase());
}

console.log(acronysm.sort())
