import React, { useContext, useEffect, useRef } from "react";
import { Context } from "../store/appContext";
import { useNavigate } from "react-router-dom";

export const Private = () => {
    const { actions } = useContext(Context);
    const navigate = useNavigate();
    const hasVerifiedToken = useRef(false); // es para evitar que se llame muchas veces

    useEffect(() => {
        const verifyToken = async () => {
            if (hasVerifiedToken.current) return; 
            hasVerifiedToken.current = true; 

            console.log("Verificando token...");
            const token = sessionStorage.getItem('token');

            if (!token) {
                console.log("No hay token, redirigiendo a Login...");
                navigate("/Login");
                return;
            }

            try {
                await actions.checkTokenValidity(); 
            } catch (error) {
                console.error("Error al verificar el token:", error);
                navigate("/Login");
            }
        };

        verifyToken(); 

    }, [navigate, actions]);

    return (
        <div className="text-center mt-5">
            <h1>Bienvenido a tu área privada</h1>
        </div>
    );
};
