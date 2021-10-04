# Sentinel Apps.
Sentinel Hackathon 2021 submission. Web Application integration with Azure Sentinel to build your own security solution.


## Inspiration

* With the increasing use of digital assets and services, companies encounter numerous amount of security threats from different attack vectors
* Nowadays, mitigating threats ASAP became the first priority for any security team
* Handling large number of security threats can take a lot of time and manpower when performing it manually
* With the rising need for reducing handling time of security incidents, the need for automatic centralized system increased as well

## What it does

A web application which includes a combination of analytic rule, hunting queries and a playbook
The application is built to give the user the flexibility he needs to create his own security solution and actions he will be able to take upon security threats 
We are providing a link to the hunting queries with the chosen entity in the incident for quick investigation and response

## Features

* Web App communicate with Azure Sentinel for adding the incidents a link to the app with the chosen entity 
* Web App query LA API for threat hunting 
* Web App Post requests to a playbook includes: Incident Numbre, Entity, Action, Teams channel
* Playbook receiving the request from the end user and performing the required actions (mitigation and communication) 

## How we built it

* Built Web Application which communicate with Azure management API and LA API
* Built a Playbook for the actions with 'HTTP' trigger and 'Switch' component
* Built Analytic rules and Hunting queries to be used in the App

## Challenges we ran into

* Building efficient streamlined processes to integrate Azure Sentinel for adding links to incidents with the specific entity which will be used in the hunting queries
* Deploying the web app to Azure app service

## Accomplishements that we're proud of

* Availability - real-time workflow for quick response, reduces total time for incident response
* Flexibility - customized solution which fits any organization which uses Azure Sentinel
* Enables analyst to take immediate action from anywhere at anytime

## What we learned

* Most if not all incident triage can be automated
* Automated process can reduce time investigation and mitigation
* Having set of actions for any entity from hunting queries results reduces mitigation time
* Automated and semi-automated (with human decision) remediation measures reduce response cycle duration and potential for lateral movement

## What's next

* We are building an ultimate responsive dashboard to automate most incident investigation and response processes
  - Multiple apps
  - Multiple analytic rules selection
  - Full integration with the incident comments section
  - Built-in common Microsoft actions
  
 ## Built With
 
* Azure Log Analytics API
* Azure Sentinel API
* Logic Apps
* Web app built with Vue JS, Node.js, Express

## Video Tutorial

[Azure Sentinel Hackathon 2021 Submission Video](https://youtu.be/HqOxRr0zm7w)

## Try it out

[GitHub Repository](https://github.com/sagsagi/SentinelHackathon)

1) Deploy the web application on Azure App Service
2) Follow the instructions in the app
