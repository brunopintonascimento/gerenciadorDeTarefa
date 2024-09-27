<template>
  <div id="app">
    <h1>Gerenciador de Tarefas</h1>

    <form @submit.prevent="addTask" class="task-form">
      <div class="form-group">
        <label for="task">Nova Tarefa:</label>
        <input type="text" id="task" v-model="newTask" placeholder="Nova Tarefa" required />
      </div>

      <div class="form-group">
        <label for="value">Valor Total (R$):</label>
        <input type="number" id="value" v-model.number="newTaskValue" placeholder="Valor Total (R$)" min="0" step="0.01"
          required />
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
        <input type="number" id="installments" v-model.number="newTaskInstallments" placeholder="Número de Parcelas"
          min="1" required />
      </div>

      <button type="submit">Adicionar Tarefa</button>
    </form>

    <div class="table-container">
      <table class="modern-table">
        <thead>
          <tr>
            <th>Tarefa</th>
            <th>Valor Total (R$)</th>
            <th>Valor da Parcela (R$)</th>
            <th>Parcelas Pagas</th>
            <th>Parcelas Restantes</th>
            <th>Data</th> <!-- Nova coluna de Data -->
            <th>Status</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(task, index) in filteredTasks" :key="index">
            <td :class="{ completed: task.completed }">
              <input type="checkbox" v-model="task.completed" />
              {{ task.name }}
            </td>
            <td>{{ task.value ? task.value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : 'R$ 0,00'
              }}
            </td>
            <td>{{ task.valorParcela ? task.valorParcela.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
              :
              'R$ 0,00' }}</td>

            <td>{{ task.parcelasPagas }}</td>
            <td>{{ task.parcelasRestantes }}</td>
            <td>{{ task.date }}</td> <!-- Exibindo a data aqui -->
            <td>
              <span :class="{ 'status-completed': task.completed, 'status-pending': !task.completed }">
                {{ task.completed ? 'Concluída' : 'Pendente' }}
              </span>
            </td>
            <td>
              <!-- Botões devem estar dentro de uma célula de tabela -->
              <div>
                <button class="btn pay-btn" @click="pagarParcela(task)">Pagar Parcela</button>
                <button class="btn remove-btn" @click="removeTask(index)">Remover</button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>


    <div class="total">
      <strong>Total: {{ totalValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) }}</strong>
    </div>


    <footer class="footer">
      <div class="footer-container">
        <div class="social-icons">
          <a href="https://www.instagram.com/digitalcombruno/" target="_blank" title="Instagram" aria-label="Instagram">
            <img src="@/assets/instagram.png" alt="Instagram" class="social-icon" />
          </a>
          <a href="https://wa.me/5521977167009" target="_blank" title="WhatsApp" aria-label="WhatsApp">
            <img src="@/assets/whatsapp.png" alt="WhatsApp" class="social-icon" />
          </a>
          <a href="https://www.linkedin.com/in/your-linkedin-profile" target="_blank" title="LinkedIn"
            aria-label="LinkedIn">
            <img src="@/assets/linkedin.png" alt="LinkedIn" class="social-icon" />
          </a>
          <a href="https://github.com/brunopintonascimento" target="_blank" title="GitHub" aria-label="GitHub">
            <img src="@/assets/github.png" alt="GitHub" class="social-icon" />
          </a>
        </div>
        <p class="footer-text">© 2024 Bruno Pinto Nascimento. Todos os direitos reservados.</p>
      </div>
    </footer>
  </div>
</template>

