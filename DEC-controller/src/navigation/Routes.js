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
import IQNIdentiteContainer                       from '../IQNIdentite/containers/IQNIdentiteContainer'
import QRIQNIdentiteContainer                     from '../IQNIdentite/containers/QRIQNIdentiteContainer'
import ProofIQNIdentiteContainer                  from '../IQNIdentite/containers/ProofIQNIdentiteContainer'
import QRIQNPreuveContainer                       from '../IQNPreuve/containers/QRIQNPreuveContainer'
import VerificationPreuveContainer                from '../IQNPreuve/containers/VerificationPreuveContainer'
import VerificationIdentiteContainer              from '../IQNIdentite/containers/VerificationIdentiteContainer'
import EmissionIdentiteContainer                  from '../containers/EmissionIdentiteContainer'
import Auth from '../helpers/Auth'
import ImageHanderContainer from '../ImageHandling/containers/ImageHandlerContainer'



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

					{ /* Routes attestation DEC - IQN Identité */ }
					<PrivateRoute path="/iqnidentite" component={IQNIdentiteContainer} />
					<PrivateRoute path="/qriqnidentite" component={QRIQNIdentiteContainer} />
					<PrivateRoute path="/verificationidentite" component={VerificationIdentiteContainer} />
					<PrivateRoute path="/proofiqnidentite" component={ProofIQNIdentiteContainer} />

					{ /* Routes attestation DEC - Preuve d'identité */ }
					<PrivateRoute path="/qriqnpreuve" component={QRIQNPreuveContainer} />
					<PrivateRoute path="/verificationPreuve" component={VerificationPreuveContainer} />
					<PrivateRoute path="/preuve" component={VerificationPreuveContainer} />
					<PrivateRoute path="/emissionidentite" component={EmissionIdentiteContainer} />

                    <PrivateRoute path="/imageHandler" component={ImageHanderContainer} /> 

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
