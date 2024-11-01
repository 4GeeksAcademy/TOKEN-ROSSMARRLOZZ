const getState = ({ getStore, getActions, setStore }) => {
	return {
		store: {
			message: null,
			user: null, 
            token: sessionStorage.getItem('token') || null, 
			isAuthenticated: !!sessionStorage.getItem('token'), 
			Signup: null,
			demo: [
				{
					title: "FIRST",
					background: "white",
					initial: "white"
				},
				{
					title: "SECOND",
					background: "white",
					initial: "white"
				}
			]
		},
		actions: {
			// Use getActions to call a function within a function
			exampleFunction: () => {
				getActions().changeColor(0, "green");
			},

			getMessage: async () => {
				try{
					// fetching data from the backend
					const resp = await fetch(process.env.BACKEND_URL + "/api/hello")
					const data = await resp.json()
					setStore({ message: data.message })
					// don't forget to return something, that is how the async resolves
					return data;
				}catch(error){
					console.log("Error loading message from backend", error)
				}
			},
			changeColor: (index, color) => {
				//get the store
				const store = getStore();

				//we have to loop the entire demo array to look for the respective index
				//and change its color
				const demo = store.demo.map((elm, i) => {
					if (i === index) elm.background = color;
					return elm;
				});

				//reset the global store
				setStore({ demo: demo });
			},
			
			Login: async (email, password) => {
				const fetchToken = {
					method: "POST",
					headers: {
						"Content-Type": "application/json"
					},
					body: JSON.stringify({ email, password })
				};
			
				try {
					const response = await fetch("https://scary-wand-v6p499j44g69cp7jq-3001.app.github.dev/api/token", fetchToken);
					if (response.status === 200) {
						const data = await response.json(); 
						sessionStorage.setItem('token', data.access_token); 
						setStore({ token: data.access_token, isAuthenticated: true });
						return data; 
					} else {
						const errorData = await response.json();
						throw new Error(errorData.msg || "Network response was not ok");
					}
				} catch (error) {
					console.error("Error during login:", error);
					throw error; 
				}
			},

			Logout: async () => {
				const token = sessionStorage.getItem('token');
				const fetchLogout = {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						"Authorization": `Bearer ${token}`
					}
				};
			
				try {
					const response = await fetch("https://scary-wand-v6p499j44g69cp7jq-3001.app.github.dev/api/logout", fetchLogout);
					if (response.status === 200) {
						sessionStorage.removeItem('token');
						setStore({ token: null, isAuthenticated: false });
					} else {
						const errorData = await response.json(); 
						throw new Error(errorData.msg || "Error al cerrar sesión");
					}
				} catch (error) {
					console.error("Error durante el logout:", error);
				}
			},

			Signup: async (email, password) => {
				const fetchSignup = {
					method: "POST",
					headers: {
						"Content-Type": "application/json"
					},
					body: JSON.stringify({ email, password })
				};
			
				try {
					const response = await fetch("https://scary-wand-v6p499j44g69cp7jq-3001.app.github.dev/api/signup", fetchSignup);
					if (response.status === 201) {
						const data = await response.json();
						return data; 
					} else {
						const errorData = await response.json();
						throw new Error(errorData.msg || "Failed to register");
					}
				} catch (error) {
					console.error("Error during registration:", error);
					throw error; 
				}
			}, 

			checkTokenValidity: async () => {
				const token = sessionStorage.getItem('token');
				if (!token) {
					setStore({ isAuthenticated: false });
					return;
				}
			
				const fetchVerify = {
					method: "GET",
					headers: {
						"Authorization": `Bearer ${token}`
					}
				};
			
				try {
					const response = await fetch("https://scary-wand-v6p499j44g69cp7jq-3001.app.github.dev/api/verify-token", fetchVerify);
					if (response.status === 200) {
						setStore({ isAuthenticated: true });
					} else {
						sessionStorage.removeItem('token');
						setStore({ token: null, isAuthenticated: false });
					}
				} catch (error) {
					console.error("Error verifying token:", error);
					sessionStorage.removeItem('token');
					setStore({ token: null, isAuthenticated: false });
				}
			},
					}
	};
};


export default getState;
