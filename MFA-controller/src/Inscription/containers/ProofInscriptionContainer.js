/*
* Copyright (c) 2020 Gouvernement du Québec
* Auteur: Julio Cesar Torres (torj01)
* SPDX-License-Identifier: LiLiQ-R-v.1.1
* License-Filename: /LICENSE
*/
import React                   from 'react';
import ProofInscriptionForm    from '../components/ProofInscriptionForm';
import                              '../../assets/styles/ProofContainer.css';

const ProofInscriptionContainer = (props) => {
    
    return (
        <ProofInscriptionForm data={props.location.state}/>
    );
};

export default ProofInscriptionContainer;