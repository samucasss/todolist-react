import CaminhoPagina from '@/components/breadcrumb'
import Layout from '@/components/layout'
import { Usuario } from '@/models/Usuario'
import { getSession, useSession } from 'next-auth/react'
import UsuarioForm from './form'

export default function MeusDados() {

    const { data: session } = useSession()

    const usuarioSessao = new Usuario(session?.user)
    const token = session?.user.token

    return (
        <div>
            <CaminhoPagina caminhoList={['Usuário', 'Alterar']}></CaminhoPagina>
            <UsuarioForm usuario={usuarioSessao} token={token}></UsuarioForm>
        </div>
    )
}

export async function getServerSideProps(context) {
    return {
        props: {
            session: await getSession(context)
        },
    }
}

MeusDados.getLayout = function getLayout(page) {
    return (
        <Layout>
            {page}
        </Layout>
    )
}
