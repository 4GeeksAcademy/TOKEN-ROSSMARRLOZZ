import React, { useContext, useState, useEffect } from "react";
import { Context } from "../store/appContext";
import { Form, Button, Container } from 'react-bootstrap';
import "../../styles/home.css";
import { useNavigate } from "react-router-dom";

export const Login = ({ onLogin }) => {
    const { actions } = useContext(Context);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    // limpiar el formulario al montar el componente
    useEffect(() => {
        setEmail("");
        setPassword("");
        setError("");
    }, []);

    const handleClick = async (e) => {
        e.preventDefault();
        try {
            const result = await actions.Login(email, password);
            if (result && result.access_token) {
                onLogin();
                navigate("/Private");
            } else {
                setError("Error al iniciar sesión. Por favor, verifique sus credenciales.");
            }
        } catch (error) {
            setError("Hubo un problema al iniciar sesión. Inténtalo nuevamente.");
        }
    };

    return (
        <Container className="estiloTexto">
            <Form onSubmit={handleClick}>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>Por favor, escribe tu email</Form.Label>
                    <Form.Control
                        type="email"
                        placeholder="Enter email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required 
                    />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicPassword">
                    <Form.Label>Por favor, escribe tu contraseña</Form.Label>
                    <Form.Control
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required 
                    />
                </Form.Group>

                {error && <div className="text-danger">{error}</div>}

                <Button variant="primary" type="submit">
                    Pulsa aquí para iniciar sesión
                </Button>
            </Form>
        </Container>
    );
};
