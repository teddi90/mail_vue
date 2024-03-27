<script>

import useKeyDown from "@/composables/use-keydown.js";

export default {
  name: "ModalView",
  setup(props,{emit}){
    useKeyDown([
        {key:'Escape',fn:()=>{emit('closeModal')}},
    ]);
    return{
      emit
    }
  }
}
</script>

<template>
 <div class="modal">
   <div class="overlay" @click="emit('closeModal')"></div>
   <div class="modal-card">
     <slot/>
   </div>
 </div>
</template>

