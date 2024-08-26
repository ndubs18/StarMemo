import { MutableRefObject } from "react";
import { Memo, Nums } from "./types/home"

// * We tried to clean up page.txt by taking out event handler and placing them into closers
// let recordStartHandler = (recognition : SpeechRecognition | null, isVoiceActivated : MutableRefObject<boolean> ) => {
//   recognition?.addEventListener('start', (event : Event) => {
//     if(isVoiceActivated.current) console.log("listening from voice activated...")
//       else {
//         console.log("Listening from recording button...")}
//     },false)
// }

// let recordEndHandler = (recognition : SpeechRecognition | null, isVoiceActivated : MutableRefObject<boolean> ) => {
//   recognition?.addEventListener('speechend', (event : Event) => {
//     if(isVoiceActivated.current) {
//       console.log("Ending from voice activated")
//     }
//     else {
//     console.log("Ending recording")
//     }
//     },false)
// }

// let recordResultHandler = (recognition : SpeechRecognition | null, isVoiceActivated : MutableRefObject<boolean>, setMemoInputText : (memo : string) => void, setListening : (isListening : boolean) => void ) => {
//   recognition?.addEventListener('result', (event : SpeechRecognitionEvent) => {
//     if(isVoiceActivated.current) {
//       let recordBtn = document.getElementById("recordBtn");
//       let resetBtn = document.getElementById("reset")
//       let submitBtn = document.getElementById("submit");
//       let voiceActivateBtn = document.getElementById("voiceActivateBtn");
//       const word = event.results[0][0].transcript;
  
//       if(word === "record" || word == "note") {
//       console.log(`User said: ${word}`);
//       setTimeout(()=> {
//         if(isVoiceActivated) {
//           console.log(isVoiceActivated);
//         } 
//         recordBtn?.click()}, 1000);
//       }
//       else if (word === "reset" || word === "clear" ) {
//       console.log(`User said ${word}`);
//       setTimeout(()=> resetBtn?.click(), 1000);
//       }
//       else if (word === "submit" || word === "save") {
//       setTimeout(() => submitBtn?.click(), 1000);
//       }
//     }
//   else {
//   const words = event.results[0][0].transcript; 
//   setMemoInputText(words);
//   }

//   setListening(false);
//     },false)  
// }

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

//! Let's refator this at some point
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

    newDate = `${month}/${day}/${year} ${hoursString}:${minutesString}:${secondsString}`
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
  // export {formatDate, recordStartHandler, recordEndHandler, recordResultHandler}