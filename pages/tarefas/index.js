import moment from 'moment'
import { Button, Col, Container, Form, OverlayTrigger, Row, Table, Tooltip } from "react-bootstrap"
import CaminhoPagina from "@/components/breadcrumb"
import Layout from "@/components/layout"
import Mensagem from "@/components/message"
import { Tarefa } from "@/models/Tarefa"
import { getSession } from "next-auth/react"
import { Check, PencilFill, TrashFill } from 'react-bootstrap-icons';
import TarefaForm from "./form"
import { useEffect, useState } from "react"
import ConfirmDialog from "@/components/confirmdialog"
import TipoFiltroSelect from "@/components/tipofiltro"
import { Preferencias } from "@/models/Preferencias"
import { FiltroFactory } from '@/models/filtro/FiltroFactory'
import { useRouter } from 'next/router'

export default function TarefaList({ token }) {
    const router = useRouter()

    const [isLoading, setLoading] = useState(false)
    const [edit, setEdit] = useState(false)
    const [tarefaList, setTarefaList] = useState([])
    const [tarefaFilterList, setTarefaFilterList] = useState([])
    const [tarefaAtual, setTarefaAtual] = useState(new Tarefa())
    const [message, setMessage] = useState(null)
    const [showConfirmDialog, setShowConfirmDialog] = useState(false)
    const [filtro, setFiltro] = useState({ tipoFiltro: '', done: false })

    useEffect(() => {
        setLoading(true)

        const findPreferencias = async () => {
            const res = await fetch('/rest/api/preferencia',
                {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            )

            const json = await res.json()

            Object.assign(filtro, json)
            setFiltro(() => ({
                ...filtro
            }));
        }

        const findTarefas = async () => {
            const periodoTarefas = periodoEssaSemana()
            const inicio = moment(periodoTarefas.inicio).format('YYYY/MM/DD')
            const fim = moment(periodoTarefas.fim).format('YYYY/MM/DD')

            const res = await fetch(`/rest/api/tarefas?inicio=${inicio}&fim=${fim}`,
                {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            )

            const json = await res.json()
            setTarefaList(json)
            filterInit(json)

            setLoading(false)
        }

        const filterInit = (tarefaList) => {
            let tarefaObjectList = tarefaList.map(json => new Tarefa(json))
            tarefaObjectList = tarefaObjectList.sort((a, b) => {
                return b.data < a.data
            });
    
            let retorno
            if (filtro.tipoFiltro) {
                const filtroTarefas = FiltroFactory.createFiltro(filtro.tipoFiltro)
                retorno = filtroTarefas.filter(tarefaObjectList, filtro.done)
    
            } else {
                retorno = tarefaObjectList
            }

            const { search } = router.query
            if (search) {
                retorno = retorno.filter(obj => obj.nome.toUpperCase().indexOf(search.toUpperCase()) > -1)
            }
    
            setTarefaFilterList(retorno)
        }
    
        console.log('recuperando dados da api')
        findPreferencias()
        findTarefas()

    }, [])

    const periodoEssaSemana = () => {
        const hoje = moment().startOf('day')
        const domingo = moment(hoje).isoWeekday(0)
        const sabado = moment(hoje).isoWeekday(6)

        const ultimoSabado = moment(domingo).add(-1, 'days')
        const proximoDomingo = moment(sabado).add(1, 'days')

        return { inicio: ultimoSabado, fim: proximoDomingo }
    }

    const success = () => {
        setMessage({ tipo: 'success', descricao: 'Operação realizada com sucesso' })
    }

    const error = (descricao) => {
        setMessage({ tipo: 'error', descricao: descricao })
    }

    const filter = () => {
        let tarefaObjectList = tarefaList.map(json => new Tarefa(json))
        tarefaObjectList = tarefaObjectList.sort((a, b) => {
            return b.data < a.data
        });

        let retorno
        if (filtro.tipoFiltro) {
            const filtroTarefas = FiltroFactory.createFiltro(filtro.tipoFiltro)
            retorno = filtroTarefas.filter(tarefaObjectList, filtro.done)

        } else {
            retorno = tarefaObjectList
        }

        setTarefaFilterList(retorno)
    }

    const novo = (event) => {
        event.preventDefault();
        setEdit(true)
    }

    const editar = (tarefa) => {
        const tarefaClone = new Tarefa()
        Object.assign(tarefaClone, tarefa)

        setTarefaAtual(tarefaClone)
        setEdit(true)
    }

    const cancelar = () => {
        setEdit(false)
    }

    const save = (tarefa) => {
        tarefaList.push(tarefa)
        setTarefaList(tarefaList)
        setEdit(false)
        filter()
    }

    const update = (tarefa) => {
        const tarefaExistente = tarefaList.find(obj => tarefa.id === obj.id)
        Object.assign(tarefaExistente, tarefa)

        setTarefaList(tarefaList)
        setEdit(false)
        filter()
    }

    const done = async (tarefa) => {
        try {
            const json = { done: true }
            const res = await fetch(`/rest/api/tarefas/done/${tarefa.id}`,
                {
                    method: "POST",
                    body: JSON.stringify(json),
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            const tarefaExistente = tarefaList.find(obj => tarefa.id === obj.id)
            tarefaExistente.done = true

            setTarefaList(tarefaList)
            success()


        } catch (err) {
            console.log('erro: ' + JSON.stringify(err))
            error('Erro ao concluir tarefa')
        }

    }

    const remover = (tarefa) => {
        setTarefaAtual(tarefa)
        setShowConfirmDialog(true)
        filter()
    }

    const remove = async () => {

        try {
            const result = await fetch(`/rest/api/tarefas/${tarefaAtual.id}`,
                {
                    method: "DELETE",
                    headers: {
                        "Authorization": `Bearer ${token}`,
                    },
                }
            );

            console.log('aqui')

            const tarefaAtualizadaList = tarefaList.filter(obj => obj.id !== tarefaAtual.id)
            setTarefaList(tarefaAtualizadaList)

            success()
            setShowConfirmDialog(false)

        } catch (err) {
            console.log('erro: ' + JSON.stringify(err))
            error('Erro ao remover tarefa')
        }

    }

    const setPropertyFiltro = (obj) => {
        Object.assign(filtro, obj)
        setFiltro(() => ({
            ...filtro
        }));
        filter()
    }

    const changeTipoFiltro = (tipoFiltro) => {
        setPropertyFiltro({ tipoFiltro: tipoFiltro })
    }

    if (isLoading) return <p>Aguarde...</p>

    if (!tarefaList) return <Mensagem tipo="error" descricao="Não existem tecnologias"></Mensagem>

    return (
        <div>

            {edit &&
                <TarefaForm tarefa={tarefaAtual} token={token} save={save} update={update}
                    cancelar={cancelar}></TarefaForm>
            }

            {!edit &&
                <div>
                    {message &&
                        <Mensagem tipo={message.tipo} descricao={message.descricao}></Mensagem>
                    }

                    <ConfirmDialog message="Tem certeza que deseja excluir o registro?" show={showConfirmDialog}
                        ok={remove} cancelar={() => setShowConfirmDialog(false)}></ConfirmDialog>

                    <CaminhoPagina caminhoList={['Tarefa', 'Listagem']}></CaminhoPagina>

                    <Row>
                        <Col>
                            <Button variant="primary" type="button" className="btn-space" onClick={novo}>
                                Novo</Button>
                        </Col>
                        <Col>
                            <TipoFiltroSelect value={filtro.tipoFiltro} change={changeTipoFiltro}>
                            </TipoFiltroSelect>

                        </Col>
                        <Col>
                            <Form.Check type="checkbox" label="Concluídas?"
                                checked={filtro.done}
                                onChange={(e) => setPropertyFiltro({ done: e.target.checked })}
                            />
                        </Col>
                    </Row>

                    <Table className='top-space' striped bordered hover>
                        <thead>
                            <tr>
                                <th>Data</th>
                                <th>Nome</th>
                                <th>Descrição</th>
                                <th>Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tarefaFilterList.map((tarefa, index) => (
                                <tr key={index}>
                                    <td>{tarefa.getDataFormatada()}</td>
                                    <td>{tarefa.nome}</td>
                                    <td>{tarefa.descricao}</td>
                                    <td>
                                        {!tarefa.done &&
                                            <OverlayTrigger
                                                placement="top"
                                                overlay={<Tooltip>Concluir tarefa</Tooltip>}
                                            >
                                                <Button onClick={() => done(tarefa)} size="sm" variant="outline-primary" className="btn-space">
                                                    <Check />
                                                </Button>
                                            </OverlayTrigger>
                                        }

                                        <OverlayTrigger
                                            placement="top"
                                            overlay={<Tooltip>Editar</Tooltip>}
                                        >
                                            <Button onClick={() => editar(tarefa)} size="sm" variant="outline-primary" className="btn-space">
                                                <PencilFill />
                                            </Button>
                                        </OverlayTrigger>

                                        <OverlayTrigger
                                            placement="top"
                                            overlay={<Tooltip>Remover</Tooltip>}
                                        >
                                            <Button onClick={() => remover(tarefa)} size="sm" variant="outline-primary" className="btn-space">
                                                <TrashFill />
                                            </Button>
                                        </OverlayTrigger>

                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </div>
            }
        </div>
    )
}

export async function getServerSideProps(context) {
    const session = await getSession(context)
    const token = session?.user.token

    return { props: { token } }
}

TarefaList.getLayout = function getLayout(page) {
    return (
        <Layout>
            {page}
        </Layout>
    )
}

