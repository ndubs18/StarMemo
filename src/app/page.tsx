'use client'

import { useState, useEffect } from 'react';

import { MemoItem } from './components/MemoItem'

//import { Navbar } from './components/Navbar';
import Image from "next/image";
import styles from "./page.module.css";

//types
import { Memo } from './types/home'

export default function Home() {

  let [memos, setMemos] = useState<Memo[]>([]);

  useEffect( () => {    
    // setMemos([...memoList])
  },[])


  function getInput(formData : any) {
    let id = memos.length;
    const input = formData.get('input');
    
    let newMemo : Memo = {
      id: id,
      memo: input
    }
    setMemos([...memos, newMemo])
  }

  return (
    <main className={styles.main}>
      <header>
        <h1 style = {{marginBottom: '5rem'}}>Welcome to StarMemo</h1>
      </header>
      
      <section>
        <div id={styles.memoForm}>
          <form action={getInput} method="POST">
            <label htmlFor='memoText'>Memo input:</label>
            <textarea id={styles.memoText} name="input" required></textarea>
            <div id={styles.formBtns}>          
              <input type="button" id="recordBtn" value='record'></input>
              <input type="reset" value="reset"></input>
              <input type="submit" value="submit"></input>
            </div>
          </form>
        </div>
        <div id={styles.memoList}>
          {memos?.map( memo => <MemoItem key={memo.id} memoItem={memo} memos={memos} setMemos={setMemos}></MemoItem>)}   
        </div> 
      </section>
      <button style={{marginTop: "15rem"}}>Activate Voice</button>
      <footer></footer>
    </main>
  );
}
