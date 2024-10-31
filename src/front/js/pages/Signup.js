import React, { useState, useContext } from "react";
import { Form, Button, Container } from 'react-bootstrap';
import { useNavigate } from "react-router-dom";
import { Context } from "../store/appContext"; 

export const Signup = () => {
    const { actions } = useContext(Context); 
    const [email, setEmail] = useState(""); 
    const [password, setPassword] = useState(""); 
    const [error, setError] = useState(""); 
    const [loading, setLoading] = useState(false); 
    const navigate = useNavigate(); 

    const handleRegister = async (e) => {
        e.preventDefault(); 
        setLoading(true); 
        setError("");         
        try {
            const result = await actions.Signup(email, password); 
            if (result) {
                navigate("/login"); 
            }
        } catch (error) {
            setError(error.message || "No se pudo registrar. Inténtalo de nuevo.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container className="estiloTextoSignup">
            <h2>Por favor, resgístrate</h2> 
            <Form onSubmit={handleRegister}>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>Ingresa un email </Form.Label>
                    <Form.Control
                        type="email"
                        placeholder="Escribe aquí tu email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required 
                    />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicPassword">
                    <Form.Label>Ingresa una contraseña</Form.Label>
                    <Form.Control
                        type="password"
                        placeholder="Escribe aquí tu contraseña"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)} 
                        required 
                    />
                </Form.Group>

                {error && <div className="text-danger">{error}</div>} 

                <Button variant="primary" type="submit" disabled={loading}>
                    {loading ? "Registrando..." : "Registrar"} 
                </Button>
            </Form>
        </Container>
    );
};
