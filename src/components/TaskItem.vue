<template>
  <div class="task">
    <input type="checkbox" :checked="completed" @change="updateCompleted" />
    <span class="task-title">{{ title }}</span>
    <button @click="removeTask" class="remove-button">Remover</button>
  </div>
</template>

<script>
export default {
  name: 'TaskItem', // Nome do componente com múltiplas palavras
  props: {
    title: {
      type: String,
      required: true
    },
    completed: {
      type: Boolean,
      required: true
    }
  },
  methods: {
    updateCompleted(event) {
      this.$emit('update:completed', event.target.checked); // Emite o novo estado
    },
    removeTask() {
      this.$emit('remove'); // Emite o evento de remoção
    },
  },
};
</script>

<style scoped>
.task {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px;
  border: 1px solid #ccc;
  margin: 5px 0;
  background-color: white; /* Cor de fundo */
  border-radius: 4px; /* Cantos arredondados */
  transition: background-color 0.3s; /* Transição suave para a cor de fundo */
}

.task:hover {
  background-color: #f8f9fa; /* Cor de fundo ao passar o mouse */
}

.task-title {
  flex: 1; /* Permite que o título ocupe o espaço disponível */
  margin-left: 10px; /* Espaço à esquerda do título */
  text-decoration: none; /* Para remover o sublinhado, se houver */
}

.remove-button {
  padding: 5px 10px;
  background-color: #dc3545; /* Cor do botão Remover */
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.remove-button:hover {
  background-color: #c82333; /* Cor ao passar o mouse para Remover */
}
</style>
