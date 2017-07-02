# Team Info
## Heroku
Heroku: https://polimi-hyp-2017-team-10459278.herokuapp.com/

## Bitbucket
Bitbucket: https://bitbucket.org/polimihyp2017team10459278/polimi-hyp-2017-project

## Members
Team Administrator: Matteo Colombo, 10459278, polimi-hyp-2017-10459278  
Team Member n.2: Andrea Troianiello, 10455250, polimi-hyp-2017-10455250   


# Project Info

## Optional page

The optional page "Form for general request of info" was implemented and can be accessed through the main menu using the link "Richieste".
When you send a general information inquiry, the request is stored in the database and a confirmation email is sent to the user who made the request.
Due to the fact that no authentication is used for emails, it may happen that the receiving server rejects the email.
To avoid any problem with this, we created an API to let you check if the request was actually processed. 
The API is available here https://polimi-hyp-2017-team-10459278.herokuapp.com/generalrequests.
Please, mind that no security/privacy measure was taken and in a real production environment this API shouldn't be implemented without modifications.

*Email may finish in the spam folder*


## How to start the server in local

The environmente variable TEST must be set equal to "true"
On Windows:
From CMD: 

```
#!sh

set TEST=true

```
From powershell: 
```
#!sh

$env:TEST="true"
```


## How to start the server


```
#!sh

npm start
```


## Structure
The project is structured as suggested in the delivery instructions.

## Database
The project uses SQLite in local and PostgreSQL in production.
The database is exported in another module called "database.js" located in the /other directory.

Database creation and population works in the following way:

1. A function checks if all the tables already exist
2. If at least a table doesnt' exist, the entire database is deleted and recreated
3. The database is created using a json file called "schema.json" located in /other
4. The database population is done by using several json files, one per table. The json files are located in /other/json_db

The entire database creation is managed with json file and to add/remove a table is sufficient to edit the file schema.json.
If the path to the table file in the schema.json file is null, the table population is skipped  (e.g. for the general information request table).

## Pages and content of the website

Every pages requested by the delivery instructions was implemented with realistic content, following the C/P-IDM schema.
All the content of each page, with the exception of the main menu and the homepage, is loaded via Ajax from the database using RESTful APIs.

## Framework and template

The project was built using Bootstrap v3, the latest version of JQuery and the Imperial theme, that can be found at the following page: https://bootstrapmade.com/demo/Imperial/

## Navigation system
When there is a navigation index pattern (following the P-IDM model), a navigation system is implemented with dynamic links.
Dynamic links are implemented through sessione storage and are present in the following pages: doctor.html, service.html and location.html.