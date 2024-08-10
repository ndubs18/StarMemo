'use client'

import { useState, useEffect } from 'react';
import { MemoItem } from './components/MemoItem'

//functions
import { formatDate } from './home';

import Image from "next/image";
import styles from "./page.module.css";

//types
import { Memo } from './types/home'

// ! We should look into using https://www.npmjs.com/package/@types/dom-speech-recognition for Web Speech Api types
declare global {
  interface Window {
    SpeechRecognition : any,
    webkitSpeechRecognition : any,
    SpeechGrammarList : any,
    webkitSpeechGrammarList : any,
    SpeechRecognitionEvent : any,
    webkitSpeechRecognitionEvent : any
  }
}

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();
// const SpeechGrammarList = window.SpeechGrammarList || window.webkitSpeechGrammarList;
// const SpeechRecognitionEvent = window.SpeechRecognitionEvent || window.webkitSpeechRecognitionEvent;


export default function Home() {

  let [memos, setMemos] = useState<Memo[]>([]);
  let [memoInputText, setMemoInputText] = useState('');

  function getInput(formData : any) {
    let id = memos.length;
    const input = formData.get('input');
    
    let newMemo : Memo = {
      id: id,
      memo: input,
      createdDate: formatDate(new Date())
    }
    setMemos([...memos, newMemo])
  }

  useEffect(() => {
    recognition.addEventListener("audiostart", (event : Event)=>{
      console.log("Listening...")
    })
    recognition.addEventListener("audioend", (event : Event)=>{
      console.log("Not listening")
    })
    recognition.addEventListener("result", (event : any) => {
      const words = event.results[0][0].transcript;
      let textElement = document.getElementsByName('input')[0];
      setMemoInputText(words);
    })
  }, [])

  return (
    <main className={styles.main}>
      <header>
        <h1 style = {{marginBottom: '5rem'}}>Welcome to StarMemo</h1>
      </header>
      
      <section>
        <div id={styles.memoForm}>
          <form action={getInput}>
            <label> Memo Input
            <textarea id={styles.memoText} name="input" value={memoInputText} onChange={e => setMemoInputText(e.target.value)} required></textarea>
            </label>
            <div id={styles.formBtns}>          
              <input type="button" id="recordBtn" value='record' onClick={()=> {
                recognition.start();
              }}></input>
              <input type="reset" value="reset" onClick={() => {setMemoInputText('')}}></input>
              <input type="submit" value="submit"></input>
            </div>
          </form>
        </div>
        <ul id={styles.memoList}>
          {memos?.map( memo => <MemoItem key={memo.id} memoItem={memo} memos={memos} setMemos={setMemos}></MemoItem>)}   
        </ul> 
      </section>
      <button style={{marginTop: "15rem"}}>Activate Voice</button>
      <footer></footer>
    </main>
  );
}
