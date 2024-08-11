'use client'

import { useState, useEffect } from 'react';
import { MemoItem } from './components/MemoItem'

//functions
import { formatDate, setSpeechEventListeners } from './home';

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

// const SpeechGrammarList = window.SpeechGrammarList || window.webkitSpeechGrammarList;
// const SpeechRecognitionEvent = window.SpeechRecognitionEvent || window.webkitSpeechRecognitionEvent;


export default function Home() {

  //TODO: I don't really like these being variables (not constants), is there a better way to initialize these?
  //! When defining these globally we get the error "window" not defined and this was a temp workaround
  let SpeechRecognition = null;
  let recognition: any = null;
  let SpeechGrammarList  = null;
  let SpeechRecognitionEvent  = null;

  let [memos, setMemos] = useState<Memo[]>([]);
  let [memoInputText, setMemoInputText] = useState('');

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
    SpeechRecognition = window?.SpeechRecognition || window?.webkitSpeechRecognition;
    recognition = new SpeechRecognition();

    setSpeechEventListeners(recognition, setMemoInputText)
    
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
                //! we can add some logic to the result to determine whether it's a commant or just input text?
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
      <button style={{marginTop: "15rem"}} onClick={(e) => {
        console.log(e.target);
      }}>Activate Voice Commands</button>
      <footer></footer>
    </main>
  );
}
