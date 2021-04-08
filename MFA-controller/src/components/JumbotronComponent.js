/*
* Copyright (c) 2020 Gouvernement du Québec
* Auteur: Julio Cesar Torres (torj01)
* SPDX-License-Identifier: LiLiQ-R-v.1.1
* License-Filename: /LICENSE
*/
import React               from 'react'
import { useTranslation }  from 'react-i18next'
import '../assets/styles/JumbotronComponent.css'

const JumbotronComponent = () => {
  const { t } = useTranslation();
  return (
    <header>
      <div className="pt-5 container-fluid text-center" >
        <div className="row" >
          <div className="col-md-7 col-sm-12">
          
            <h1>Guichet unique d’accès aux services de garde</h1>
            <p className="lead">
            Le ministère de la Famille a suscité et soutenu la mise en place du guichet unique d’accès aux services de garde, 
            aussi appelé La Place 0-5, afin de simplifier les démarches des parents à la recherche d’une place en service de garde.
            </p>
          </div>
          <div className="col-md-5 col-sm-12">
            &nbsp;
          </div>
        </div>
      </div>
    </header>
  );
};

export default JumbotronComponent;