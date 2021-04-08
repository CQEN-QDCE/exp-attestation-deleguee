# Application Émmeteur d'attestations
Une interface d'usager pour émmetre des attestations fondamentales, pour soutenir les expérimentations. 

# Screenshots

(Ajouter des imprime-écrans). 

# Comment installer et déployer 

## Instalation 

D'abord, faire clone du dépôt de code: 

    git clone https://github.com/CQEN-QDCE/issuer.git

    cd issuer 
    
Par la suite, faire l'installation des dépendences du projet:

    npm install 

    npm audit fix 
    
Il est important de faire `audit fix` pour règler les problèmes de compatibilité entre les plusieurs dépendences du package. 

Après l'installation, faire le build du package

    npm run build --if-present

Une fois installé, vous avez deux choix: faire start de l'application directement par react, ou installer un serveur local. 

Pour rouler avec react, faire: 

    npm start

Accéder à la page http://localhost:10000  (si l'on assume que la porte assignée sur le fichier **/server.js** est `10000`). 

Pour faire la connexion, utiliser les credentiales suivantes: 


    user     : experimentation    
    password : cqen


## Déploiement sur Openshift 

Pour faire le déploiement sur Openshift, il faut avoir l'outil `oc` installé sur le poste local. Référez-vous à la page d'instalation de `oc` pour détails. 

Faire logon au cluster openshift avec la commande `oc login` (voir la référence d'openshift). 

Après logon, se placer dans le répertoire racine de l'application, pour faire la création d'un projet, d'un build et le deploy. Replacer `<username>` par ton nom d'usager réseau, par example, `torj01`. 

    oc new-project dec-issuer-<username> --display-name="DEC Issuer" --description="Issuer d'attestation d'identité pour le Directeur de l'état civil" 

    oc new-build --image-stream nodejs --strategy source --binary=true --name=dec-issuer-<username>

    tar -zcvf dec-deploy.tar.gz --exclude 'node_modules' --exclude 'build' --exclude 'dec-deploy.tar.gz' .

    oc start-build dec-issuer-<username> --from-archive=dec-deploy.tar.gz

    oc logs dec-issuer-<username>-1-build -f

    oc new-app dec-issuer-<username> --allow-missing-imagestream-tags 

    oc expose svc dec-issuer-<username> --name=emetteur

    oc patch svc dec-issuer-<username> --patch '{"spec":{"ports":[{"name": "8080-tcp", "port": 8080, "targetPort": 10000 }]}}'

    oc get route

    rm dec-deploy.tar.gz

Au besoin, vous pouvez vous connecter sur l'interface web d'Openshift pour créer une route sécurisée par le certificat default du serveur. 

## Opération du service d'émission

Pour exécuter le service d'émission, il faut configurer les composants qui font partie de l'infrastructure. 

Si l'on veut modifier le schema: 
---
1. Ouvrir le fichier req.issuer.http : 

- chercher la requête `/schemas`, modifier le schema selon les besoins, et la soumettre. Enregistrer la réponse http pour référence plus tard. Prendre en note la valeur des variables `schema_id`, `schema_name`, `schema_version`. 

- chercher la requête  `/credential-definitions`, modifier la variable `schema_id` par la même variable reçue en réponse dans la requête à `/schemas`. Soummetre la transaction, et prendre en note la valeur de la variable `credential_definition_id`. 

- chercher la requête `/wallet/did` et la soumettre. Prendre en note la variable `did`. 

- dans le projet `issuer`, ouvrir le fichier `/.env` et mettre à jour les variables cueillies dans les étapes anterieures. 



Dans le projet `aries-cloudagency` :  
---
0. Initialiser le serveur qui comptera avec l'application agent de l'issuer. Il se peut sur localhost (utiliser un tunnel https ngrok), ou un agent cloud déploié sur openshift. 

1. Modifier le fichier `docker-compose.yml` : 

- changer les variables `ISSUER_AGENT_ENDPOINT` et `ISSUER_HOSTNAME` avec la valeur de l'url de base de l'application; 

2. Modifier le fichier `init-issuer-test-agent.sh` : 

- changer la variable `AGENT_ENDPOINT` avec la valeur de l'url de base de l'application. 


# Troubleshooting 

Erreur 400 - cred def non existent 
---

Si vous recevez un erreur 400 après faire le scan de votre QRCode, c'est dû à une perte d'une configuration de credential-definition. On essaie de trouver la cause de cette perte de configuration pour la règler pour de bon. 

Entretemps, pour pouvoir continuer les essais, il faut versionner le schema (add +1 à la version du schema), le soumettre, et par la suite soumettre la transaction `/credential-definitions` pour la nouvelle version, tel comme décrit ci-dessus dans la section `Modifier le schema`. Prendre les nouvelles variables, mettre à jour le fichier `/.env` et repartir l'application de l'agent. 

