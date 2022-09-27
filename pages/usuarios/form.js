import React, { useState } from "react"
import { Button, Form } from "react-bootstrap"
import Mensagem from "@/components/message"
import { signIn, signOut } from "next-auth/react"
import { useRouter } from "next/router"
import ConfirmDialog from "@/components/confirmdialog"

export default function UsuarioForm(props) {

    const router = useRouter()

    const [usuarioEdit, setUsuarioEdit] = useState(props.usuario)
    const [message, setMessage] = useState(null)
    const [showConfirmDialog, setShowConfirmDialog] = useState(false)

    const setPropertyUsuarioEdit = (obj) => {
        let usuario = usuarioEdit
        Object.assign(usuario, obj)
        setUsuarioEdit(() => ({
            ...usuario
        }));
    }

    const success = () => {
        setMessage({ tipo: 'success', descricao: 'Operação realizada com sucesso' })
    }

    const error = (descricao) => {
        setMessage({ tipo: 'error', descricao: descricao })
    }

    const validate = () => {
        if (!usuarioEdit.nome) {
            error('Favor informar o campo Nome')
            return false
        }

        if (!usuarioEdit.email) {
            error('Favor informar o campo E-mail')
            return false
        }

        if (!usuarioEdit.senha) {
            error('Favor informar o campo Senha')
            return false
        }

        return true
    }

    const autentica = async () => {
        const res = await signIn('credentials', {
            redirect: false,
            email: usuarioEdit.email,
            senha: usuarioEdit.senha,
            callbackUrl: `${window.location.origin}`,
        });

        console.log('autenticacao: ' + JSON.stringify(res))

        if (res?.error) {
            error("Erro na autenticação do usuário");
            return
        }

        router.push("/tarefas")
    }

    const save = async (event) => {
        event.preventDefault();

        if (!validate()) {
            return;
        }

        try {

            if (!usuarioEdit.id) {

                //registra o usuario
                await fetch('/rest/api/auth/register',
                    {
                        method: "POST",
                        body: JSON.stringify(usuarioEdit),
                        headers: {
                            "Content-Type": "application/json",
                        },
                    }
                );

                success()
                autentica()

            } else {

                //atualiza o usuario logado
                const res = await fetch('/rest/api/usuario',
                    {
                        method: "POST",
                        body: JSON.stringify(usuarioEdit),
                        headers: {
                            "Authorization": `Bearer ${props.token}`,
                            "Content-Type": "application/json",
                        },
                    }
                );

                success()
            }

        } catch (err) {
            error('Erro ao salvar usuario')
        }

    }

    const remove = (event) => {
        event.preventDefault();

        setShowConfirmDialog(true)
    }

    const remover = async () => {

        try {
            await fetch('/rest/api/usuario',
                {
                    method: "DELETE",
                    headers: {
                        "Authorization": `Bearer ${props.token}`,
                    },
                }
            );

            success()

            await signOut({
                callbackUrl: `${window.location.origin}`
            });

        } catch (err) {
            console.log('erro: ' + JSON.stringify(err))
            error('Erro ao remover usuario')
        }

    }

    return (
        <div className="col-md-6">

            {message &&
                <Mensagem tipo={message.tipo} descricao={message.descricao}></Mensagem>
            }

            <ConfirmDialog message="Tem certeza que deseja excluir o registro?" show={showConfirmDialog}
                ok={remover} cancelar={() => setShowConfirmDialog(false)}></ConfirmDialog>

            <Form>
                <Form.Group className="mb-3">
                    <Form.Label>Nome</Form.Label>
                    <Form.Control type="text"
                        value={usuarioEdit.nome}
                        onChange={(e) => setPropertyUsuarioEdit({ nome: e.target.value })}
                    />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>E-mail</Form.Label>
                    <Form.Control type="email" placeholder="example@gmail.com"
                        value={usuarioEdit.email}
                        onChange={(e) => setPropertyUsuarioEdit({ email: e.target.value })}
                    />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Senha</Form.Label>
                    <Form.Control type="password"
                        value={usuarioEdit.senha}
                        onChange={(e) => setPropertyUsuarioEdit({ senha: e.target.value })}
                    />
                </Form.Group>

                <Button variant="primary" type="button" className="btn-space" onClick={save}>OK</Button>
                {usuarioEdit.id &&
                    <Button variant="primary" type="button" onClick={remove}>Excluir</Button>
                }
            </Form>

        </div>
    )
}
