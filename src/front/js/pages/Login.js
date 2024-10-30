import React, { useContext, useState } from "react";
import { Context } from "../store/appContext";
import { Form, Button, Container } from 'react-bootstrap';
import "../../styles/home.css";
import { useNavigate } from "react-router-dom";


export const Login = () => {
	const { actions } = useContext(Context);
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");
	const navigate = useNavigate(); 

  const handleClick = async (e) => {
		e.preventDefault(); 
		try {
			const result = await actions.Login(email, password);
			if (result && result.access_token) {  
				sessionStorage.setItem('token', result.access_token); 
				navigate("/Private"); 
			} else {
				setError("Login failed. Please check your credentials."); 
			}
		} catch (error) {
			setError("There was a problem logging in. Please try again."); 
		}
	};       
  
  // const fetchToken = {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json"
  //     },
  //     body: JSON.stringify({ email, password }) 
  //   };

  //   fetch("https://scary-wand-v6p499j44g69cp7jq-3001.app.github.dev/api/token", fetchToken)
  //     .then(response => {
  //       if (response.status === 200) {
  //         return response.json(); 
  //       } else {
  //         throw new Error("Network response was not ok"); 
  //       }
  //     })
  //     .then(data => {
  //       console.log("Login successful:", data);
  //       sessionStorage.setItem('token', data.access_token); 
  //     })
  //     .catch(error => {
  //       console.error("There was a problem with the fetch operation:", error);
  //       setError("There was a problem logging in. Please check your credentials and try again."); 
  //     });
  // };

  return (
    <Container>
      <Form onSubmit={handleClick}> 
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>Email</Form.Label>
          <Form.Control 
            type="email" 
            placeholder="Enter email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)} // Actualizar estado al escribir
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control 
            type="password" 
            placeholder="Password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)} // Actualizar estado al escribir
          />
        </Form.Group>

        {error && <div className="text-danger">{error}</div>} {/* Mostrar errores si existen */}

        <Button variant="primary" type="submit">
          Submit
        </Button>
      </Form>
    </Container>
  );
};
