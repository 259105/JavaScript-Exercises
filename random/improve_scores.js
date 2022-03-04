"use strict";

const scores = [18, 22, 26, 30, 28, 27, 20];
const improved_scores = [...scores];

for(let i=0; i<2; i++){
    let lowest_pos=0;
    for(let j=0; j<improved_scores.length; j++){
        if(improved_scores[j]<improved_scores[lowest_pos])
            lowest_pos=j;
    }
    improved_scores.splice(lowest_pos,1);
}

console.log(scores);
console.log(improved_scores);

let sum=0;
for(let score of improved_scores)
    sum+=score;
const avg = Math.round(sum/improved_scores.length);
improved_scores.push(avg, avg);

console.log(scores);
console.log(improved_scores);