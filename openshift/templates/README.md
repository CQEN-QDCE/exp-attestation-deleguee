# Attestation déléguée

L'environnement d'expérimentation du CQEN est basé sur AWS & OpenShift (OKD).

Pour reproduire l'expérimentation vous allez installer les composants suivants:

- une chaîne de bloc (Blockchain)
- un explorateur de bloc (Ledger Client)
- une base de donnée (kms - key management service)
- un agent de communication (Agent)
- un site web comme controlleur (controller)

---

## Configurer le registre distribué

Pour reproduire l'expérimentation, vous pouvez utiliser un registre distribué déjà installé comme le staging Net de [sovrin](https://sovrin.org) ou vous pouvez vous installer un [VON-Network](https://github.com/bcgov/von-network). C'est un réseau de noeuds Indy de niveau développement comprenant un explorateur de bloc (Ledger Client).

---

## Configurer l'agent de communication

### [Optionel] Changement des libellés

Si vous souhaitez changer le nom des organismes utilisés dans la démo, vous pouvez spécifier le paramètre "AGENT_NAME" lors du lancement des gabarits de déploiement. Les valeurs par défauts sont "Registre Québec" et "Curateur public du Québec".

### Créer un DID public sur votre chaîne de bloc

Pour que l'agent de communication puisse émettre des attestations, il est nécessaire de créer un DID public sur votre chaîne de bloc ou réutiliser celui de la démo '000000000000DirecteurEtatCivilQc'. Si vous avez installé un [VON-Network](https://github.com/bcgov/von-network) de la Province de la Colombie Britannique et que vous avez configurer l'explorateur de bloc, vous pouvez utiliser son interface graphique pour créer un DID public. Si vous utilisez une autre chaîne de bloc que la votre, vous devrez utiliser les outils fournis pour le faire.

<p align="center">
  <img src="../../images/NewDID.png" label="Explorateur de bloc" />

  <br>
  <b>Création d'un DID</b>
</p>

---

## Créer le projet openshift

Vous pouvez procéder par votre interface graphique ou voici la procédure par ligne de commande.

- Authentifiez-vous à OpenShift sur votre terminal, habituellement vous trouverez la ligne de commande à utiliser dans l'interface graphique

```bash
oc new-project exp-att-del --display-name="Expérimentation Attestation Déléguée" --description="Expérimentation sur l'Attestation Déléguée en verifiable credential"
```

Assurez-vous d'êtres sur le bon projet

```bash
oc project exp-att-del
```

---

## Configurer clé d'accès github (optionel seulement si votre dépôt GitHub est privé)

### Créer le répertoire des clés

Ce répertoire faisant partie du .gitignore vous permettra de ne pas divulger vos paires de clés cryptographiques.

```bash
mkdir .ssh
cd .ssh
```

### Créer les clés de déploiment SSH

```bash
ssh-keygen -C "openshift-source-builder/exp-att-del@github" -f exp-att-del -N ''
```

### Configurer la clé privée de déploiment dans le projet OpenShift

```bash
oc create secret generic exp-att-del --from-file=ssh-privatekey=exp-att-del --type=kubernetes.io/ssh-auth
```

oc delete secret exp-att-del

```bash
oc secrets link builder exp-att-del
```

### Configurer la clé publique de déploiment dans le projet GitHub

Copier la clé sur Windows

```bash
xclip -sel c < exp-att-del.pub
```

Copier la clé sur Mac OSX

```bash
cat exp-att-del.pub | pbcopy
```

Ouvrir votre dépôt github, le notre est: https://github.com/CQEN-QDCE/Attestation-Deleguee

- Dans l'onglet 'Settings',
- sous onglet 'Deploy keys',
  - supprimer la clé nommée 'openshift-source-builder' si elle existe
- Ajouter une clé nommée 'openshift-source-builder'
- et coller le contenu de la clé publique récupérée avec la commande xclip ou pbcopy (CTRL-V) ou (CMD-V)

