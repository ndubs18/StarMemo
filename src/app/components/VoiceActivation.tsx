'use client'
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

  let num1 = 0.2;
  let num2 = 0.3;

function VoiceActivation({recognition, speechRecognitionList, isVoiceActivated, setIsVoiceActivated, recordEvent} : {recognition : any, speechRecognitionList : any, isVoiceActivated : boolean, setIsVoiceActivated : (isVoiceActivated : boolean) => void, recordEvent : Event}) {
    
    //const SpeechRecognitionEvent = window.SpeechRecognitionEvent || window.webkitSpeechRecognitionEvent;

    let voiceActivationEvent = new Event('customVoiceActivationEvent');

    // let [isActivated, setIsActivated] = useState(false)
    
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
 //       recognition.removeEventListener('start', voiceActivateStart);
  
    
        //grammar list config
        speechRecognitionList.addFromString(grammar,1);
        recognition.grammars = speechRecognitionList;
        recognition.continuous = false;
        recognition.lang = "en-US";
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;
    
        recognition.addEventListener("start", voiceActivateStart);
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
   return (<button id="voiceActivateBtn" style={{marginTop: "15rem"}} onClick={!isVoiceActivated ? (e) => {
        setIsVoiceActivated(!isVoiceActivated);
        window.dispatchEvent(recordEvent);
      } : () => {setIsVoiceActivated(!isVoiceActivated)}}>{!isVoiceActivated ? "Activate Voice Commands" : "Activated"}</button>
    )
}

export {VoiceActivation}