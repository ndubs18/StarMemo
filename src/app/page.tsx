'use client'

import { useState, useEffect, useCallback, useRef } from 'react';
import { MemoItem } from './components/MemoItem'

//functions
import { formatDate, getNum, nums } from './home';

import styles from "./page.module.css";

//types
import { Memo } from './types/home'

const commands = [
  "record",
  "note",
  "reset",
  "clear",
  "submit",
  "save",
]

const grammar = `#JSGF V1.0; grammar commands; public <command> = ${commands.join(
" | "
)};`;

export default function Home() {

  let [memos, setMemos] = useState<Memo[]>([]);
  let [memoInputText, setMemoInputText] = useState(''); 
  let [listening, setListening] = useState(false);

  let recognitionRef = useRef<SpeechRecognition>();
  let speechRecognitionListRef = useRef<SpeechGrammarList>();
  let isVoiceActivated = useRef<boolean>(false);

  /*
  /// THIS IS OUR FULFILLMENT AND INTERACTION MODEL CODE
  */
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
        const result = event.results[0][0].transcript;
        let resultSplit = result.split(" ");
        
        if(resultSplit.length === 2) {
          let fullMemoIdToDelete = resultSplit[1]
          let memoIdToDelete = getNum(fullMemoIdToDelete as keyof typeof nums);
          if(resultSplit[0] === "delete" || resultSplit[0] === "remove") {
            setMemos(prevMemos => {
              return prevMemos.filter((memo, i) => memo.id + 1 !== memoIdToDelete)
            })
          }
        }
        else { 
          if(result == "record" || result == "note") {
          console.log(`User said: ${result}`);
          setTimeout(()=> {
            recordBtn?.click()}, 1000);
          }
          else if (result === "reset" || result === "clear" ) {
          console.log(`User said ${result}`);
          setTimeout(()=> resetBtn?.click(), 1000);
          }
          else if (result === "submit" || result === "save") {
          setTimeout(() => submitBtn?.click(), 1000);
          } 
          else {
            console.log("could not match")
          }
        }
    }
    else {
    const words = event.results[0][0].transcript; 
    setMemoInputText(words);
    }
  }, [])


  const onNoMatch = useCallback((event : SpeechRecognitionEvent) => {
    console.error("There was no match with what the user said and grammar list");
  }, [])

  const onError = useCallback((event : SpeechRecognitionErrorEvent) => {
    console.log(event.error)
  }, [])

  const onSpeechEnd = useCallback((event : Event) => {
    console.log("ending speech recognition");
    setListening(false);
    isVoiceActivated.current = false; 
    recognitionRef.current?.stop()
  }, [])

  recognitionRef.current?.addEventListener("start", recordStart);
  recognitionRef.current?.addEventListener("speechend", recordEnd)
  recognitionRef.current?.addEventListener("result", recordResult)  
  recognitionRef.current?.addEventListener("speechend", onSpeechEnd)
  recognitionRef.current?.addEventListener("nomatch", onNoMatch);
  recognitionRef.current?.addEventListener("error", onError);
   
  /* ---------- */

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
    
    recognitionRef.current = new webkitSpeechRecognition() || new SpeechRecognition();
    speechRecognitionListRef.current = new SpeechGrammarList();

    //grammar list config
    speechRecognitionListRef?.current.addFromString(grammar, 1)
    recognitionRef.current.grammars = speechRecognitionListRef.current;
    recognitionRef.current.continuous = false;
    recognitionRef.current.lang = "en-US";
    recognitionRef.current.interimResults = false;
    recognitionRef.current.maxAlternatives = 1;
    return () => {
      recognitionRef.current?.stop();
    }
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
                recognitionRef.current?.start();
              }}></input>
              <input type="reset" id="reset" value="reset" onClick={() => {setMemoInputText('')}}></input>
              <input type="submit" id="submit" value="submit"></input>
            </div>
          </form>
        </div>
        <ul id={styles.memoList}>
          {memos?.map( memo => <MemoItem key={memo.id} memoItem={memo} memos={memos} setMemos={setMemos}></MemoItem>)}   
        </ul> 
    </section>
    <h3>Click me to use a voice command!</h3>
    <p>Say somoething like &lsquo;record&rsquo; &lsquo;reset&rsquo; &lsquo;save&rsquo; or &lsquo;delete &lt;memo number&gt;&rsquo; to interact with StarMemo</p>
    <button id="voiceActivateBtn" style={{marginTop: "1.25rem"}} onClick={!isVoiceActivated.current ? () => { 
        isVoiceActivated.current = true;
        setListening(true);
        recognitionRef.current?.start();
      } : () => {
        isVoiceActivated.current = false;
        setListening(false);
        recognitionRef.current?.abort()
        //TODO: We need to add logic to display Activate only when isVoiceActivate == true && listenning == true
      }}>{!listening ? "Activate Voice Commands" : "Activated"}</button>
      <footer></footer>
    </main>
  );
  
}