import { Memo } from '../types/home'
import  styles  from '../page.module.css'

export let MemoItem = ({memoItem, memos, setMemos} : {memoItem : Memo, memos: Memo[], setMemos : (memos:Memo[])=>void}) => {

    function removeMemo() {
        let newMemos = memos.filter((memo, i) => {
            if(memoItem.id !== memo.id) return memo
        })

        setMemos(newMemos);
    }

    return (
        <li className={styles.memoItem}>
            {memoItem.memo}
            <button onClick={removeMemo}>X</button> 
        </li>
    )

}