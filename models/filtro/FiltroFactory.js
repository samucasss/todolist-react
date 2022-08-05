import { FiltroTodos } from '@/models/filtro/FiltroTodos'
import { FiltroHoje } from '@/models/filtro/FiltroHoje'
import { FiltroAmanha } from '@/models/filtro/FiltroAmanha'
import { FiltroSemana } from '@/models/filtro/FiltroSemana'

export class FiltroFactory {

  static createFiltro(tipo) {
    switch(tipo) {
      case 'T': return new FiltroTodos()
      case 'H': return new FiltroHoje()
      case 'A': return new FiltroAmanha()
      case 'S': return new FiltroSemana()
    }
  }
}