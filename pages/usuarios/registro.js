import CaminhoPagina from '@/components/breadcrumb'
import Layout from '@/components/layout'
import { Usuario } from '@/models/Usuario'
import UsuarioForm from './form'

export default function RegistroForm() {

    return (
        <div>
            <CaminhoPagina caminhoList={['Usuário', 'Registro']}></CaminhoPagina>
            <UsuarioForm usuario={new Usuario()}></UsuarioForm>
        </div>
    )
}

RegistroForm.getLayout = function getLayout(page) {
    return (
        <Layout>
            {page}
        </Layout>
    )
}
