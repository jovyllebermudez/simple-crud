const { ref, onMounted, computed, $set } = Vue;
const app = Vue.createApp({
  setup () {
    const topics = ref([]);
    const newTopic = ref('');
    const perPage = ref(20);
    const currentPage = ref(0);
    const viewingCommentsForTopic = ref(null); // holds comments
    const newComment = ref(''); //  For storing the new comment
    const editingComment = ref(null); //  storing the comment currently being edited

    const addComment = () => {
      viewingCommentsForTopic.value.comments.push({
        comment: newComment.value, date: new Date().toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: true,
        }), by: 'Me'});
      newComment.value = '';
      saveTopics();
    };

    const editComment = (comment, index) => {
      editingComment.value = { comment, index };
    };

    const updateComment = () => {
      viewingCommentsForTopic.value.comments[editingComment.value.index].comment = editingComment.value.comment.comment;
      // this.$set(viewingCommentsForTopic.value.comments, editingComment.value.index, editingComment.value.comment);
      // debugger;
      editingComment.value = null;
      saveTopics();
    }; 
    const openComments = (topic) => {
      // debugger;
      viewingCommentsForTopic.value = topic;
    };

    const slicedTopics = computed(() => {
      let start = currentPage.value * perPage.value,
        end = start + perPage.value;
      return topics.value.slice(start, end);
    });
    const totalPages = computed(() => {
      return Math.ceil(topics.value.length / perPage.value);
    });
    const setPage = (pageNumber) => {
      currentPage.value = pageNumber;
    };
    const createTopic = () => {
      topics.value.push({name: newTopic.value, comments: [] , guid: Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)});
      newTopic.value = '';
      saveTopics();
    };

    const updateTopic = (index, updatedTopic) => {

      
      topics.value[currentPage.value * perPage.value+index].name = updatedTopic;
      saveTopics();
    };

    const deleteTopic = (index) => {
      topics.value.splice(currentPage.value * perPage.value + index, 1); 
      saveTopics();
    };

    const saveTopics = () => {
      localStorage.setItem('topics', JSON.stringify(topics.value));
    };
    const resetTopics = async () => {
      // debugger;
      const response = await axios.get('https://atillc.blob.core.windows.net/data-collector/icode/test-data/topics.json');
      topics.value = response.data.topics;
      localStorage.setItem('topics', JSON.stringify(topics.value));
    };

    onMounted(async () => {
      try {
        if (localStorage.getItem('topics')) {
          const localdata = JSON.parse(localStorage.getItem('topics'));
          topics.value = localdata;
        } else {
          resetTopics(); // initiate topics from API
        }

        // debugger;
      } catch (error) {
        console.error("this here's error___");
        console.error(error);
      }
    });

    return { topics, newTopic, createTopic, updateTopic, deleteTopic, resetTopics, slicedTopics, perPage, currentPage, setPage, totalPages, openComments, viewingCommentsForTopic, addComment, newComment, editComment, updateComment, editingComment };
  }
});

app.mount('#app');