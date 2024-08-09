'use client'

import { useState, useEffect } from 'react';

import { Memo } from './components/Memo'
//import { Navbar } from './components/Navbar';
import Image from "next/image";
import styles from "./page.module.css";


const memoList : string[] = [
  'This is memo1',
  'This is memo2',
  'This is memo3'
]

export default function Home() {

  let [memos, setMemos] = useState<string[] | null>(null);

  useEffect( () => {    
    setMemos([...memoList])
  },[])

  return (
    <main className={styles.main}>
      <header>
        <h1 style = {{marginBottom: '5rem'}}>Welcome to StarMemo</h1>
      </header>
      
      <section>
        <div id={styles.memoForm}>
          <form action="">
            <textarea id={styles.textarea}></textarea>
            <div id={styles.formBtns}>            
              <input type="button" id="recordBtn" value='record'></input>
              <input type="button" value='reset'></input>
              <input type="submit"></input>
            </div>
          </form>
        </div>
        <div id={styles.memoList}>
          {memos?.map( memo => <Memo memoString={memo}></Memo>)}   
        </div> 
      </section>

      <footer></footer>
    </main>
  );
}
