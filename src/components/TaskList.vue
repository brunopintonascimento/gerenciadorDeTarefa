<template>
  <div>
    <ul>
      <li v-for="(task, index) in tasks" :key="index">
        <TaskItem 
          :title="task.name" 
          :completed="task.completed" 
          @update:completed="updateTaskCompletion(index, $event)" 
          @remove="removeTask(index)"
        />
      </li>
    </ul>
  </div>
</template>

<script>
import TaskItem from './TaskItem.vue'; // Certifique-se de que o caminho está correto

export default {
  components: {
    TaskItem,
  },
  props: {
    tasks: Array,
  },
  methods: {
    updateTaskCompletion(index, completed) {
      this.$emit('update-task', index, completed); // Emitir o novo estado
    },
    removeTask(index) {
      this.$emit('remove-task', index); // Emitir evento de remoção
    },
  },
};
</script>


<style scoped>
.task-item {
  background-color: #fff;
  padding: 10px;
  margin: 5px 0;
  border-radius: 4px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.task-name {
  flex: 1;
  margin-left: 10px;
}

.edit-input {
  flex: 1;
  margin-left: 10px;
  padding: 5px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.edit-button, .remove-button {
  padding: 5px 10px;
  margin-left: 10px; /* Espaço à esquerda do botão Remover */
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.edit-button {
  background-color: #007bff; /* Cor do botão Editar/Salvar */
  color: white;
}

.edit-button:hover {
  background-color: #0056b3; /* Cor ao passar o mouse para Editar/Salvar */
}

.remove-button {
  background-color: #dc3545; /* Cor do botão Remover */
  color: white;
}

.remove-button:hover {
  background-color: #c82333; /* Cor ao passar o mouse para Remover */
}
</style>
