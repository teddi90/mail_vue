import {reactive} from "vue";
import axios from "axios";

let emails = reactive(new Set());
export const useEmailSelection = () => {
    let toggle = (email) => {
        if (emails.has(email)) {
            emails.delete(email)
        } else {
            emails.add(email)
        }
    }
    let clear=()=>{
        emails.clear();
    }
    let addMultiple=(newEmails)=>{
        newEmails.forEach(email=>{
            emails.add(email);
        })
    }
    let forSelection=(fn)=>{
        emails.forEach(email=>{
            fn(email)
            axios.put(`http://localhost:3000/emails/${email.id}`, email)
        })
    }
    let markRead=()=>forSelection(e=>e.read=true);
    let markUnread=()=>forSelection(e=>e.read=false);
    let markArchive=()=>{forSelection(e=>e.archived=true); emails.clear();}

    return {
        emails,
        toggle,
        clear,
        addMultiple,
        markRead,
        markUnread,
        markArchive
    }
}
export default useEmailSelection;
