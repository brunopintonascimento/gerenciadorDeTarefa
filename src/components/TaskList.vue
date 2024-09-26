<template>
  <div class="table-container">
    <h1>Lista de Tarefas</h1>

    <table class="modern-table">
      <thead>
        <tr>
          <th>Tarefa</th>
          <th>Valor Total (R$)</th>
          <th>Valor da Parcela (R$)</th>
          <th>Parcelas Pagas</th>
          <th>Parcelas Restantes</th>
          <th>Data</th>
          <th>Status</th>
          <th>Ações</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(task, index) in tasks" :key="index">
          <td :class="{ completed: task.completed }">
            <input type="checkbox" v-model="task.completed" />
            {{ task.name }}
          </td>
          <td>{{ task.value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) }}</td>
          <td>{{ task.valorParcela.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) }}</td>
          <td>{{ task.parcelasPagas }}</td>
          <td>{{ task.parcelasRestantes }}</td>
          <td>{{ task.date }}</td>
          <td>{{ task.completed ? 'Concluída' : 'Pendente' }}</td>
          <td>
            <button class="pay-btn" @click="pagarParcela(task)">Pagar Parcela</button>
            <button class="remove-btn" @click="removeTask(index)">Remover</button>
          </td>
        </tr>
      </tbody>
    </table>

    <router-link to="/" class="back-btn">Voltar para tela inicial</router-link>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tasks: [],
    };
  },
  methods: {
    pagarParcela(task) {
      if (task.parcelasRestantes > 0) {
        task.parcelasPagas += 1;
        task.parcelasRestantes -= 1;
        if (task.parcelasRestantes === 0) {
          task.completed = true;
        }
        this.saveTasks();
      } else {
        alert("Todas as parcelas já foram pagas.");
      }
    },
    removeTask(index) {
      if (confirm("Você tem certeza que deseja remover esta tarefa?")) {
        this.tasks.splice(index, 1);
        this.saveTasks();
      }
    },
    saveTasks() {
      localStorage.setItem("tasks", JSON.stringify(this.tasks));
    },
    loadTasks() {
      const storedTasks = localStorage.getItem("tasks");
      if (storedTasks) {
        this.tasks = JSON.parse(storedTasks);
      }
    },
  },
  mounted() {
    this.loadTasks();
  },
};
</script>

<style scoped>
/* Estilos opcionais */
.back-btn {
  display: inline-block;
  margin-top: 20px;
  padding: 10px 20px;
  background-color: #3498db;
  color: white;
  border-radius: 6px;
  text-decoration: none;
  font-size: 16px;
  transition: background-color 0.3s;
}

.back-btn:hover {
  background-color: #2980b9;
}
</style>
