<template>
    <div class="task-page">
      <h1>Gerenciador de Tarefas</h1>
  
      <form @submit.prevent="addTask" class="task-form">
        <div class="form-group">
          <label for="task">Nova Tarefa:</label>
          <input type="text" id="task" v-model="newTask" placeholder="Nova Tarefa" required />
        </div>
  
        <div class="form-group">
          <label for="value">Valor Total (R$):</label>
          <input type="number" id="value" v-model.number="newTaskValue" placeholder="Valor Total (R$)" min="0" step="0.01" required />
        </div>
  
        <div class="form-group">
          <label for="quantity">Quantidade:</label>
          <input type="number" id="quantity" v-model.number="newTaskQuantity" placeholder="Quantidade" min="1" required />
        </div>
  
        <div class="form-group">
          <label for="date">Data (DD/MM/AAAA):</label>
          <input type="text" id="date" v-model="newTaskDate" placeholder="Data (DD/MM/AAAA)" required />
        </div>
  
        <div class="form-group">
          <label for="installments">Número de Parcelas:</label>
          <input type="number" id="installments" v-model.number="newTaskInstallments" placeholder="Número de Parcelas" min="1" required />
        </div>
        <input v-model="title" type="text" placeholder="Título da tarefa" required />
        <button type="submit">Adicionar Tarefa</button>
      </form>
  
      <router-link to="/tasks" class="view-tasks-btn">Ver Tarefas</router-link>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        newTask: "",
        newTaskValue: 0,
        newTaskQuantity: 1,
        newTaskDate: "",
        newTaskInstallments: 1,
      };
    },
    methods: {
      addTask() {
        // Calcula o valor de cada parcela
        const valorParcela = this.newTaskValue / this.newTaskInstallments;
  
        // Verifica se os dados da tarefa são válidos
        if (this.isValidTaskInput()) {
          const task = {
            name: this.newTask.trim(),
            value: this.newTaskValue,
            quantity: this.newTaskQuantity,
            date: this.newTaskDate,
            installments: this.newTaskInstallments,
            parcelasPagas: 0,
            parcelasRestantes: this.newTaskInstallments,
            valorParcela: valorParcela,
            completed: false,
          };
  
          // Salva a tarefa no localStorage
          const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
          tasks.push(task);
          localStorage.setItem("tasks", JSON.stringify(tasks));
  
          // Exibe alerta e redireciona para a lista de tarefas
          alert("Tarefa adicionada com sucesso!");
          this.$router.push("/tasks"); // Certifique-se de que esta rota esteja configurada
        } else {
          alert("Por favor, preencha todos os campos corretamente.");
        }
      },
      isValidTaskInput() {
        // Verifica se todos os campos foram preenchidos corretamente
        return (
          this.newTask.trim() &&
          this.newTaskValue >= 0 &&
          this.newTaskQuantity > 0 &&
          this.newTaskDate.trim() &&
          this.newTaskInstallments > 0
        );
      },
    },
  };
  </script>
  
  
  <style scoped>
  /* Estilos opcionais */
  .view-tasks-btn {
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
  
  .view-tasks-btn:hover {
    background-color: #2980b9;
  }
  </style>
  