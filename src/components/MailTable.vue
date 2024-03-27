<script>
import {format} from "date-fns";
import axios from "axios";
import MailView from "@/components/MailView.vue";
import ModalView from "@/components/ModalView.vue";
import useEmailSelection from "@/composables/use-email-selection.js";
import BulkActionBar from "@/components/BulkActionBar.vue";
import {ref} from "vue";

export default {
  name: 'MailTable',
  components: {BulkActionBar, ModalView, MailView},
  data() {
    let emails

    return {
      emails,
      format,
      openedEmail: null,
      emailSelection:useEmailSelection(),
      selectedScreen:ref('inbox')
    }
  },
  computed: {
    sortedEmails() {
      return this.emails.sort((e1, e2) => {
        return e1.sentAt < e2.sentAt ? 1 : -1;
      })
    },
    filteredEmails() {
      if(this.selectedScreen==='inbox'){
        return this.sortedEmails.filter(e => !e.archived);
      }else {
        return this.sortedEmails.filter(e => e.archived);
      }

    }
  },
  methods: {
    selectScreen(newScreen){
      this.selectedScreen=newScreen;
      this.emailSelection.emails.clear();
    },
    openEmail(email) {
      email.read = true;
      this.updateEmail(email);
      this.openedEmail = email;
    },
    archiveEmail(email) {
      email.archived = true;
      this.updateEmail(email);
    },
    updateEmail(email) {
      axios.put(`http://localhost:3000/emails/${email.id}`, email)
    },
    async getEmail() {
      const response = await axios.get('http://localhost:3000/emails');
      this.emails = response.data;
    },
    changeEmail({toggleRead, toggleArchive, save, closeModal, changeIndex}) {
      let email = this.openedEmail;
      if (toggleRead) {
        email.read = !email.read
      }
      if (toggleArchive) {
        email.archived = !email.archived
      }
      if (save) {
        this.updateEmail(email)
      }
      if (closeModal) {
        this.openedEmail = null
      }

      if (changeIndex) {
        let emails = this.filteredEmails
        let currentIndex = emails.indexOf(this.openedEmail)
        this.openedEmail = emails[currentIndex + changeIndex];
      }
    }
  },
  mounted() {
    this.getEmail()
  }
};
</script>

<template>
  <button @click="selectScreen('inbox')"
          :disabled="selectedScreen==='inbox'"
  >Inbox</button>
  <button @click="selectScreen('archive')"
          :disabled="selectedScreen==='archive'"
  >Archived</button>
  <BulkActionBar v-if="emails" :emails="filteredEmails"/>
  <table class="mail-table">
    <tbody v-if="emails">
      <tr v-for="email in filteredEmails"
          :key="email.id"
          :class="['clickable', email.read ? 'read' : '']"

      >
        <td>
          <input type="checkbox"
                 @click="emailSelection.toggle(email)"
                 :checked="emailSelection.emails.has(email)"/>
        </td>
        <td @click="openEmail(email)">{{ email.from }}</td>
        <td @click="openEmail(email)">
          <p><strong>{{ email.subject }}</strong> - {{ email.body }}</p>
        </td>
        <td @click="openEmail(email)" class="date">{{ format(new Date(email.sentAt), 'MMM do yyyy') }}</td>
        <td>
          <button @click="archiveEmail(email)">Archive</button>
        </td>
      </tr>
    </tbody>
  </table>
  <ModalView v-if="openedEmail" @closeModal="openedEmail=null">
    <MailView :email="openedEmail" @changeEmail="changeEmail"/>
  </ModalView>
</template>