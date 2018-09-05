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
      <button
        type="submit"
        class="btn btn-primary"
        :disabled="isSubmitPostDisabled"
      >
        {{ isSubmitPostDisabled ? 'Posting...' : 'Fire!' }}
      </button>

      <div v-if="error" class="alert alert-danger">
        <strong>Invalid post!</strong> {{ error }}
      </div>
    </form>

    <div class="posts-wrapper">
      <button class="btn btn-primary" @click="toggleFormVisibility">Show/hide form</button>
      <div class="posts">
        <ul class="list-unstyled" v-if="msgsReversed.length">
          <li
            v-for="post in msgsReversed"
            :key="`post-${post._id}`"
            class="media post"
          >
            <img class="mr-3 image" :src="post.imageURL" :alt="post.subject">
            <div class="media-body">
              <p class="username">{{ post.username }}</p>
              <p class="subject">{{ post.subject }}</p>
              {{ post.message }}
              <div>
                <small>{{ formatDate(post.created) }}</small>
              </div>
            </div>
          </li>
        </ul>
        <div v-else>Loading posts...</div>
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
        isSubmitPostDisabled: false,
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
      formatDate (date) {
        const dateObj = new Date(date)

        const monthNames = [
          'January', 'February', 'March',
          'April', 'May', 'June', 'July',
          'August', 'September', 'October',
          'November', 'December'
        ]

        const day = dateObj.getDate()
        const monthIndex = dateObj.getMonth()
        const year = dateObj.getFullYear()

        return day + ' ' + monthNames[monthIndex] + ' ' + year
      },
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
          this.isSubmitPostDisabled = true
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
        } finally {
          this.isSubmitPostDisabled = false
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

  .username {
    font-size: 26px;
    margin-bottom: 0;
  }

  .subject {
    font-size: 18px;
    font-style: italic;
    margin-bottom: 0;
  }
</style>
