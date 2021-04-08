/*
* Copyright (c) 2020 Gouvernement du Québec
* Auteur: Julio Cesar Torres (torj01)
* SPDX-License-Identifier: LiLiQ-R-v.1.1
* License-Filename: /LICENSE
*/
import React, { useState, useEffect }      from 'react'
import { GET_API_SECRET }                  from '../config/constants'
import { GET_ISSUER_HOST_URL }             from '../config/endpoints'
import '../assets/styles/LoginContainer.css'

function EmissionIdentiteContainer(props){

	// Variables identification du schema
	const schemaName                       = window.env && window.env.IDENTITY_SCHEMA_NAME ? window.env.IDENTITY_SCHEMA_NAME : process.env.REACT_APP_SCHEMA_NAME_IDENTITE; 
	const schemaIssuerDID                  = window.env && window.env.AGENT_DID ? window.env.AGENT_DID : process.env.REACT_APP_SCHEMA_ISSUER_DID_IDENTITE; 
	const schemaVersion                    = window.env && window.env.IDENTITY_SCHEMA_VERSION ? window.env.IDENTITY_SCHEMA_VERSION : process.env.REACT_APP_SCHEMA_VERSION_IDENTITE; 
	const schemaCredDef                    = window.env && window.env.IDENTITY_CREDENTIAL_DEFINITION ? window.env.IDENTITY_CREDENTIAL_DEFINITION : process.env.REACT_APP_CRED_DEF_IDENTITE; 
			
	//console.log(props.location.state.data.photo)
	// Variables du form 
	const [id, setId]                                 = useState(props.location.state.data.id)
	const [issuanceDate, seIssuanceDate]              = useState(props.location.state.data.issuanceDate)
	const [expirationDate, setExpirationDate]         = useState(props.location.state.data.expirationDate)
	const [firstNames, setFirstNames]                 = useState(props.location.state.data.firstNames)
	const [lastName, setLastName]                     = useState(props.location.state.data.lastName)
	const [gender, setGender]                         = useState(props.location.state.data.gender)
	const [birthplace, setBirthplace]                 = useState(props.location.state.data.birthplace)
	const [birthDate, setBirthDate]                   = useState(props.location.state.data.birthDate)
	const [fatherFullName, setFatherFullName]         = useState(props.location.state.data.fatherFullName)
	const [motherFullName, setMotherFullName]         = useState(props.location.state.data.motherFullName)
	const [registrationNumber, setRegistrationNumber] = useState(props.location.state.data.registrationNumber)
	const [photo, setPhoto]                           = useState(props.location.state.data.photo)
	const [holderChoix, setHolderChoix]               = useState(props.location.state.data.holderChoix); 
	
	// Variables auxiliaires pour déterminer le holder
	let holderId    = ""; 
	let holderType  = ""; 

	useEffect(() => {
		/*console.log("EmissionIdentiteContainer.useEffect()"); 
		console.log("props.location.state.invitation.connection_id ", props.location.state.connection_id); 
		console.log("props.location.state.data.id ",                  id); 
		console.log("props.location.state.data.issuanceDate ",        issuanceDate); 
		console.log("props.location.state.data.expirationDate ",      expirationDate); 
		console.log("holder.id",                                      ""); 
		console.log("holder.type ",                                   ""); 
		console.log("props.location.state.data.firstNames ",          firstNames); 
		console.log("props.location.state.data.lastName ",            lastName); 
		console.log("props.location.state.data.gender ",              gender); 
		console.log("props.location.state.data.birthplace ",          birthplace); 
		console.log("props.location.state.data.birthDate ",           birthDate); 
		console.log("props.location.state.data.fatherFullName ",      fatherFullName); 
		console.log("props.location.state.data.motherFullName ",      motherFullName); 
		console.log("props.location.state.data.registrationNumber ",  registrationNumber);  */

		let emissionOk = validation();
		//console.log("OK? " + emissionOk); 
	 	if(emissionOk){
	 		issueCredential(); 
	 	}else {
	 		alert("L'émission n'est pas correcte, il faut vérifier data");
	 	}
	 }, []);

    function validation(){
		//console.log("EmissionIdentiteContainer.validation()");
		let valid = false; 
		
		if(props.location.state.data.holderChoix === 'Your child' | 
		props.location.state.data.holderChoix === 'Votre enfant'){
			holderId   = props.location.state.parentId;
			holderType = "Parent"
		} else {
			holderId   = "null"
			holderType = "null"
		}

		let nomComplet = props.location.state.parentFirstNames + " " + props.location.state.parentLastName; 
		/*console.log("["+ nomComplet.toLowerCase + "]")
		console.log("["+ motherFullName.toLowerCase + "]")  */
        if(nomComplet === props.location.state.data.motherFullName){
            valid = true;
        } else if(nomComplet === props.location.state.data.fatherFullName){
			valid = true; 
		}
		
		return valid;
    }

    function issueCredential() {
		// console.log("EmissionIdentiteContainer.issueCredential()");
		fetch(`/issue-credential/send`,
			{
				method: 'POST',
				body: JSON.stringify({
					"schema_name"          : schemaName,
					"schema_version"       : schemaVersion, 
					"schema_issuer_did"    : schemaIssuerDID,
					"connection_id"        : props.location.state.connection_id,
					"cred_def_id"          : schemaCredDef,
					"credential_proposal": {
						"@type": "did:sov:BzCbsNYhMrjHiqZDTUASHg;spec/issue-credential/1.0/credential-preview",
						"attributes": [
                            {
								"name": "holder.id",
								"value": holderId
							},
							{
								"name": "holder.type",
								"value": holderType
                            },
                            {
								"name": "issuanceDate",
								"value": props.location.state.data.issuanceDate
							},
							{
								"name": "expirationDate",
								"value": props.location.state.data.expirationDate
                            },
                            {
								"name": "credentialSubject.id",
								"value": props.location.state.data.did
							},
							{
								"name": "credentialSubject.firstNames",
								"value": props.location.state.data.firstNames
                            },
                            {
								"name": "credentialSubject.lastName",
								"value": props.location.state.data.lastName
							},
                            {
								"name": "credentialSubject.gender",
								"value": props.location.state.data.gender
							},
                            {
								"name": "credentialSubject.birthplace",
								"value": props.location.state.data.birthplace
							},
                            {
								"name": "credentialSubject.birthDate",
								"value": props.location.state.data.birthDate
							},
                            {
								"name": "credentialSubject.fatherFullName",
								"value": props.location.state.data.fatherFullName
							},
                            {
								"name": "credentialSubject.motherFullName",
								"value": props.location.state.data.motherFullName
							},
                            {
								"name": "credentialSubject.registrationNumber",
								"value": props.location.state.data.registrationNumber
                            }, 
                            {
								"name": "credentialSubject.photo",
								"value": props.location.state.data.photo
                            }
						]
					}, 
					"comment" : "Émission d'attestation d'Identité IQN"
				}),
				headers: {
					'HOST'         : `${GET_ISSUER_HOST_URL}`,
					'X-API-Key'    : `${GET_API_SECRET()}`,
					'Content-Type' : 'application/json; charset=utf-8'
				}
			 }).then((resp => props.history.replace('/proofiqnidentite', props.location.state)))
	}

    return(
		<div>
			<h3> Erreur d'émission </h3>
			<h6> Si vous demandez une attestation pour un enfant, assurez-vous de présenter 
				 les attributs de la mère de l'enfant à la demande de preuve d'identité.</h6>
			<p> Merci d'essayer une autre fois. </p>
		</div>
    );
}

export default EmissionIdentiteContainer;