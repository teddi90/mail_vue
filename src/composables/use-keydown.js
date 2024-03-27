import {onBeforeUnmount} from "vue";
let useKeyDown=(keyCombos)=>{
    let keyDown=(event)=>{
        let kc=keyCombos.find(kc=>kc.key===event.key);
        if(kc){
            kc.fn();
        }
    }
    window.addEventListener('keydown',keyDown);
    onBeforeUnmount(()=>{
        window.removeEventListener('keydown',keyDown)
    })
}
export default useKeyDown;