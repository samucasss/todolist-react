import moment from 'moment'

export class FiltroSemana {

  filter(tarefaList, done) {
    const hoje = moment.utc().startOf('day')
    const domingo = moment(hoje).isoWeekday(0)
    const sabado = moment(hoje).isoWeekday(6)

    const ultimoSabado = moment(domingo).add(-1, 'days')
    const proximoDomingo = moment(sabado).add(1, 'days')

    const inicio = moment(ultimoSabado).add(-1, 'seconds')
    const fim = moment(proximoDomingo).add(-1, 'seconds')

    const tarefaDoneList = tarefaList.filter(tarefa => tarefa.done === done)
    const tarefaFilterList = tarefaDoneList.filter(tarefa => moment(tarefa.data).isBetween(inicio, fim))
      
    return tarefaFilterList
  }
}