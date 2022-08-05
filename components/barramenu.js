import { signOut, useSession } from "next-auth/react"
import { useRouter } from "next/router"
import { useState } from "react"
import { Container, Form, FormControl, Nav, Navbar, NavDropdown, Button } from "react-bootstrap"

export default function BarraMenu() {

    const router = useRouter()

    const { data: session } = useSession()
    const [search, setSearch] = useState('')

    const logout = async (event) => {
        event.preventDefault();
        await signOut({
            callbackUrl: `${window.location.origin}`
        });
    }

    const pesquisar = (event) => {
        event.preventDefault();

        router.push('/tarefas?search=' + search)
    }

    return (
        <Navbar bg="barra-menu" variant="dark">
            <Container fluid>
                <Navbar.Brand>ToDoList</Navbar.Brand>
                <Navbar.Toggle aria-controls="responsive-navbar-nav" />

                {session && (
                    <Navbar.Collapse id="responsive-navbar-nav">
                        <Nav className="me-auto">
                            <Nav.Link href="/tarefas">Tarefas</Nav.Link>
                            <Nav.Link href="/preferencias">Preferências</Nav.Link>
                        </Nav>
                    </Navbar.Collapse>
                )}

                {!session && (
                    <Navbar.Collapse className="me-auto justify-content-end">
                        <Nav>
                            <Nav.Link href="/usuarios/registro">Registre-se</Nav.Link>
                            <Nav.Link href="/login">Login</Nav.Link>
                        </Nav>
                    </Navbar.Collapse>
                )}

                {session && (
                    <Navbar.Collapse className="me-auto justify-content-end">
                        <Nav>

                            <Form className="d-flex">
                                <FormControl
                                    type="search"
                                    placeholder="Pesquisar"
                                    className="me-2"
                                    aria-label="Pesquisar"
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                                <Button variant="secondary" onClick={pesquisar} >OK</Button>
                            </Form>

                            <NavDropdown title={session.user.nome.toUpperCase()} id="collasible-nav-dropdown">
                                <NavDropdown.Item href="/usuarios/meusdados">Meus dados</NavDropdown.Item>
                                <NavDropdown.Item onClick={logout}>Sair</NavDropdown.Item>
                            </NavDropdown>

                        </Nav>
                    </Navbar.Collapse>
                )}

            </Container>
        </Navbar>
    )
}
