import { Memo } from "./types/home"


const commands = [
  "record",
  "note",
  "reset",
  "clear",
  "submit",
  "save",
]

const grammar = `#JSGF V1.0; grammar colors; public <commands> = ${commands.join(
  " | ",
)};`;

let webSpeechInit= (recognition : any, speechRecognitionList : any, isActivated : boolean, setMemoInputText : (memos : string) => void, setIsActivated : (isActivated : boolean) => void) => {


      //button elements
      let recordBtn = document.getElementById("recordBtn");
      let resetBtn = document.getElementById("reset")
      let submitBtn = document.getElementById("submit");
      let voiceActivateBtn = document.getElementById("voiceActivateBtn");

      //record
      recordBtn?.addEventListener("customRecordEvent", (event : Event) => {
      console.log("initiated by record button...");
      
      recognition.addEventListener("audiostart", function recordStart(event : Event) {
        console.log("Listening from recording button...")
        removeEventListener('audiostart', recordStart)
      
      })

      recognition.addEventListener("audioend", function recordEnd(event : Event) {
        console.log("Ending recording...")
        removeEventListener('audiostart', recordEnd)
      })

      recognition.addEventListener("result", function recordResult(event : any) {
        const words = event.results[0][0].transcript;
        setMemoInputText(words);
        removeEventListener('audiostart', recordResult)
      })
      
      recognition.start();
    });
    
    //voice activation
    voiceActivateBtn?.addEventListener('customVoiceActivationEvent', (event : Event) => {
      
      //grammar list config
      speechRecognitionList.addFromString(grammar,1);
      recognition.grammars = speechRecognitionList;
      recognition.continuous = false;
      recognition.lang = "en-US";
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      recognition.addEventListener("audiostart", function voiceActivateStart(event : Event) {
        console.log("Listening from voice activated...") 
        removeEventListener('audiostart', voiceActivateStart)
      
      })

      recognition.addEventListener("audioend", function voiceActivateEnd(event : Event) {
        console.log("Ending recording from voice activated...")
        removeEventListener('audiostart', voiceActivateEnd); 
      })

      recognition.addEventListener("result", function voiceActivateResult(event : any) { 
        const word = event.results[0][0].transcript;

        if(word === "record" || word == "note") {
          console.log(`User said: ${word}`);
          setTimeout(()=> recordBtn?.click(), 1000);
        }
        else if (word === "reset" || word === "clear" ) {
          console.log(`User said ${word}`);
          setTimeout(()=> resetBtn?.click(), 1000);
        }
        else if (word === "submit" || word === "save") {
          setTimeout(() => submitBtn?.click(), 1000);
        }
        //voiceActivateBtn.click();
        removeEventListener('result', voiceActivateResult);
      })

      recognition.addEventListener("nomatch", (event : Event) => {
        console.log("command not recognized");
      })

      recognition.start();
    })

}

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



  export {formatDate, webSpeechInit}