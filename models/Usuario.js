import { ObjectUtil } from "./ObjectUtil"

export class Usuario {

    constructor(json) {
        this.id = null
        this.email = ''
        this.nome = ''
        this.senha = ''

        if (json) {
            this.setJson(json)
        }
    }

    setJson(json) {
        ObjectUtil.copy(this, json)
    }


}