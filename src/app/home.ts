import { Memo } from "./types/home"

let setSpeechEventListeners = (recognition : any, setMemoInputText : (memos : string) => void) => {
    
      let recordBtn = document.getElementById('recordBtn');
      let voiceActivatedBtn = document.getElementById('voiceActivateBtn');
      recordBtn?.addEventListener("customRecordEvent", (event : Event) => {
      console.log("initiated by record button...");
      
      recognition.addEventListener("audiostart", (event : Event) => {
        console.log("Listening from recording button...")
        let {target} = event;
        console.log(target);
      
      })
      recognition.addEventListener("audioend", (event : Event) => {
        console.log("Ending recording...")
      })
      recognition.addEventListener("result", (event : any) => {
        const words = event.results[0][0].transcript;
        setMemoInputText(words);
      })
      
      recognition.start();
    });

    voiceActivatedBtn?.addEventListener('customVoiceActivationEvent', (event : Event) => {

      recognition.addEventListener("audiostart", (event : Event) => {
        console.log("Listening from voice activated...")
        let {target} = event;
        console.log(target);
      
      })
      recognition.addEventListener("audioend", (event : Event) => {
        console.log("Ending recording from voice activated...")
      })
      recognition.addEventListener("result", (event : any) => {
        const words = event.results[0][0].transcript;
        console.log(words);
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



  export {formatDate, setSpeechEventListeners}