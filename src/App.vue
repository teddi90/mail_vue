<template>
  <h1>VMail Inbox</h1>
      <MailTable/>
</template>

<script>
import MailTable from "@/components/MailTable.vue";
import useEmailSelection from "@/composables/use-email-selection.js";
export default {
  name: 'App',
  components: {MailTable},
  setup(){
    return {
      emailSelection:useEmailSelection()
    }
  },

};
</script>
