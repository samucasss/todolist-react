import moment from 'moment'

export class FiltroAmanha {

  filter(tarefaList, done) {
    const hoje = moment.utc().startOf('day')
    const amanha = moment(hoje).add(1, 'days')
    const depoisDeAmanha = moment(amanha).add(1, 'days')

    const inicio = moment(amanha).add(-1, 'seconds')
    const fim = moment(depoisDeAmanha).add(-1, 'seconds')

    const tarefaDoneList = tarefaList.filter(tarefa => tarefa.done === done)
    const tarefaFilterList = tarefaDoneList.filter(tarefa => moment.utc(tarefa.data).
      isBetween(inicio, fim))

    return tarefaFilterList
  }
}