<script>
export default {
  name: 'App',
  data() {
    return {
      newTask: '',
      newTaskValue: 0,
      newTaskQuantity: 1,
      newTaskDate: '',
      newTaskInstallments: 1,
      tasks: [],
      filter: 'all',
    };
  },
  computed: {
    filteredTasks() {
      switch (this.filter) {
        case 'completed':
          return this.tasks.filter(task => task.completed);
        case 'pending':
          return this.tasks.filter(task => !task.completed);
        default:
          return this.tasks;
      }
    },
    totalValue() {
      return this.tasks.reduce((total, task) => total + (task.value || 0), 0);
    },
  },
  methods: {
    addTask() {
      const valorParcela = this.newTaskValue / this.newTaskInstallments;
      if (this.isValidTaskInput()) {
        this.tasks.push({
          name: this.newTask.trim(),
          value: this.newTaskValue,
          quantity: this.newTaskQuantity,
          date: this.newTaskDate,
          installments: this.newTaskInstallments,
          parcelasPagas: 0,
          parcelasRestantes: this.newTaskInstallments,
          valorParcela: valorParcela,
          completed: false,
        });
        this.resetForm();
        this.saveTasks();
      } else {
        alert('Por favor, preencha todos os campos corretamente.');
      }
    },
    pagarParcela(task) {
      if (task.parcelasRestantes > 0) {
        task.parcelasPagas += 1;
        task.parcelasRestantes -= 1;
        if (task.parcelasRestantes === 0) {
          task.completed = true;
        }
        this.saveTasks();
      } else {
        alert('Todas as parcelas já foram pagas.');
      }
    },
    removeTask(index) {
      if (confirm('Você tem certeza que deseja remover esta tarefa?')) {
        this.tasks.splice(index, 1);
        this.saveTasks();
      }
    },
    saveTasks() {
      localStorage.setItem('tasks', JSON.stringify(this.tasks));
    },
    loadTasks() {
      const storedTasks = localStorage.getItem('tasks');
      if (storedTasks) {
        this.tasks = JSON.parse(storedTasks);
      }
    },
    resetForm() {
      this.newTask = '';
      this.newTaskValue = 0;
      this.newTaskQuantity = 1;
      this.newTaskDate = '';
      this.newTaskInstallments = 1;
    },
    isValidTaskInput() {
      return this.newTask.trim() &&
        this.newTaskValue >= 0 &&
        this.newTaskQuantity > 0 &&
        this.newTaskDate.trim() &&
        this.newTaskInstallments > 0;
    }
  },
  mounted() {
    this.loadTasks();
  }
};
</script>

<style>
#app {
  font-family: Arial, sans-serif;
  text-align: center;
  margin: 20px auto;
  background: linear-gradient(135deg, #ffffff1c, #e8f4fc);
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 6px 25px rgba(0, 0, 0, 0.15);
  max-width: 1000px;
}

h1 {
  color: #34495e;
  font-size: 2.5rem;
  margin-bottom: 30px;
  text-transform: uppercase;
}

/* Estilo padrão para a task-form */
.task-form {
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-bottom: 30px;
  padding: 20px;
  background-color: #f5f5f5; /* Cor de fundo leve */
  border-radius: 8px;
  max-width: 600px; /* Limita a largura máxima para telas grandes */
  margin: 0 auto; /* Centraliza o formulário */
}

/* Estilo padrão para os form-groups */
.form-group {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 100%;
}

.form-group label {
  margin-bottom: 5px;
  font-size: 1rem;
}

.form-group input,
.form-group select,
.form-group textarea {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 1rem;
}

/* Estilos para telas médias */
@media (max-width: 768px) {
  .task-form {
    max-width: 90%; /* Reduz a largura máxima */
    padding: 15px; /* Reduz o padding em telas médias */
  }

  .form-group label {
    font-size: 0.95rem; /* Reduz um pouco o tamanho da fonte */
  }

  .form-group input,
  .form-group select,
  .form-group textarea {
    font-size: 0.95rem; /* Reduz o tamanho da fonte dos campos */
    padding: 8px; /* Reduz o padding dos campos */
  }
}

/* Estilos para telas pequenas */
@media (max-width: 480px) {
  .task-form {
    max-width: 100%; /* O formulário ocupa toda a largura disponível */
    padding: 10px; /* Menos padding para telas pequenas */
  }

  .form-group label {
    font-size: 0.9rem; /* Fonte menor para rótulos */
  }

  .form-group input,
  .form-group select,
  .form-group textarea {
    font-size: 0.9rem; /* Fonte menor para campos */
    padding: 6px; /* Padding menor */
  }

  .task-form {
    gap: 10px; /* Menos espaço entre os elementos em telas pequenas */
  }
}

