import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Switch, Redirect } from "react-router-dom";
import Subscriptions from "./pages/Subscriptions";
import { Container } from "./components/Grid";
import Subscription from "./pages/Subscription";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import NoMatch from "./pages/NoMatch";
import Head from "./components/Head";
import Navbar from "./components/Navbar";
import userAPI from "./utils/userAPI";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
	const [userState, setUserState] = useState({});

	useEffect(() => {
		// auth user on first render
		authenticate()
	}, []);

	//user authentication
	function authenticate() {
		return userAPI.authenticateUser()
			.then(({ data }) => {
				console.log('user:', data);
				setUserState(data);
			})
			.catch((err) => console.log('registered user:', err.response));
	}

	return (
		<Router>
			<Navbar 
			// {...props}
				username={userState.username}
				// userState={userState}
				// setUserState={setUserState}
			// setUserState={setUserState}
			/>
			<Head />
			<Container>
				<Switch>
					<Route
						exact
						path='/'
						render={props => (
							<Login
								{...props}
								userState={userState}
								setUserState={setUserState}
							/>
						)}
					/>
					<Route
						exact
						path='/signup'
						render={props => (
							<Signup
								{...props}
								authenticate={authenticate}
								user={userState}
							/>
						)}
					/>
					<ProtectedRoute exact path={["/", "/subscriptions"]}>
						<Subscriptions {...userState} />
					</ProtectedRoute>
					<ProtectedRoute exact path='/subscriptions/:id' >
						<Subscription {...userState} />
					</ProtectedRoute>
					<Route component={NoMatch} />
				</Switch>
			</Container>
			{ userState.email ? <Redirect to="/subscriptions" /> 
			// added this code - Peter
			: <Redirect to="/" />}

		</Router>
	);
}

export default App;
