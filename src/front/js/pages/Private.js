import React, { useContext } from "react";
import { Context } from "../store/appContext";
import "../../styles/home.css";

export const Private = () => {
	const { store, actions } = useContext(Context);

	return (
		<div className="text-center mt-5">
			<h1>Bievenido a tu área privada</h1>
		</div>
	);
};
