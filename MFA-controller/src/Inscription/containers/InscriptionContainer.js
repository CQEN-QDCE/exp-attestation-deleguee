/*
* Copyright (c) 2020 Gouvernement du Québec
* Auteur: Julio Cesar Torres (torj01)
* SPDX-License-Identifier: LiLiQ-R-v.1.1
* License-Filename: /LICENSE
*/
import React              from 'react';
import { Container }      from 'reactstrap';
import InscriptionForm    from '../components/InscriptionForm'
import                         '../../assets/styles/LoginContainer.css'

function InscriptionContainer() {

	return (
		<div className="Root" style={{ backgroundColor: '#FCF8F7', display: "flex" }}>
			<Container >
				<InscriptionForm className="justify-content-center" />
			</Container>
		</div >
	);
}

export default InscriptionContainer;