<template>
  <v-container>
    <v-row class="text-center">
      <v-col class="mb-4">
        <h1 class="display-2 font-weight-bold mb-3">
          Welcome to Sentinel Apps
        </h1>

        <p class="text-left">
          Sentinel Apps allows you to create the best security solution for your
          needs using Azure Sentinel data from queries you will set and take
          immediate actions on queries results to mitigate threats in a fast and
          efficient way.
          <br />
          <br />
          Link to the App will be added to incidents created from the selected
          analytic rule with a specific entity you will choose.
          <br /><br />
          Please follow the instructions below to set up your first app.
        </p>

        <v-expansion-panels>
          <v-expansion-panel>
            <v-expansion-panel-header disable-icon-rotate>
              Connection info
              <template v-slot:actions>
                <v-icon color="teal"> mdi-check </v-icon>
              </template>
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              <p class="text-left">
                For obtaining Application ID and Secret please go to 'App
                registrations' and follow the instructions in the following
                link:
                <a
                  href="https://docs.microsoft.com/en-us/azure/active-directory/develop/quickstart-register-app"
                  target="_blank"
                  >Register App</a
                >
                (You can register the app and skip to 'Add a client secret'
                section, make sure to record the secret's value)
              </p>
              <v-text-field
                v-model="appid"
                label="Application ID"
              ></v-text-field>
              <v-text-field
                v-model="secret"
                type="password"
                label="Secret"
              ></v-text-field>
              <v-text-field v-model="tenant" label="Tenant"></v-text-field>

              <v-btn
                :loading="loading"
                :disabled="loading"
                color="success"
                class="mr-4"
                @click="validate"
                >Validate</v-btn
              >
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>

        <v-select
          v-if="subscriptions"
          :items="subscriptions"
          item-text="label"
          item-value="id"
          v-model="subscription"
          label="Subscription"
          @change="selectSubscription"
        ></v-select>

        <v-select
          v-if="resources"
          :items="resources"
          item-text="label"
          item-value="id"
          v-model="resource"
          label="Resource Group"
          @change="selectResource"
        ></v-select>

        <v-select
          v-if="workspaces"
          :items="workspaces"
          item-text="label"
          item-value="id"
          v-model="workspace"
          label="Workspaces"
          @change="selectWorkspace"
        ></v-select>

        <p v-if="analitcs" class="text-left">
          Choose analytic rule from which you would like to start the
          investigation on the app
        </p>
        <v-select
          v-if="analitcs"
          :items="analitcs"
          item-text="label"
          item-value="id"
          v-model="analytic"
          label="Analytics rules"
          @change="selectAnalytics"
        ></v-select>

        <div v-if="analytic && analitcs">
          <p class="text-left">
            Choose 1 entity from the analytic rule which you would like to
            perform the queries on
          </p>
          <v-text-field v-model="entity" label="Entity"></v-text-field>
          <p class="text-left">
            In this section you can add multiple custom actions in which you
            will take on certain entities when investigating for example: Block
            Sender email address, Block IP, Isolate device from the network etc.
          </p>
          <div v-for="(action, index) in actions" :key="index">
            <v-text-field
              v-model="action.value"
              :label="`Action ${index + 1}`"
              hint="Add name for the custom action"
            ></v-text-field>
          </div>
          <v-btn
            class="mx-2"
            fab
            dark
            small
            color="primary"
            @click="changeAction('minus')"
          >
            <v-icon dark> mdi-minus </v-icon>
          </v-btn>
          <v-btn
            class="mx-2"
            fab
            dark
            small
            color="indigo"
            @click="changeAction('plus')"
          >
            <v-icon dark> mdi-plus </v-icon>
          </v-btn>
          <p class="text-left">
            Please create a playbook with 'When a HTTP request is received' and
            add the HTTP POST URL below:
          </p>
          <v-text-field
            v-model="hostAction"
            label="Please add HTTP POST URL "
          ></v-text-field>
          <p class="text-left" style="font-size:12px;"><pre>Request body json schema for the playbook :
{
    "properties": {
        "IncidentNumber": {
            "type": "string"
        },
        "action": {
            "type": "string"
        },
        "entity": {
            "type": "string"
        },
        "teams": {
            "type": "string"
        }
    },
    "type": "object"
}
</pre></p>
          <p class="text-left">For Microsoft Teams communications mark the 'Teams' checkbox below and add specific team channel</p>
          <v-checkbox v-model="teams" :label="`Teams`"></v-checkbox>

          <v-text-field
            v-if="teams"
            v-model="teamstext"
            label="Please add Teams "
          ></v-text-field>
          <p class="text-left" v-pre>
            Add queries for investigation, add the entity you chose inside {{example}}.

          </p>
          <div v-for="(query, index) in queries" :key="index">
            <v-text-field v-model="query.name" label="Query name"></v-text-field>
            <v-textarea
              v-model="query.value"
              :label="`Query ${index + 1}`"
            ></v-textarea>
          </div>

          <v-btn
            class="mx-2"
            fab
            dark
            small
            color="primary"
            @click="changeQuery('minus')"
          >
            <v-icon dark> mdi-minus </v-icon>
          </v-btn>
          <v-btn
            class="mx-2"
            fab
            dark
            small
            color="indigo"
            @click="changeQuery('plus')"
          >
            <v-icon dark> mdi-plus </v-icon>
          </v-btn>

          <v-btn color="success" class="mr-4" @click="sendQueries"
            >Send Queries</v-btn
          >
        </div>
        <v-alert v-if="showAlert" type="success">Data submitted</v-alert>
        <v-progress-circular
          v-if="showLoader"
          indeterminate
          color="primary"
        ></v-progress-circular>
      </v-col>

      <v-dialog v-model="dialog" scrollable max-width="300px">
        <v-card>
          <v-card-title>Select Action</v-card-title>
          <v-divider></v-divider>
          <v-card-text style="height: 300px">
            <v-radio-group column>
              <div v-for="(action, index) in actions" :key="index">
                <v-radio :label="action.value" :value="action.value"></v-radio>
              </div>
            </v-radio-group>
          </v-card-text>
          <v-divider></v-divider>
          <v-card-actions>
            <v-btn color="blue darken-1" text @click="dialog = false">
              Close
            </v-btn>
            <v-btn color="blue darken-1" text @click="dialog = false">
              Submit
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: "MainForm",

  data: () => ({
    showAlert: false,
    hostAction: "",
    teams: false,
    teamstext: "",
    dialog: false,
    items: [
      { title: "Click Me" },
      { title: "Click Me" },
      { title: "Click Me" },
      { title: "Click Me 2" },
    ],
    loadingTable: true,
    queriesCount: 1,
    actionCount: 1,
    dataTables: [],
    headers: [],
    desserts: [],
    queries: [{ value: "" ,name:""}],
    actions: [{ value: "" }],
    model: "tab-2",
    text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",

    showLoader: false,
    testnew: true,
    testnew2: false,
    loading: false,
    appid: "",
    secret: "",
    tenant: "",
    subsid: false,
    subscriptions: false,
    resources: false,
    workspaces: false,
    analitcs: false,
    columns: [],
    entities: false,
    subscription: false,
    resource: false,
    workspace: false,
    analytic: false,
    entity: "",
  }),
  mounted() {
    const creds = this.getFromLocal("cred");
    if (creds != null) {
      this.appid = creds.appId;
      this.secret = creds.secret;
      this.tenant = creds.tenant;
    }

    const entity = this.getFromLocal("entity");
    if (entity != null) {
      this.entity = entity.entity;
    }

    const actions = this.getFromLocal("actions");
    if (actions != null) {
      this.actions = actions.actions;
    }

    const posturl = this.getFromLocal("posturl");
    if (posturl != null) {
      this.hostAction = posturl.posturl;
    }

    const workspace = this.getFromLocal("workspace");
    if (workspace != null) {
      this.workspace = workspace.workspace.id;
    }

    const analytics = this.getFromLocal("analytics");
    if (analytics != null) {
      this.analytic = analytics.analytics;
    }

    const subscription = this.getFromLocal("subscription");
    if (subscription != null) {
      this.subscription = subscription.subscription;
    }

    const resource = this.getFromLocal("resource");
    if (resource != null) {
      this.resource = resource.resource;
    }

    const teams = this.getFromLocal("teams");
    if (teams != null) {
      this.teamstext = teams.teams;
      if (this.teamstext) {
        this.teams = true;
      }
    }

    const queries = this.getFromLocal("queries");
    if (queries != null) {
      this.queries = queries.queries;
      this.queriesCount = this.queries.length;
    }

    if (this.appid && this.secret && this.tenant) {
      this.validate();
    }
  },
  methods: {
    getFromLocal(key) {
      var itemStr = localStorage.getItem(key);
      if (!itemStr) {
        return null;
      }
      var item = JSON.parse(itemStr);
      /*var now = new Date();
      if (now.getTime() > item.expiry) {
        localStorage.removeItem(key);
        return null;
      }*/
      return item.value;
    },
    selectActionMenu(menuItem) {
      this.dialog = true;
    },
    submitAllEntities(entities) {
      entities.forEach((element) => {
        this.submitEntity(element);
      });
      this.showAlert = true;
    },
    submitEntity(entity) {
      let workspaceFound = this.workspaces.find(
        (pr) => pr.id == this.workspace
      );
      let analyticFound = this.analitcs.find((pr) => pr.id == this.analytic);
      this.showLoader = true;
      this.axios({
        method: "POST",
        url: "/api/editentitysingle",
        data: {
          appId: this.appid,
          secret: this.secret,
          tenant: this.tenant,
          subid: this.subscription,
          workspace: this.workspace,
          analytic: analyticFound.name,
          entity: entity,
        },
      }).then((response) => {
        this.showLoader = false;
        return;
      });
      return;
    },
    sendEntity() {
      let workspaceFound = this.workspaces.find(
        (pr) => pr.id == this.workspace
      );
      let analyticFound = this.analitcs.find((pr) => pr.id == this.analytic);
      this.showLoader = true;
      this.axios({
        method: "POST",
        url: "/api/editentity",
        data: {
          appId: this.appid,
          secret: this.secret,
          tenant: this.tenant,
          subid: this.subscription,
          entity: this.entity,
          workspace: workspaceFound.customerId,
          analytic: analyticFound.name,
        },
      }).then((response) => {
        this.showLoader = false;
        this.submitAllEntities(response.data.tables[0].rows);
        return;
        const newAnalytics = [];
        for (var i in response.data.value) {
          newAnalytics.push({
            id: response.data.value[i].id,
            label: response.data.value[i].properties.displayName,
          });
        }
        this.analitcs = newAnalytics;
      });
      return;
    },
    selectEntities() {},
    selectColumns() {},
    sendQueries() {
      this.showAlert = false;
      this.$store.commit("setWithExpiry", {
        key: "entity",
        object: { entity: this.entity },
      });
      this.$store.commit("setWithExpiry", {
        key: "actions",
        object: { actions: this.actions },
      });
      this.$store.commit("setWithExpiry", {
        key: "posturl",
        object: { posturl: this.hostAction },
      });
      this.$store.commit("setWithExpiry", {
        key: "queries",
        object: { queries: this.queries },
      });
      this.$store.commit("setWithExpiry", {
        key: "teams",
        object: { teams: this.teamstext },
      });

      let workspaceFound = this.workspaces.find(
        (pr) => pr.id == this.workspace
      );
      let analyticFound = this.analitcs.find((pr) => pr.id == this.analytic);
      this.showLoader = true;
      this.axios({
        method: "POST",
        url: "/api/editentity",
        data: {
          appId: this.appid,
          secret: this.secret,
          tenant: this.tenant,
          subid: this.subscription,
          entity: this.entity,
          workspace: workspaceFound.customerId,
          analytic: analyticFound.name,
        },
      }).then((response) => {
        this.showLoader = false;
        this.submitAllEntities(response.data.tables[0].rows);
        return;
        const newAnalytics = [];
        for (var i in response.data.value) {
          newAnalytics.push({
            id: response.data.value[i].id,
            label: response.data.value[i].properties.displayName,
          });
        }
        this.analitcs = newAnalytics;
      });
      return;
    },
    selectAnalytics() {
      this.showLoader = true;
      this.$store.commit("setWithExpiry", {
        key: "analytics",
        object: { analytics: this.analytic },
      });
      this.axios({
        method: "POST",
        url: "/api/entities",
        data: {
          appId: this.appid,
          secret: this.secret,
          tenant: this.tenant,
          subid: this.subscription,
          workspace: this.workspace,
          analytic: this.analytic,
        },
      }).then((response) => {
        this.showLoader = false;
        return;
        const newAnalytics = [];
        for (var i in response.data.value) {
          newAnalytics.push({
            id: response.data.value[i].id,
            label: response.data.value[i].properties.displayName,
          });
        }
        this.analitcs = newAnalytics;
      });
      return;
    },
    changeAction(action) {
      switch (action) {
        case "plus":
          this.actionCount++;
          this.actions.push({ value: "" });
          break;
        case "minus":
          if (this.actionCount < 2) {
            break;
          }
          this.actions.splice(this.actions.length - 1, 1);
          this.actionCount--;
          break;
      }
    },
    changeQuery(action) {
      switch (action) {
        case "plus":
          if (this.queriesCount > 2) {
            break;
          }
          this.queriesCount++;
          this.queries.push({ value: "",name:"" });
          break;
        case "minus":
          if (this.queriesCount < 2) {
            break;
          }
          this.queries.splice(this.queries.length - 1, 1);
          this.queriesCount--;
          break;
      }
    },
    selectWorkspace() {
      let workspaceFound = this.workspaces.find(
        (pr) => pr.id == this.workspace
      );
      this.$store.commit("setWithExpiry", {
        key: "workspace",
        object: { workspace: workspaceFound },
      });
      this.showLoader = true;
      //this.analitcs = ["analitics1", "analitics2"];
      this.axios({
        method: "POST",
        url: "/api/analytics",
        data: {
          appId: this.appid,
          secret: this.secret,
          tenant: this.tenant,
          subid: this.subscription,
          workspace: this.workspace,
          resource: this.resource,
        },
      }).then((response) => {
        const newAnalytics = [];
        for (var i in response.data.value) {
          newAnalytics.push({
            id: response.data.value[i].id,
            label: response.data.value[i].properties.displayName,
            name: response.data.value[i].name,
          });
        }
        this.analitcs = newAnalytics;
        this.showLoader = false;
        if (this.analytic) {
          this.selectAnalytics();
        }
      });
      return;
    },
    selectResource() {
      this.showLoader = true;
      this.$store.commit("setWithExpiry", {
        key: "resource",
        object: { resource: this.resource },
      });
      //this.workspaces = ["workspace1", "workspace2"];
      this.axios({
        method: "POST",
        url: "/api/workspaces",
        data: {
          appId: this.appid,
          secret: this.secret,
          tenant: this.tenant,
          subid: this.subscription,
        },
      }).then((response) => {
        const newWorkspaces = [];
        for (var i in response.data.value) {
          newWorkspaces.push({
            id: response.data.value[i].id,
            label: response.data.value[i].name,
            customerId: response.data.value[i].properties.customerId,
          });
        }
        this.workspaces = newWorkspaces;
        this.showLoader = false;
        if (this.workspace) {
          this.selectWorkspace();
        }
      });
      return;
    },
    selectSubscription() {
      this.$store.commit("setWithExpiry", {
        key: "subscription",
        object: { subscription: this.subscription },
      });

      this.showLoader = true;
      //this.resources = ["resource1", "resource2"];
      this.axios({
        method: "POST",
        url: "/api/resources",
        data: {
          appId: this.appid,
          secret: this.secret,
          tenant: this.tenant,
          subid: this.subscription,
        },
      }).then((response) => {
        const newGroups = [];
        for (var i in response.data.value) {
          newGroups.push({
            id: response.data.value[i].id,
            label: response.data.value[i].name,
          });
        }
        this.resources = newGroups;

        this.showLoader = false;
        if (this.resource) {
          this.selectResource();
        }
      });
      return;
    },
    getCred() {
      return this.$store.getters.getCred;
    },
    validate() {
      //this.$store.commit("setWithExpiry");
      this.$store.commit("setWithExpiry", {
        key: "cred",
        object: { appId: this.appid, secret: this.secret, tenant: this.tenant },
      });
      //this.getCred();
      /*setWithExpiry(
        "cred",
        { appId: this.appid, secret: this.secret, tenant: this.tenant },
        100000000
      );*/
      this.loading = true;
      //this.subscriptions = ["subscription1", "subscription2"];
      this.axios({
        method: "POST",
        url: "/api/validate",
        data: {
          appId: this.appid,
          secret: this.secret,
          tenant: this.tenant,
        },
      }).then((response) => {
        const newSubsciptions = [];
        for (var i in response.data.value) {
          newSubsciptions.push({
            id: response.data.value[i].subscriptionId,
            label: response.data.value[i].displayName,
          });
        }
        this.subscriptions = newSubsciptions;
        this.loading = false;
        if (this.subscription) {
          this.selectSubscription();
        }
      });
      return;
      //const msrest = require('ms-rest');
      const msRestAzure = require("ms-rest-azure");
      const AzureServiceClient = msRestAzure.AzureServiceClient;

      const clientId = this.appid;
      const secret = this.secret;
      const domain = this.tenant;
      const subscriptionId = this.subsid;
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
          console.dir(result, { depth: null, colors: true });
        })
        .catch((err) => {
          console.dir(err, { depth: null, colors: true });
        });

      //this.$refs.form.validate()
    },
  },
};
</script>
