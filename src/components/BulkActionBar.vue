<script>
import useEmailSelection from "@/composables/use-email-selection.js";
import {computed} from "vue";

export default {
  name: "BulkActionBar",
  props: {
    emails: {
      type: Array,
      required: true
    }
  },
  setup(props) {
    let emailSelection = useEmailSelection();
    let numberSelected = computed(() => emailSelection.emails.size);
    let numberEmails =computed(()=>props.emails.length);
    let allEmailsSelected = computed(() => {
      return numberSelected.value === numberEmails.value;
    });
    let someEmailsSelected = computed(() => {
      return numberSelected.value > 0 && numberSelected.value < numberEmails.value
    });
    const bulkSelect = () => {
      if (allEmailsSelected.value) {
        emailSelection.clear();
      } else {
        emailSelection.addMultiple(props.emails);
      }
    }
    return {
      allEmailsSelected,
      someEmailsSelected,
      emailSelection,
      numberSelected,
      bulkSelect
    }
  }
}
</script>

<template>
  <div class="bulk-action-bar">
    <span class="checkbox">
      <input type="checkbox"
         @click="bulkSelect"
         :checked="allEmailsSelected"
         :class="[someEmailsSelected ? 'partial-check' :'' ]"/>
    </span>
    <span class="buttons">
      <button @click="emailSelection.markRead()"
              :disabled="[...emailSelection.emails].every(e=>e.read)"
      >Mark Read</button>
      <button @click="emailSelection.markUnread()"
              :disabled="[...emailSelection.emails].every(e=>!e.read)"
      >Mark Unread</button>
      <button @click="emailSelection.markArchive()"
              :disabled="numberSelected===0"
      >Archive</button>
    </span>
  </div>
</template>
