import { Breadcrumb } from "react-bootstrap"

export default function CaminhoPagina(props) {
    return (
        <Breadcrumb>
            {props.caminhoList.map((caminho, index) => (
                <Breadcrumb.Item key={caminho} active>{caminho}</Breadcrumb.Item>
            ))}
        </Breadcrumb>
    )
}
