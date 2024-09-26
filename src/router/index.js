import { createRouter, createWebHistory } from 'vue-router';
import TaskForm from '@/components/TaskForm.vue';
import TaskList from '@/components/TaskList.vue';

const routes = [
  {
    path: '/adicionar-tarefa',
    name: 'TaskForm',
    component: TaskForm
  },
  {
    path: '/lista-tarefas',
    name: 'TaskList',
    component: TaskList
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
