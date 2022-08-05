import { ObjectUtil } from "./ObjectUtil"

export class Preferencias {

  constructor(json) {
    this.id = null
    this.tipoFiltro = ''
    this.done = false

    if (json) {
      this.setJson(json)
    }
  }

  setJson(json) {
    ObjectUtil.copy(this, json)
  }
}