import React, { useEffect, useState } from "react"
import { Button, Form } from "react-bootstrap"
import Mensagem from "@/components/message"
import CaminhoPagina from "@/components/breadcrumb"
import { Preferencias } from '@/models/Preferencias'
import ConfirmDialog from '@/components/confirmdialog'
import { getSession } from "next-auth/react"
import Layout from "@/components/layout"
import TipoFiltroSelect from "@/components/tipofiltro"
import { useRouter } from "next/router"

export default function PreferenciasForm({ token }) {

    const router = useRouter()

    const [preferenciasEdit, setPreferenciasEdit] = useState(new Preferencias())
    const [isLoading, setLoading] = useState(false)
    const [message, setMessage] = useState(null)
    const [showConfirmDialog, setShowConfirmDialog] = useState(false)

    useEffect(() => {
        setLoading(true)

        fetch('/rest/api/preferencia',
            {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            }
        ).then((res) => res.json())
            .then((data) => {
                if (data) {
                    setPreferenciasEdit(data)
                }
                setLoading(false)
            });

    }, [])

    const setPropertyEdit = (obj) => {
        let preferencias = preferenciasEdit
        Object.assign(preferencias, obj)
        setPreferenciasEdit(() => ({
            ...preferencias
        }));
    }

    const success = () => {
        setMessage({ tipo: 'success', descricao: 'Operação realizada com sucesso' })
    }

    const error = (descricao) => {
        setMessage({ tipo: 'error', descricao: descricao })
    }

    const validate = () => {
        if (!preferenciasEdit.tipoFiltro) {
            error('Favor informar o campo Tipo filtro')
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
            const res = await fetch('/rest/api/preferencias',
                {
                    method: "POST",
                    body: JSON.stringify(preferenciasEdit),
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            const tarefa = await res.json()
            success()
            router.push("/tarefas")
            

        } catch (err) {
            console.log('erro: ' + JSON.stringify(err))
            error('Erro ao salvar preferencias')
        }

    }

    const remove = (event) => {
        event.preventDefault();

        setShowConfirmDialog(true)
    }

    const remover = async () => {

        try {
            const result = await fetch('/rest/api/preferencia',
                {
                    method: "DELETE",
                    headers: {
                        "Authorization": `Bearer ${token}`,
                    },
                }
            );

            success()

            setPreferenciasEdit(new Preferencias())
            setShowConfirmDialog(false)
            router.push("/tarefas")

        } catch (err) {
            console.log('erro: ' + JSON.stringify(err))
            error('Erro ao remover preferencias')
        }

    }

    const changeTipoFiltro = (tipoFiltro) => {
        setPropertyEdit({ tipoFiltro: tipoFiltro })
    }

    if (isLoading) return <p>Aguarde...</p>

    return (
        <div>
            <CaminhoPagina caminhoList={['Preferências', preferenciasEdit.id ? 'Editar' : 'Novo']}></CaminhoPagina>

            {message &&
                <Mensagem tipo={message.tipo} descricao={message.descricao}></Mensagem>
            }

            <ConfirmDialog message="Tem certeza que deseja excluir o registro?" show={showConfirmDialog}
                ok={remover} cancelar={() => setShowConfirmDialog(false)}></ConfirmDialog>

            <Form className="col-sm-6">
                <Form.Group className="mb-3">
                    <Form.Label>Tipo filtro</Form.Label>
                    <TipoFiltroSelect value={preferenciasEdit.tipoFiltro} change={changeTipoFiltro}>
                    </TipoFiltroSelect>
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Check type="checkbox" label="Concluídas"
                        checked={preferenciasEdit.done}
                        onChange={(e) => setPropertyEdit({ done: e.target.checked })}
                    />
                </Form.Group>

                <Button variant="primary" type="button" className="btn-space" onClick={save}>OK</Button>
                {preferenciasEdit.id &&
                    <Button variant="primary" type="button" onClick={remove}>Excluir</Button>
                }
            </Form>

        </div>
    )
}

export async function getServerSideProps(context) {
    const session = await getSession(context)
    const token = session?.user.token

    return { props: { token } }
}

PreferenciasForm.getLayout = function getLayout(page) {
    return (
        <Layout>
            {page}
        </Layout>
    )
}
