import { Nums } from "./types/home"

const nums : Nums = {
  one: 1,
  two: 2,
  three: 3,
  four: 4,
  five: 5,
  six: 6,
  seven: 7,
  eight: 8,
  nine: 9,
  ten: 10
};

//! Let's refactor this at some point
let formatDate = (date : Date) => {
    let newDate = '';
    let month = date.getMonth() + 1;
    let day = date.getDate();
    let year = date.getFullYear();

    //time
    let hours = date.getHours();
    let minutes = date.getMinutes();
    let seconds = date.getSeconds();

    let monthString = month.toString();
    let dayString = day.toString();
    let yearString = year.toString();
    
    let hoursString = hours.toString();
    if(hours < 10) {
      hoursString = '0' + hoursString;
    }
    
    let minutesString = minutes.toString();
    if(minutes < 10) {
        minutesString = '0' + minutesString;
    }

    let secondsString = seconds.toString();
    if(seconds < 10) {
        secondsString = '0' + secondsString;
    }

    newDate = `${monthString}/${dayString}/${yearString} ${hoursString}:${minutesString}:${secondsString}`
    return newDate;

  }

  let getNum = (speechNum : keyof typeof nums) => {
    if(!nums[speechNum]) {
      return 0;
    }
    
    else {
      return nums[speechNum];
    }

  }

export {formatDate, getNum, nums}