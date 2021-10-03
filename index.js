const express = require('express')
const bodyParser = require('body-parser');
const path = require('path');
var history = require('connect-history-api-fallback');
const app = express();
const staticFileMiddleware = express.static(path.join(__dirname, '/my-app/dist'));

//const port = 8888;
const port = process.env.port || 8888;
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.raw());


var cors = require('cors');

const corsOpts = {
    origin: '*',

    methods: [
        'GET',
        'POST',
    ],

    allowedHeaders: [
        'Content-Type',
    ],
};

app.use(cors(corsOpts));

app.use(staticFileMiddleware);
app.use(history({
    index: '/index.html'
}));

app.use(staticFileMiddleware);

//app.use(express.static('/my-app/dist'));
app.use(express.static(path.join(__dirname, '/my-app/dist')));

app.post('/api/validate', (req, res) => {
    const msRestAzure = require('ms-rest-azure');
    const AzureServiceClient = msRestAzure.AzureServiceClient;

    const clientId = req.body.appId;
    const secret = req.body.secret;
    const domain = req.body.tenant;
    var client;

    //an example to list resource groups in a subscription
    msRestAzure
        .loginWithServicePrincipalSecret(clientId, secret, domain)
        .then((creds) => {
            client = new AzureServiceClient(creds);
            let options = {
                method: "GET",
                url: "https://management.azure.com/subscriptions?api-version=2020-01-01",
                headers: {
                    "user-agent": "MyTestApp/1.0",
                },
            };
            return client.sendRequest(options);
        })
        .then((result) => {
            //console.dir(result, {depth: null, colors: true});
            res.send(result);
        })
        .catch((err) => {
            //console.dir(err, {depth: null, colors: true});
            res.send(err);
        });
});

app.post('/api/resources', (req, res) => {
    const msRestAzure = require('ms-rest-azure');
    const AzureServiceClient = msRestAzure.AzureServiceClient;

    const clientId = req.body.appId;
    const secret = req.body.secret;
    const domain = req.body.tenant;
    const subscriptionId = req.body.subid;
    var client;

    //an example to list resource groups in a subscription
    msRestAzure
        .loginWithServicePrincipalSecret(clientId, secret, domain)
        .then((creds) => {
            client = new AzureServiceClient(creds);
            let options = {
                method: "GET",
                url: 'https://management.azure.com/subscriptions/' + subscriptionId + '/resourcegroups?api-version=2016-09-01',
                headers: {
                    "user-agent": "MyTestApp/1.0",
                },
            };
            return client.sendRequest(options);
        })
        .then((result) => {
            //console.dir(result, {depth: null, colors: true});
            res.send(result);
        })
        .catch((err) => {
            //console.dir(err, {depth: null, colors: true});
            res.send(err);
        });
});

app.post('/api/workspaces', (req, res) => {
    const msRestAzure = require('ms-rest-azure');
    const AzureServiceClient = msRestAzure.AzureServiceClient;

    const clientId = req.body.appId;
    const secret = req.body.secret;
    const domain = req.body.tenant;
    const subscriptionId = req.body.subid;
    var client;

    //an example to list resource groups in a subscription
    msRestAzure
        .loginWithServicePrincipalSecret(clientId, secret, domain)
        .then((creds) => {
            client = new AzureServiceClient(creds);
            let options = {
                method: "GET",
                url: 'https://management.azure.com/subscriptions/' + subscriptionId + '/providers/Microsoft.OperationalInsights/workspaces?api-version=2021-06-01',
                headers: {
                    "user-agent": "MyTestApp/1.0",
                },
            };
            return client.sendRequest(options);
        })
        .then((result) => {
            //console.dir(result, {depth: null, colors: true});
            res.send(result);
        })
        .catch((err) => {
            //console.dir(err, {depth: null, colors: true});
            res.send(err);
        });
});

app.post('/api/analytics', (req, res) => {
    const msRestAzure = require('ms-rest-azure');
    const AzureServiceClient = msRestAzure.AzureServiceClient;

    const clientId = req.body.appId;
    const secret = req.body.secret;
    const domain = req.body.tenant;
    const subscriptionId = req.body.subid;
    const resource = req.body.resource;
    const workspace = req.body.workspace;
    var client;
    //an example to list resource groups in a subscription
    msRestAzure
        .loginWithServicePrincipalSecret(clientId, secret, domain)
        .then((creds) => {
            client = new AzureServiceClient(creds);
            let options = {
                method: "GET",
                url: 'https://management.azure.com' + workspace + '/providers/Microsoft.SecurityInsights/alertRules?api-version=2020-01-01',
                headers: {
                    "user-agent": "MyTestApp/1.0",
                },
            };
            return client.sendRequest(options);
        })
        .then((result) => {
            //console.dir(result, {depth: null, colors: true});
            res.send(result);
        })
        .catch((err) => {
            //console.dir(err, {depth: null, colors: true});
            res.send(err);
        });
});

app.post('/api/entities', (req, res) => {
    const msRestAzure = require('ms-rest-azure');
    const AzureServiceClient = msRestAzure.AzureServiceClient;

    const clientId = req.body.appId;
    const secret = req.body.secret;
    const domain = req.body.tenant;
    const subscriptionId = req.body.subid;
    const resource = req.body.resource;
    const workspace = req.body.workspace;
    const analytic = req.body.analytic;
    var client;

    //an example to list resource groups in a subscription
    msRestAzure
        .loginWithServicePrincipalSecret(clientId, secret, domain)
        .then((creds) => {
            client = new AzureServiceClient(creds);
            let options = {
                method: "GET",
                url: 'https://management.azure.com' + analytic + '?api-version=2020-01-01',
                headers: {
                    "user-agent": "MyTestApp/1.0",
                },
            };
            return client.sendRequest(options);
        })
        .then((result) => {
            //console.dir(result, {depth: null, colors: true});
            res.send(result);
        })
        .catch((err) => {
            //console.dir(err, {depth: null, colors: true});
            res.send(err);
        });
});

