import { Alert } from "react-bootstrap"

export default function Mensagem(props) {

    const getVariant = (tipo) => {
        if (tipo === 'error') {
            return 'danger';

        } else {
            return tipo;
        }
    }

    return (
        <Alert key={props.tipo} variant={getVariant(props.tipo)}>{props.descricao}</Alert>
    )
}