### Supprimer les fichiers de clés

```
rm exp-att-del && rm exp-att-del.pub
```
> **_NOTE:_** Cette étape sert à ne pas laisser inutilement trainer des informations sensibiles sur votre poste.
---

## Démarrer l'installation des contrôleurs

```bash
oc process -f openshift/templates/dec-template.yml -p GITHUB_WEBHOOK_SECRET='$(cat .ssh/exp-att-del)' | oc apply -f -
```

```bash
oc process -f openshift/templates/mfa-template.yml | oc apply -f -
```

## Générer le schéma et la définition de l'attestation sur la chaîne de bloc

### Créer le schéma.
> **_NOTE:_** Changer l'url de l'agent selon votre installation. Les valeurs "schema_name" et "schema_version" peuvent être modifiées selon vos besoins.
```bash
curl -i -X POST "http://dec-agent-admin.apps.exp.lab.pocquebec.org/schemas" -H "accept: application/json" -H "X-Api-Key: " -H "Content-Type: application/json-patch+json" -d "{\"schema_name\": \"IQNIDENTITE\",\"schema_version\":\"1.0\",\"attributes\":[\"holder.id\",\"holder.type\",\"issuanceDate\",\"expirationDate\",\"credentialSubject.id\",\"credentialSubject.firstNames\",\"credentialSubject.lastName\",\"credentialSubject.gender\",\"credentialSubject.birthplace\",\"credentialSubject.birthDate\",\"credentialSubject.fatherFullName\",\"credentialSubject.motherFullName\",\"credentialSubject.registrationNumber\",\"credentialSubject.photo\"]}"
```

### Créer la définition de l'attestation.
> **_NOTE:_** La valeur "schema_id" doit être remplacée par celle obtenue à la sortie de l'étape précédente.
```bash
curl -i -X POST "http://dec-agent-admin.apps.exp.lab.pocquebec.org/credential-definitions" -H "accept: application/json" -H "X-Api-Key: " -H "Content-Type: application/json-patch+json" -d "{\"support_revocation\": false,\"tag\": \"Identite-IQN\",\"schema_id\": "Ep31SvFAetugFPe5CGzJxt:2:IQNIDENTITE:1.0"}"
```
> **_NOTE:_** Conserver la valeur "credential_definition_id"

## Ajustements post déploiment
Certains ajustements supplémentaires sont nécessaires après le premier déploiement. Pour ce faire:

1. Accéder à votre console OpenShift;

2. Sélectionner le projet que vous venez de déployer;

### Ajuster la configuration de l'application
3. Dans le menu de navigation, ouvrer l'option "Workloads";

4. Sélectionner l'option 'Config Maps';

5. Ouvrer 'dec-controller' en édition; 

6. Modifier les valeurs de la clé 'config.js' avec celles générées aux étapes précédentes.

### Ajuster les variables d'environnement

7. Dans le menu de navigation, dans la section 'Workloads', sélectionner 'Deployment Configs';

8. Sélectionner 'dec-agent';

9. Dans l'onglet 'Environment', ajuster les valeurs suivantes:

    * AGENT_DID_SEED -> Valeur d'initialisation de l'identitifiant décentralisé public de l'agent (ex: 000000000000DirecteurEtatCivilQc)

    * AGENT_DID -> Identitifiant décentralisé public de l'agent (ex: Ep31SvFAetugFPe5CGzJxt)

    * GENESIS_FILE_URL -> URL de téléchargement du fichier genesis

    * AGENT_ENDPOINT -> Point de terminaison entrant de l'agent

    * AGENT_ADMIN_ENDPOINT -> Point de terminaison de l'agent

10. Sauvegarder;

11. Sélectionner 'dec-controller';

12. Dans l'onglet 'Environment', modifier les valeurs suivantes:

    * REACT_APP_ISSUER_HOST_URL -> Url de l'agent;

13. Sauvegarder;

14. Effectuer les mêmes ajustements pour le 'mfa-agent' et le 'mfa-controller';
