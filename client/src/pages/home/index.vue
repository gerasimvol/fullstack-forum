<template>
  <div class="page">
    <form class="form" @submit.prevent="onPostMsg" v-show="isFormVisible">
      <h3>Add message</h3>
      <div class="form-group">
        <label for="username">Username</label>
        <input type="text" class="form-control" id="username" v-model="newMsg.username">
      </div>
      <div class="form-group">
        <label for="imageURL">Image URL</label>
        <input type="url" class="form-control" id="imageURL" v-model="newMsg.imageURL">
      </div>
      <div class="form-group">
        <label for="subject">Subject</label>
        <input type="text" class="form-control" id="subject" v-model="newMsg.subject" required>
      </div>
      <div class="form-group">
        <label for="message">Message</label>
        <textarea class="form-control" id="message" rows="3" v-model="newMsg.message" required></textarea>
      </div>
      <button type="submit" class="btn btn-primary">Fire!</button>

      <div v-if="error" class="alert alert-danger">
        <strong>Invalid post!</strong> {{ error }}
      </div>
    </form>

    <div class="posts-wrapper">
      <button class="btn btn-primary" @click="toggleFormVisibility">Show/hide form</button>
      <div class="posts">
        <ul class="list-unstyled">
          <li
            v-for="post in msgsReversed"
            :key="`post-${post._id}`"
            class="media post"
          >
            <img class="mr-3 image" :src="post.imageURL" :alt="post.subject">
            <div class="media-body">
              <h4 class="mt-0 mb-1">{{ post.username }}</h4>
              <h6 class="mt-0 mb-1">{{ post.subject }}</h6>
              {{ post.message }}
              <div>
                <small>{{ post.created }}</small>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
  const API_URL = 'https://fullstack-forum.herokuapp.com/msgs'
  // const API_URL = 'http://localhost:8081/msgs'

  export default {
    name: 'home',
    data () {
      return {
        error: '',
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
    computed: {
      msgsReversed () {
        const arrCopy = [...this.msgs]
        arrCopy.reverse()
        return arrCopy
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
          this.error = ''
          let res = await fetch(API_URL, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(this.newMsg)
          })
          res = await res.json()

          if (res.details) {
            // validation err
            res.details.forEach(err => {
              this.error += `${err.message}  `
            })
          } else {
            this.error = ''
            this.newMsg.message = ''
            this.msgs = [...res]
          }
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
  .page {
    display: flex;
    justify-content: space-between;
  }

  .image {
    max-width: 100px;
  }

  .form {
    flex: 1;
    max-width: 400px;
    margin-right: 20px;
  }

  .posts {
    height: 80vh;
    overflow-y: scroll;
  }

  .posts-wrapper {
    flex: 1;
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
