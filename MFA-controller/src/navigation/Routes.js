/*
* Copyright (c) 2020 Gouvernement du Québec
* Auteur: Julio Cesar Torres (torj01)
* SPDX-License-Identifier: LiLiQ-R-v.1.1
* License-Filename: /LICENSE
*/
import React                                      from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import HeaderComponent                            from '../components/HeaderComponent'
import FooterComponent                            from '../components/FooterComponent'
import MainContainer                              from '../containers/MainContainer'
import LoginContainer                             from '../containers/LoginContainer'
import NoAuthContainer                            from '../containers/NoAuthContainer'
import InscriptionContainer                       from '../Inscription/containers/InscriptionContainer'
import QRInscriptionContainer                     from '../Inscription/containers/QRInscriptionContainer'
import VerificationPreuveContainer                from '../Inscription/containers/VerificationPreuveContainer'
import ProofInscriptionContainer                  from '../Inscription/containers/ProofInscriptionContainer'
import Auth from                                       '../helpers/Auth'

const PrivateRoute = ({ component, ...options }) => {
	const finalComponent = Auth.getAuth() ? component : NoAuthContainer;
	return <Route {...options} component={finalComponent} />;
  };

function Routes() {
	return (
		<Router>
			<div>
				<Route component={HeaderComponent}/>
				<Switch>

					{ /* Routes attestation DEC - IQN Identité */}
					<PrivateRoute path="/inscription" component={InscriptionContainer} />
					<PrivateRoute path="/qrinscription" component={QRInscriptionContainer} />
					<PrivateRoute path="/verificationPreuve" component={VerificationPreuveContainer} />
					<PrivateRoute path="/preuveinscription" component={ProofInscriptionContainer} />

					{ /* Routes de base de l'app */ }
					<Route path="/noauth" component={NoAuthContainer} />
					<Route path="/login"  component={LoginContainer} />
					<Route path="/" exact component={MainContainer} />

				</Switch>
				<FooterComponent />
			</div>
		</Router>
	)
}

export default Routes
