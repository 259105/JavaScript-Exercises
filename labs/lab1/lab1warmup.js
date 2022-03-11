"use strict"

let words = ["ciao", "it", "cat", "spring","sucaminchia","?"];

function ex0(arrayString){
    for(let word of arrayString){
        let chars = [...word];
        let len = word.length;
        if(len<2){
            console.log("");
        } 
        else if(len==2){
            console.log(word+word);
        }else if(len==3){
            chars.splice(1,0,chars[1]);
            console.log(chars.join(""));
        }else{
            chars.splice(2,word.length-4)
            console.log(chars.join(""));
        }
    }
}

ex0(words);