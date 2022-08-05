import moment from 'moment'

export class FiltroHoje {

  filter(tarefaList, done) {
    const hoje = moment.utc().startOf('day')
    const amanha = moment(hoje).add(1, 'days')

    const inicio = moment(hoje).add(-1, 'seconds')
    const fim = moment(amanha).add(-1, 'seconds')

    const tarefaDoneList = tarefaList.filter(tarefa => tarefa.done === done)
    const tarefaFilterList = tarefaDoneList.filter(tarefa => moment(tarefa.data).isBetween(inicio, fim))

    return tarefaFilterList
  }
}