import cx from 'classnames';
import { signIn } from 'next-auth/react';
import { useState } from "react"
import styles from '@/styles/Login.module.css'
import { getCsrfToken } from "next-auth/react"
import { Alert } from 'react-bootstrap';
import { useRouter } from 'next/router'

export default function Login({ csrfToken }) {
    const router = useRouter()

    const [email, setEmail] = useState('')
    const [senha, setSenha] = useState('')
    const [error, setError] = useState(null)

    const handleSubmit = async(event) => {
        event.preventDefault();

        const res = await signIn('credentials', {
            redirect: false,
            email: email,
            senha: senha,
            callbackUrl: `${window.location.origin}`,
        });

        if (res?.error) {
            setError("E-mail e/ou senha inválidos");
            return
        }

        router.push("/tarefas")
    }

    return (
        <div className="container">

            <main className={styles["form-signin"]}>

                {error &&
                    <Alert key="danger" variant="danger">{error}</Alert>
                }

                <div className="card">
                    <div className="card-body">

                        <form method="post" onSubmit={handleSubmit}>
                            <input name="csrfToken" type="hidden" defaultValue={csrfToken} />
                            <h2 className="h3 mb-3 fw-normal text-center">Login</h2>

                            <div className="form-group login-form-group">
                                <label className={styles["login-label"]}>E-mail</label>
                                <input
                                    type="email"
                                    className="form-control form-control-lg"
                                    placeholder="Endereço de e-mail"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>

                            <div className={cx(styles["login-form-group"], "form-group")}>
                                <label className={styles["login-label"]}>Senha</label>
                                <input
                                    type="password"
                                    className="form-control form-control-lg"
                                    placeholder="Senha"
                                    value={senha}
                                    onChange={(e) => setSenha(e.target.value)}
                                />
                            </div>

                            <button className={cx(styles["login-button"], "w-100", "btn", "btn-lg",
                                "btn-primary")} type="submit">OK</button>
                        </form>
                    </div>
                </div >
                <p className="mt-3 mb-3 text-muted text-center">By Samuel Santos</p>
            </main >
        </div>

    )
}

export async function getServerSideProps(context) {
    return {
        props: {
            csrfToken: await getCsrfToken(context),
        },
    }
}
