const { ref, onMounted } = Vue;
const app = Vue.createApp({
  setup () {
    const topics = ref([]);
    const newTopic = ref('');

    const createTopic = () => {
      topics.value.push({name: newTopic.value});
      newTopic.value = '';
      saveTopics();
    };

    const updateTopic = (index, updatedTopic) => {
      topics.value[index].name = updatedTopic;
      saveTopics();
    };

    const deleteTopic = (index) => {
      topics.value.splice(index, 1); // will test again
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

    return { topics, newTopic, createTopic, updateTopic, deleteTopic, resetTopics };
  }
});

app.mount('#app');