.total {
  padding: 12px 24px; /* Padding inicial */
  border: none;
  border-radius: 4px;
  font-size: 2rem; /* Tamanho da fonte em rem para responsividade */
  cursor: pointer;
  transition: background-color 0.3s ease;
  border: 2px solid #34495e;
  background-color: #34495e; /* Cor de fundo inicial */
  color: white; /* Cor do texto */
}

/* Estilo ao passar o mouse */
.total:hover {
  background-color: #2980b9; /* Cor de fundo ao passar o mouse */
}

/* Media Queries para responsividade */
@media (max-width: 768px) {
  .total {
    padding: 10px 20px; /* Ajuste de padding para telas menores */
    font-size: 1.5rem; /* Tamanho da fonte menor */
  }
}

@media (max-width: 480px) {
  .total {
    padding: 8px 16px; /* Ajuste de padding para telas ainda menores */
    font-size: 1.2rem; /* Tamanho da fonte ainda menor */
  }
}

label {
  margin-bottom: 5px;
  font-weight: bold;
  color: #2c3e50;
}

input[type="text"],
input[type="number"] {
  padding: 12px;
  border: 2px solid #2980b9;
  border-radius: 6px;
  width: 100%;
  max-width: 450px;
  font-size: 16px;
  transition: border-color 0.3s ease;
}

input[type="text"]:focus,
input[type="number"]:focus {
  border-color: #1abc9c;
}

button {
  padding: 14px 70px;
  background-color: #3ce745;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  font-weight: bold;
  text-transform: uppercase;
  cursor: pointer;
  transition: background-color 0.3s ease;
  
}

button:hover {
  background-color: #c0392b;
}



/* Botão "Pagar Parcela" - Verde */
.pay-btn {
  background-color: #2ecc71;
  color: white;
  width: 100px;
  cursor: pointer;
  margin-left: 8px;
}

.pay-btn:hover {
  background-color: #27ae60;
}

/* Botão "Remover" - Vermelho */
.remove-btn {
  background-color: #e74c3c;
  color: white;
  margin-left: 8px;
  width: 100px;
  cursor: pointer;
}

.remove-btn:hover {
  background-color: #c0392b;
}
/* Estilo geral dos botões */
table.modern-table .btn {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  font-size: 0.85rem;
  cursor: pointer;
  transition: background-color 0.3s ease;
}
/* Tabela responsiva */
.table-container {
  overflow-x: auto;
  flex-wrap: wrap;
}

table.modern-table {
  width: 100%;
  border-collapse: collapse;
}

th,
td {
  padding: 15px;
  text-align: center;
  border-bottom: 1px solid #ddd;
}

th {
  background-color: #2c3e50;
  color: white;
  font-weight: bold;
}

tr:hover {
  background-color: #f9f9f9;
}

td input[type="checkbox"] {
  transform: scale(1.3);
}

td.completed {
  text-decoration: line-through;
}

.status-completed {
  color: #27ae60;
  font-weight: bold;
}

.status-pending {
  color: #e74c3c;
  font-weight: bold;
}

/* Estilo para o footer */
.footer {
  margin-top: 50px;
}

.footer-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  background-color: #34495e;
  color: white;
  border-radius: 0 0 6px 6px;
}

.social-icons {
  display: flex; /* Para alinhar os ícones lado a lado */
  gap: 10px; /* Espaçamento entre os ícones */
  flex-wrap: wrap;
 
}

.social-icon {
  width: 40px; /* Defina a largura desejada */
  height: 40px; /* Defina a altura desejada */
  border-radius: 50%; /* Arredondar as imagens */
  object-fit: cover; /* Mantém a proporção da imagem */
  transition: transform 0.3s ease; /* Transição para efeito de hover */
}

.social-icon:hover {
  transform: scale(1.1); /* Efeito de zoom ao passar o mouse */
}


.footer-text {
  margin: 0;
}

@media (max-width: 768px) {
  .footer-container {
    flex-direction: column;
  }

  .social-icons {
    margin-bottom: 15px;
  }
}

</style>