app.post('/api/editentitysingle', (req, res) => {
    const msRestAzure = require('ms-rest-azure');
    const AzureServiceClient = msRestAzure.AzureServiceClient;
    const clientId = req.body.appId;
    const secret = req.body.secret;
    const domain = req.body.tenant;
    const subscriptionId = req.body.subid;
    const resource = req.body.resource;
    const workspace = req.body.workspace;
    const analytic = req.body.analytic;
    const entity = req.body.entity;
    const incident = entity[0];
    var client;
    //an example to list resource groups in a subscription
    msRestAzure
        .loginWithServicePrincipalSecret(clientId, secret, domain)
        .then((creds) => {
            client = new AzureServiceClient(creds);
            let options = {
                method: "GET",
                url: 'https://management.azure.com' + workspace + '/providers/Microsoft.SecurityInsights/incidents/' + incident + '?api-version=2021-04-01',
                headers: {
                    "user-agent": "MyTestApp/1.0",
                },
            };
            return client.sendRequest(options);
        })
        .then((result) => {

            //delete result.properties.lastModifiedUtc;

            result.properties.description = result.properties.description + ' \n ' + (req.body.entity[5]);
            msRestAzure
                .loginWithServicePrincipalSecret(clientId, secret, domain)
                .then((creds) => {
                    client = new AzureServiceClient(creds);
                    let options = {
                        method: "PUT",
                        url: 'https://management.azure.com' + workspace + '/providers/Microsoft.SecurityInsights/incidents/' + incident + '?api-version=2021-04-01',
                        headers: {
                            "user-agent": "MyTestApp/1.0",
                        },
                        body: result
                    };
                    data = client.sendRequest(options);
                    return data;
                })
                .then((result) => {
                    //console.dir(result, { depth: null, colors: true });
                    res.send(result);
                })

            //console.dir(result, {depth: null, colors: true});
            res.send(result);
        })
        .catch((err) => {
            //console.dir(err, {depth: null, colors: true});
            res.send(err);
        });
});

app.post('/api/editentity', (req, res) => {
    const msrestazure = require('ms-rest-azure');
    const LogAnalyticsClient = require('azure-loganalytics');

    var options = {
        tokenAudience: 'https://api.loganalytics.io'
    }

    msrestazure.loginWithServicePrincipalSecret(
        req.body.appId,
        req.body.secret,
        req.body.tenant,
        options,
        (err, credentials) => {
            if (err) throw err
            // ..use the client instance to access service resources.
            const client = new LogAnalyticsClient(credentials);

            const workspaceId = req.body.workspace;
            var body = {
                //query: 'let AnalyticRuleIds = dynamic("'+req.body.analytic+'"); \n let SecurityAlertTable = SecurityAlert \n | extend Name_ = tostring(parse_json(Entities)[0].Name); \n SecurityIncident \n | where RelatedAnalyticRuleIds[0] in (AnalyticRuleIds) \n | extend SystemAlertId = tostring(AlertIds[0]) \n | join kind=inner SecurityAlertTable on $left.SystemAlertId == $right.SystemAlertId \n | distinct IncidentName, tostring(AlertIds[0]), Name_',
                query: 'let AnalyticRuleIds = dynamic("' + req.body.analytic + '"); \n let SecurityAlertTable = SecurityAlert \n | extend Name_ = tostring(parse_json(Entities)[0].Name); \n SecurityIncident \n | where RelatedAnalyticRuleIds[0] in (AnalyticRuleIds) \n | extend SystemAlertId = tostring(AlertIds[0]) \n | join kind=inner SecurityAlertTable on $left.SystemAlertId == $right.SystemAlertId \n | extend Link = strcat(\'https://sentinelapps.azurewebsites.net/incident/\',IncidentNumber,\'/\',Name_)  \n | distinct IncidentName, tostring(AlertIds[0]), Name_, IncidentNumber, Title, Link',
            };

            client.query(workspaceId, body).then((result) => {
                return result;
            })
                .then((result) => {
                    res.send(result);
                    return;
                })
                .catch((err) => {
                    //console.dir(err, { depth: null, colors: true });
                    res.send(err);
                });
        }
    );
    return;
});

app.post('/api/sendquery', (req, res) => {
    const msrestazure = require('ms-rest-azure');
    const LogAnalyticsClient = require('azure-loganalytics');

    var options = {
        tokenAudience: 'https://api.loganalytics.io'
    }

    querySent = req.body.query;

    msrestazure.loginWithServicePrincipalSecret(
        req.body.appId,
        req.body.secret,
        req.body.tenant,
        options,
        (err, credentials) => {
            if (err) throw err
            // ..use the client instance to access service resources.
            const client = new LogAnalyticsClient(credentials);

            const workspaceId = req.body.workspace;
            var body = {
                query: querySent,
            };

            client.query(workspaceId, body).then((result) => {
                return result;
            })
                .then((result) => {
                    res.send(result);
                })
                .catch((err) => {
                    //console.dir(err, { depth: null, colors: true });
                    res.send(err);
                });
        }
    );
    return;

});


app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/my-app/dist/index.html'));
});

app.all("*", (_req, res) => {
    try {
        //res.send(path.join(__dirname, '/my-app/dist/index.html'));
        
        res.sendFile(path.join(__dirname, '/my-app/dist/index.html'));
    } catch (error) {
        res.json({ success: false, message: "Something went wrong" });
    }
});

app.use(express.static('/my-app/dist'));

app.listen(port, () => {
    console.log(`Example app listening on port ${port}!`)
});