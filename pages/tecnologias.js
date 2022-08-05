import { Table } from "react-bootstrap"
import CaminhoPagina from "../components/breadcrumb"
import Layout from "@/components/layout"

export default function Tecnologias({ tecnologiaList }) {
    if (!tecnologiaList) return <p>Não existem tecnologias</p>

    return (
        <div>
            <CaminhoPagina caminhoList={['Tecnologias', 'Listagem']}></CaminhoPagina>

            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>Id</th>
                        <th>Nome</th>
                        <th>Tipo</th>
                    </tr>
                </thead>
                <tbody>
                    {tecnologiaList.map((tecnologia, index) => (
                        <tr key={index}>
                            <td>{tecnologia.id}</td>
                            <td>{tecnologia.nome}</td>
                            <td>{tecnologia.tipo}</td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </div>
    )
}

export async function getServerSideProps() {
    // Fetch data from external API
    const baseUrl = process.env.NEXTAUTH_URL;
    const res = await fetch(`${baseUrl}/rest/api/tecnologias`)
    const tecnologiaList = await res.json()
  
    // Pass data to the page via props
    return { props: { tecnologiaList } }
  }

Tecnologias.getLayout = function getLayout(page) {
    return (
        <Layout>
            {page}
        </Layout>
    )
}

