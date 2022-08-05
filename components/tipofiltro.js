import { Form } from "react-bootstrap";

export default function TipoFiltroSelect(props) {
    return (
        <Form.Select value={props.value}
            onChange={(e) => props.change(e.target.value)}
        >
            <option>Selecione</option>
            <option value="T">Todos</option>
            <option value="H">Hoje</option>
            <option value="A">Amanhã</option>
            <option value="S">Semana</option>
        </Form.Select>
    )
}
