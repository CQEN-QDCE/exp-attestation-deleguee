# PES Émetteur d'attestation numérique (DEC - Directeur de l'état civil)

Cette application offre le service d'émission d'une attestation numérique de base dans le cadre du projet SQIN. 

L'attestation peut être émise pour la personne representant elle même

Introduction to the subject of the file. Describe as much as possible the general context of your project or the subject treated by this markdown.

### Synopsis

At the top of the file there should be a short introduction and/ or overview that explains **what** the project is. This description should match descriptions added for package managers (Gemspec, package.json, etc.)

### Motivation

A short description of the motivation behind the creation and maintenance of the project. This should explain why the project exists.

## Getting Started

Ces instructions vous permettront d'avoir une copie du projet configuré dans votre poste local pour faire du développement et des tests. Voyez la section deployement pour 
des détails spécifiques comment déploier le projet dans un serveur. 

### Prerequisites

Pour avoir une copie en état clean dans votre podes, vous devez installer ou configurer certains outils que vous aideront à faire le build et le déploiement. 


1. **Node.js**

2. **npm - Node package manager**

3. **Porteufeuille numérique**

4. 

```
Give examples
```

### Installing

D'abord, faites clone du dépôt de code

```
$ git clone https://github.com/CQEN-QDCE/issuer.git

$ cd issuer 
```
    
Par la suite, faites l'installation des dépendences du projet

```
$ npm install 
$ npm audit fix 
``` 
    
Il est important de faire `npm audit fix` pour règler les problèmes de compatibilité entre les plusieurs dépendences du package, qui sont causées lors du processus d'installation principale. Vérifiez si la `sysout` vous donne d'autres indices d`actions à prendre (mise-à-jour de packages, packages manquantes, etc). Suivez ces instructions, elles sont importantes et aident dans la suite de votre setup. 

Après l'installation, faites le build du package

```
$ npm run build 
``` 

Une fois installé, vous êtes prêt pour rouler l'application directement par react, ou  

Pour rouler avec react, faire: 

    npm start

Accéder à la page http://localhost:10000  (si l'on assume que la porte assignée sur le fichier **/server.js** est `10000`). 

Pour faire la connexion, utiliser les credentiales suivantes: 


    user     : experimentation    
    password : cqen














A step by step series of examples that tell you how to get a development env running

Say what the step will be

```
Give the example
```

And repeat

```
until finished
```

End with an example of getting some data out of the system or using it for a little demo

## Running the tests

Explain how to run the automated tests for this system

### Break down into end to end tests

Explain what these tests test and why

```
Give an example
```

### And coding style tests

Explain what these tests test and why

```
Give an example
```

## Deployment

Add additional notes about how to deploy this on a live system

## Fait avec

* [ReactJS](https://reactjs.org/) - Librairie d'interface d'usager 
* [NodeJS](https://nodejs.org/) - Environnement de runtime cross-plateforme Javascript 
* [npm](https://www.npmjs.com/) - Dependency Management pour Node


## Contribuire 

Merci de lire le fichier [CONTRIBUTING.md](https://gist.github.com/PurpleBooth/b24679402957c63ec426) pour les détails de notre code of conduct, et le processus pour ouvrir une soumission de pull requests à nous. 

## Versionnement

On utilise [SemVer](http://semver.org/) pour faire le versionnement. Ses dernière versions sont disponibles dans le site [tags on this repository](https://github.com/your/project/tags). 

## Auteur

* **Julio Cesar Torres** - *Initial work* - [julio_torres](mailto:julio_cesar.torres@sct.gouv.qc.ca)

Voyez aussi la liste des contributeurs [contributors](https://github.com/your/project/contributors) qui ont participé à ce projet. 

## License

Ce projet est licensé sous la **LiLiQ-P: Licence Libre du Québec – Permissive** - voyez le fichier [LICENSE.md](LICENSE.md)pour les détails. 


## Troubleshooting 

### Erreur 400 - cred def non existent 


Si vous recevez un erreur 400 après faire le scan de votre QRCode, c'est dû à une perte d'une configuration de credential-definition. On essaie de trouver la cause de cette perte de configuration pour la règler pour de bon. 

Entretemps, pour pouvoir continuer les essais, il faut versionner le schema (add +1 à la version du schema), le soumettre, et par la suite soumettre la transaction `/credential-definitions` pour la nouvelle version, tel comme décrit ci-dessus dans la section `Modifier le schema`. Prendre les nouvelles variables, mettre à jour le fichier `/.env` et repartir l'application de l'agent. 