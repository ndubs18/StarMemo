'use client'

import { useState, useEffect, useCallback } from 'react';
import { MemoItem } from './components/MemoItem'

//functions
import { formatDate, webSpeechInit } from './home';

import Image from "next/image";
import styles from "./page.module.css";

//types
import { Memo } from './types/home'
import { VoiceActivation } from './components/VoiceActivation';

// ! We should look into using https://www.npmjs.com/package/@types/dom-speech-recognition for Web Speech Api types


export default function Home() {

// let SpeechRecognition = window?.SpeechRecognition || window.webkitSpeechRecognition;
// let SpeechGrammarList = window?.SpeechGrammarList || window.webkitSpeechGrammarList;
//const SpeechRecognitionEvent = window?.SpeechRecognitionEvent || window.webkitSpeechRecognitionEvent;

let recordEvent = new Event('customRecordEvent');

  //button elements

  if(typeof document !== "undefined") {
  let recordBtn = document.getElementById("recordBtn");
  let resetBtn = document.getElementById("reset")
  let submitBtn = document.getElementById("submit");
  let voiceActivateBtn = document.getElementById("voiceActivateBtn");

  const recordStart = useCallback((event:Event) => {       
  console.log("Listening from recording button...")
 }, [])

  const recordEnd = useCallback((event : Event) => {
    console.log("Ending recording...")
    //recognition?.stop();
   }, [])

  const recordResult = useCallback((event : SpeechRecognitionEvent) => { 
      const words = event.results[0][0].transcript; 
      setMemoInputText(words)
     
    }, [])

  recordBtn?.addEventListener("customRecordEvent", (event : Event) => {
    console.log("initiated by record button...");

    recognition?.addEventListener("speechstart", recordStart);
    
    recognition?.addEventListener("speechend", recordEnd)

    recognition?.addEventListener("result", recordResult)

    try { 
    recognition?.start();
    } catch(e) {
      console.log(e);
    } 
  });
  }
  

  let [memos, setMemos] = useState<Memo[]>([]);
  let [memoInputText, setMemoInputText] = useState(''); 
  // let [recognition, setRecognitnion] = useState<SpeechRecognition>(new SpeechRecognition());
  // let [speechRecognitionList, setSpeechRecognitionList] = useState<SpeechGrammarList>(new SpeechGrammarList());
  let [recognition, setRecognitnion] = useState<SpeechRecognition | null>(null);
  let [speechRecognitionList, setSpeechRecognitionList] = useState<SpeechGrammarList | null >(null);
  //let [isActivated, setIsActivated] = useState(false);



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
    //this sets event handlers with custom event depending on recording or voice activation
    //webSpeechInit(recognition, speechRecognitionList, isActivated, setMemoInputText, setIsActivated)
    const SpeechRecognition = window?.SpeechRecognition || window?.webkitSpeechRecognition;
    const SpeechGrammarList = window?.SpeechGrammarList || window.webkitSpeechGrammarList;
    setRecognitnion(new SpeechRecognition());
    setSpeechRecognitionList(new SpeechGrammarList());
  }, [])

  return (
    <main className={styles.main}>
      <header>
        <h1 style = {{marginBottom: '5rem'}}>Welcome to StarMemo</h1>
      </header>
      
      <section>
        <div id={styles.memoForm}>
          <form action={addMemo}>
            <textarea id={styles.memoText} name="memoInput" value={memoInputText} onChange={e => setMemoInputText(e.target.value)} placeholder = "Type or record your memo..." required></textarea>
            <div id={styles.formBtns}>          
              <input type="button" id="recordBtn" value='record' onClick={(e)=> {
                //! This tells us the record button was hit
                console.log(e.target);
                //! This will trigger the audiostart event (handler in ./home.ts) maybe
                //! we can add some logic to the result to determine whether it's a command or just input text?
                // recognition.start();
                e.target.dispatchEvent(recordEvent);   
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
      {/* <button id="voiceActivateBtn" style={{marginTop: "15rem"}} onClick={!isActivated ? (e) => {
        setIsActivated(!isActivated);
        e.target.dispatchEvent(voiceActivationEvent);
      } : () => {setIsActivated(!isActivated)}}>{!isActivated ? "Activate Voice Commands" : "Activated"}</button> */}

      <VoiceActivation recognition={recognition} speechRecognitionList={speechRecognitionList}/>
      <footer></footer>
    </main>
  );
  
}