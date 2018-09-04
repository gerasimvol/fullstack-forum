<template>
  <div>
    <form class="form" @submit.prevent="onPostMsg" v-show="isFormVisible">
      <h3>Add message</h3>
      <div class="form-group">
        <label for="username">Username</label>
        <input type="text" class="form-control" id="username" v-model="newMsg.username">
      </div>
      <div class="form-group">
        <label for="imageURL">Image URL</label>
        <input type="text" class="form-control" id="imageURL" v-model="newMsg.imageURL">
      </div>
      <div class="form-group">
        <label for="subject">Subject</label>
        <input type="text" class="form-control" id="subject" v-model="newMsg.subject">
      </div>
      <div class="form-group">
        <label for="message">Message</label>
        <textarea class="form-control" id="message" rows="3" v-model="newMsg.message"></textarea>
      </div>
      <button type="submit" class="btn btn-primary">Fire!</button>
    </form>

    <button class="btn btn-primary" @click="toggleFormVisibility">Show/hide form</button>

    <ul class="list-unstyled posts">
      <li
        v-for="post in msgs"
        :key="`post-${post._id}`"
        class="media post"
      >
        <img class="mr-3 image" :src="post.imageURL" :alt="post.subject">
        <div class="media-body">
          <h4 class="mt-0 mb-1">{{ post.username }}</h4>
          <h6 class="mt-0 mb-1">{{ post.subject }}</h6>
          {{ post.message }}
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
  const API_URL = 'http://localhost:8081/msgs'

  export default {
    name: 'home',
    data () {
      return {
        isFormVisible: true,
        msgs: [],
        newMsg: {
          username: '',
          subject: '',
          message: '',
          imageURL: ''
        }
      }
    },
    methods: {
      toggleFormVisibility () {
        this.isFormVisible = !this.isFormVisible
      },
      async getMsgs () {
        const res = await fetch(API_URL)
        const { msgs } = await res.json()
        this.msgs = msgs
      },
      async onPostMsg () {
        try {
          const res = await fetch(API_URL, {
            method: 'POST',
            headers: {
              'content-type': 'application/json'
            },
            body: JSON.stringify(this.newMsg)
          })
          const updatedMsgs = await res.json()
          this.newMsg.subject = ''
          this.newMsg.message = ''
          this.msgs = [...updatedMsgs]
        } catch (err) {
          console.err(err)
        }
      }
    },
    created () {
      this.getMsgs()
    }
  }
</script>

<style scoped>
  .image {
    max-width: 100px;
  }

  .form {
    max-width: 500px;
    margin: 0 auto;
  }

  .post {
    padding: 10px;
    border-color:#333;
    border-width: 2px;
    border-style: solid;
    border-radius: 25px 25px 55px 5px/5px 55px 25px 25px;
    margin: 10px;
  }
</style>
