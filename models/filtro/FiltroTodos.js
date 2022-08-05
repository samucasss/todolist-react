export class FiltroTodos {

  filter(tarefaList, done) {
    const tarefaFilterList = tarefaList.filter(tarefa => tarefa.done === done)
      
    return tarefaFilterList
  }
}