"use strict";

let coursesS = "Web Applications I, Computer Architectures, Data Science and Database Technology, Computer network technologies and services, Information systems security, Software engineering, System and device programming";

const courses = coursesS.split(",");
for(let i=0 ;i<courses.length;i++){
    courses[i] = courses[i].trim();
}

const acronysm = [...courses];
for(let i=0; i<acronysm.length; i++){
    const wordsCourse = acronysm[i].split(" ");
    acronysm[i]="";
    for(let word of wordsCourse){
        acronysm[i]+=word[0].toUpperCase();
    }
}

console.log(acronysm.sort())
