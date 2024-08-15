'use client'

import { useState, useEffect, useCallback, useRef } from 'react';
import { MemoItem } from './components/MemoItem'

//functions
import { formatDate } from './home';

import Image from "next/image";
import starIcon from "../../public/Free White Shiny Star Vector.svg"
import styles from "./page.module.css";

//types
import { Memo } from './types/home'
//import { VoiceActivation } from './components/VoiceActivation';

const commands = [
  "record",
  "note",
  "reset",
  "clear",
  "submit",
  "save",
]

const grammar = `#JSGF V1.0; grammar colors; public <commands> = ${commands.join(
" | "
)};`;


//grammar list config
// speechRecognitionList.addFromString(grammar,1);
// recognition.grammars = speechRecognitionList;
// recognition.continuous = false;
// recognition.lang = "en-US";
// recognition.interimResults = false;
// recognition.maxAlternatives = 1;

export default function Home() {

// let SpeechRecognition = window?.SpeechRecognition || window.webkitSpeechRecognition;
// let SpeechGrammarList = window?.SpeechGrammarList || window.webkitSpeechGrammarList;
//const SpeechRecognitionEvent = window?.SpeechRecognitionEvent || window.webkitSpeechRecognitionEvent;

  let [memos, setMemos] = useState<Memo[]>([]);
  let [memoInputText, setMemoInputText] = useState(''); 
  let [recognition, setRecognitnion] = useState<SpeechRecognition | null>(null);
  let [speechRecognitionList, setSpeechRecognitionList] = useState<SpeechGrammarList | null >(null);
  let [listening, setListening] = useState(false);

  //TODO: Try initializing a ref instead of state variable
  // let recognitionRef = useRef(null);
  // let speechRecognitionListRef = useRef(null);

  let isVoiceActivated = useRef<boolean>(false);

//! We can just uncomment these and event listener on 107 to bring back to what we had before. Trying to use closures
//! to clean things up
  const recordStart = useCallback((event:Event) => {
  if(isVoiceActivated.current) console.log("listening from voice activated...")
  else {
    console.log("Listening from recording button...");}
 }, [])

  const recordEnd = useCallback((event : Event) => {

    if(isVoiceActivated.current) {
      console.log("Ending from voice activated")
    }
    else {
    console.log("Ending recording")
    }
   }, [])

  const recordResult = useCallback((event : SpeechRecognitionEvent) => { 
    if(isVoiceActivated.current) {
        let recordBtn = document.getElementById("recordBtn");
        let resetBtn = document.getElementById("reset")
        let submitBtn = document.getElementById("submit");
        let voiceActivateBtn = document.getElementById("voiceActivateBtn");
        const word = event.results[0][0].transcript;
    
        if(word == "record" || word == "note") {
        console.log(`User said: ${word}`);
        setTimeout(()=> {
          if(isVoiceActivated.current) {
            console.log("transitioning")
          } 
          recordBtn?.click()}, 1000);
        }
        else if (word === "reset" || word === "clear" ) {
        console.log(`User said ${word}`);
        setTimeout(()=> resetBtn?.click(), 1000);
        }
        else if (word === "submit" || word === "save") {
        setTimeout(() => submitBtn?.click(), 1000);
        }
    }
    else {
    const words = event.results[0][0].transcript; 
    setMemoInputText(words);
    }

    setListening(false);
     
  }, [])
  //clusres for trying to clean up event handlers ^
  // recordStartHandler(recognition, isVoiceActivated)
  // recordEndHandler(recognition, isVoiceActivated);
  // recordResultHandler(recognition, isVoiceActivated, setMemoInputText, setListening)

  recognition?.addEventListener("start", recordStart);
  recognition?.addEventListener("speechend", recordEnd)
  recognition?.addEventListener("result", recordResult)  

  recognition?.addEventListener("nomatch", (e) => {
    console.log("No match!?!?!?")})
   
  function addMemo(formData : any) {
    let id = memos.length;
    const input = formData.get('memoInput');
    
    let newMemo : Memo = {
      id: id,
      memo: input,
      createdDate: formatDate(new Date())
    }
    setMemoInputText('');
    setMemos((memos) => {
      return [...memos, newMemo]})
  }
  
  useEffect(() => { 
    const SpeechRecognition = window?.SpeechRecognition || window?.webkitSpeechRecognition;
    const SpeechGrammarList = window?.SpeechGrammarList || window.webkitSpeechGrammarList;
    setRecognitnion(new SpeechRecognition());
    setSpeechRecognitionList(new SpeechGrammarList());
  }, [])

  return (
    <main className={styles.main}>
      <header>
        <h1 style = {{marginBottom: "3rem"}}>Welcome to StarMemo</h1>
      </header>
      <h2 style={{height: '3rem', color: 'red', marginBottom: '1rem'}}>{listening ? "Listening..." : ""}</h2> 
      <section style={{marginBottom: "10rem"}}>
        <div id={styles.memoForm}>
          <form action={addMemo}>
            <textarea id={styles.memoText} name="memoInput" value={memoInputText} onChange={e => {setMemoInputText(e.target.value)
            }} placeholder = "Type or record your memo..." required></textarea>
            <div id={styles.formBtns}>          
              <input type="button" id="recordBtn" value='record' onClick={(e)=> {
                isVoiceActivated.current = false;
                setListening(true);
                recognition?.start();
                //window?.dispatchEvent(recordEvent);   
              }}></input>
              <input type="reset" id="reset" value="reset"onClick={() => {setMemoInputText('')}}></input>
              <input type="submit" id="submit" value="submit"></input>
            </div>
          </form>
        </div>
        <ul id={styles.memoList}>
          {memos?.map( memo => <MemoItem key={memo.id} memoItem={memo} memos={memos} setMemos={setMemos}></MemoItem>)}   
        </ul> 
    </section>
    <h3>Click me to use a voice command!</h3>
    <p>Say somoething like 'record' 'reset' or 'save' to interact with StarMemo</p>
    <button id="voiceActivateBtn" style={{marginTop: "1.25rem"}} onClick={!isVoiceActivated.current ? () => { 
        isVoiceActivated.current = true;
        setListening(true);
        recognition?.start();
        //window?.dispatchEvent(recordEvent);
      } : () => {
        isVoiceActivated.current = false;
      }}>{!listening ? "Activate Voice Commands" : "Activated"}</button>
      <footer></footer>
    </main>
  );
  
}