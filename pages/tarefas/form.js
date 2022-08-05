import moment from 'moment'
import React, { useState } from "react"
import { Button, Form } from "react-bootstrap"
import Mensagem from "@/components/message"
import CaminhoPagina from "@/components/breadcrumb"

export default function TarefaForm(props) {

    const [tarefaEdit, setTarefaEdit] = useState(props.tarefa)
    const [message, setMessage] = useState(null)

    const dateForPicker = (data) => {
        return moment(data).format('YYYY-MM-DD')
    }

    const setPropertyTarefaEdit = (obj) => {
        let tarefa = tarefaEdit
        Object.assign(tarefa, obj)
        setTarefaEdit(() => ({
            ...tarefa
        }));
    }

    const success = () => {
        setMessage({ tipo: 'success', descricao: 'Operação realizada com sucesso' })
    }

    const error = (descricao) => {
        setMessage({ tipo: 'error', descricao: descricao })
    }

    const validate = () => {
        if (!tarefaEdit.data) {
            error('Favor informar o campo Data')
            return false
        }

        if (!tarefaEdit.nome) {
            error('Favor informar o campo Nome')
            return false
        }

        return true
    }

    const save = async (event) => {
        event.preventDefault();

        if (!validate()) {
            return;
        }

        try {
            const res = await fetch('/rest/api/tarefas',
                {
                    method: "POST",
                    body: JSON.stringify(tarefaEdit),
                    headers: {
                        "Authorization": `Bearer ${props.token}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            const tarefa = await res.json()
            success()

            if (tarefaEdit.id) {
                props.update(tarefa)

            } else {
                props.save(tarefa)
            }

        } catch (err) {
            console.log('erro: ' + JSON.stringify(err))
            error('Erro ao salvar tarefa')
        }

    }

    return (
        <div>
            <CaminhoPagina caminhoList={['Tarefa', tarefaEdit.id ? 'Editar' : 'Novo']}></CaminhoPagina>

            {message &&
                <Mensagem tipo={message.tipo} descricao={message.descricao}></Mensagem>
            }

            <Form>
                <Form.Group className="mb-3">
                    <Form.Label>Data</Form.Label>
                    <Form.Control type="date"
                        value={dateForPicker(tarefaEdit.data)}
                        onChange={(e) => setPropertyTarefaEdit({ data: e.target.value })}
                    />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Nome</Form.Label>
                    <Form.Control type="text"
                        value={tarefaEdit.nome}
                        onChange={(e) => setPropertyTarefaEdit({ nome: e.target.value })}
                    />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Descrição</Form.Label>
                    <Form.Control as="textarea" rows={3}
                        value={tarefaEdit.descricao}
                        onChange={(e) => setPropertyTarefaEdit({ descricao: e.target.value })}
                    />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Check type="checkbox" label="Concluída?"
                        checked={tarefaEdit.done}
                        onChange={(e) => setPropertyTarefaEdit({ done: e.target.checked })}
                    />
                </Form.Group>

                <Button variant="primary" type="button" className="btn-space" onClick={save}>OK</Button>
                <Button variant="primary" type="button" className="btn-space" onClick={props.cancelar}>Cancelar</Button>
            </Form>

        </div>
    )
}
