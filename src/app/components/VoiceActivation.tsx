import {useState, useEffect, useCallback} from 'react';

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

function VoiceActivation({recognition, speechRecognitionList} : {recognition : any, speechRecognitionList : any}) {
    
    //const SpeechRecognitionEvent = window.SpeechRecognitionEvent || window.webkitSpeechRecognitionEvent;

    let voiceActivationEvent = new Event('customVoiceActivationEvent');

    let [isActivated, setIsActivated] = useState(false)
    
    if(typeof document !== "undefined") {
    //button elements
    let recordBtn = document.getElementById("recordBtn");
    let resetBtn = document.getElementById("reset")
    let submitBtn = document.getElementById("submit");
    let voiceActivateBtn = document.getElementById("voiceActivateBtn");

        const voiceActivateStart = useCallback(()=> {
            console.log("Listening from voice activated...") 
            
        }, [])

        const voiceActivateEnd = useCallback(()=> {       
            console.log("Ending recording from voice activated...")
            
        }, [])
        
        const voiceActivateResult = useCallback((event : SpeechRecognitionEvent) => {
        
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
        }, [])

    //voice activation
    voiceActivateBtn?.addEventListener('customVoiceActivationEvent', (event : Event) => {
    
        //grammar list config
        speechRecognitionList.addFromString(grammar,1);
        recognition.grammars = speechRecognitionList;
        recognition.continuous = false;
        recognition.lang = "en-US";
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;
    
        recognition.addEventListener("speechstart", voiceActivateStart);
        recognition.addEventListener("speechend", voiceActivateEnd);
        recognition.addEventListener("result", voiceActivateResult)
    
        recognition.addEventListener("nomatch", (event : Event) => {
            console.log("command not recognized");
        })
    
        try { 
            recognition?.start();
            } catch(e) {
              console.log(e);
            } 
        })
    }

   useEffect(() => {}, [])
   return (<button id="voiceActivateBtn" style={{marginTop: "15rem"}} onClick={!isActivated ? (e) => {
        setIsActivated(!isActivated);
        e.target.dispatchEvent(voiceActivationEvent);
        //recognition.start();
      } : () => {setIsActivated(!isActivated)}}>{!isActivated ? "Activate Voice Commands" : "Activated"}</button>
    )
}

export {VoiceActivation}