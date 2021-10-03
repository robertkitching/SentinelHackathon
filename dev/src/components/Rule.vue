<template>
  <v-container>
    <v-row class="text-center">
      <v-col class="mb-4">
        <h1 class="display-2 font-weight-bold mb-3">
          <router-link to="/"><v-icon large>mdi-home</v-icon></router-link>
          Welcome to Sentinel Apps
        </h1>
        <v-card>
          <v-card-title class="blue white--text">
            <span class="text-h5">Menu</span>

            <v-spacer></v-spacer>

            <v-menu bottom left>
              <template v-slot:activator="{ on, attrs }">
                <v-btn dark icon v-bind="attrs" v-on="on">
                  <v-icon>mdi-dots-vertical</v-icon>
                </v-btn>
              </template>

              <v-list>
                <v-list-item v-for="(item, i) in items" :key="i">
                  <v-list-item-title @click="selectActionMenu(item)">{{
                    item.title
                  }}</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
          </v-card-title>
          <v-toolbar color="cyan" dark flat>
            <template v-slot:extension>
              <v-tabs v-model="model" centered slider-color="yellow">
                <v-tab
                  v-for="(query, i) in queries"
                  :key="i"
                  :href="`#tab-${i}`"
                >
                  {{ query.name }}
                </v-tab>
              </v-tabs>
            </template>
          </v-toolbar>

          <v-tabs-items v-model="model">
            <v-tab-item
              v-for="(query, i) in queries"
              :key="i"
              :value="`tab-${i}`"
            >
              <v-card flat>
                <v-data-table
                  v-model="selectedDataRow"
                  :headers="headers"
                  :items="desserts"
                  :items-per-page="25"
                  class="elevation-1"
                  :loading="loadingTable"
                  loading-text="Loading... Please wait"
                  :single-select="true"
                  item-key="TimeGenerated"
                  show-select
                ></v-data-table>
                <v-card-text v-text="text"></v-card-text>
              </v-card>
            </v-tab-item>
          </v-tabs-items>
        </v-card>

        <v-dialog v-model="dialog" scrollable max-width="300px">
          <v-card>
            <v-card-title>Select Action</v-card-title>
            <v-divider></v-divider>
            <v-card-text style="height: 300px">
              <v-radio-group v-model="selectedAction">
                <div v-for="(action, index) in actions" :key="index">
                  <v-radio
                    :label="action.value"
                    :value="action.value"
                  ></v-radio>
                </div>
              </v-radio-group>
            </v-card-text>
            <v-divider></v-divider>
            <v-alert v-if="showAlert" type="success">Done</v-alert>
            <v-divider></v-divider>
            <v-card-actions>
              <v-btn color="blue darken-1" text @click="dialog = false">
                Close
              </v-btn>
              <v-btn color="blue darken-1" text @click="sendDialog">
                Submit
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: "Rule",
  data: () => ({
    showAlert: false,
    selectedColumn: false,
    selectedDataRow: [],
    selectedAction: false,
    hostAction: false,
    teams: false,
    teamstext: "",
    dialog: false,
    items: [],
    loadingTable: true,
    queriesCount: 1,
    actionCount: 1,
    dataTables: [],
    headers: [],
    desserts: [],
    queries: [{ value: "text one" }],
    actions: [{ value: "Action one" }],
    model: "tab-2",
    text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",

    showLoader: false,
    testnew: true,
    testnew2: false,
    loading: false,
    password: "Password",
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

    this.appid = creds.appId;
    this.secret = creds.secret;
    this.tenant = creds.tenant;

    const entity = this.getFromLocal("entity");
    this.entity = entity.entity;

    const actions = this.getFromLocal("actions");
    this.actions = actions.actions;

    const posturl = this.getFromLocal("posturl");
    this.posturl = posturl.posturl;

    const workspace = this.getFromLocal("workspace");
    this.workspace = workspace.workspace;

    const teams = this.getFromLocal("teams");
    this.teamstext = teams.teams;

    const queries = this.getFromLocal("queries");
    this.queries = queries.queries;
    this.queriesCount = this.queries.length;

    this.sendQueries();
  },
  methods: {
    selectActionMenu(menuItem) {
      this.selectedColumn = menuItem;
      this.showAlert = false;
      this.dialog = true;
    },
    sendQueries() {
      let workspaceFound = this.workspace;
      //let analyticFound = this.analitcs.find((pr) => pr.id == this.analytic);
      this.showLoader = true;
      let queryUpdate = this.queries[0].value.replace(
        "{{" + this.entity + "}}",
        "'" + this.$route.params.entity + "'"
      );
      this.axios({
        method: "POST",
        url: "http://localhost:8888/sendquery",
        data: {
          appId: this.appid,
          secret: this.secret,
          tenant: this.tenant,
          //subid: this.subscription,
          //entity: this.entity,
          workspace: workspaceFound.customerId,
          //analytic: analyticFound.name,
          query: queryUpdate,
        },
      }).then((response) => {
        this.showLoader = false;
        const newDataTablesHeader = [];
        const newDataTablesBody = [];
        const columns = [];
        const columnsNamesMenu = [];
        for (var i in response.data.tables[0].columns) {
          columns.push(response.data.tables[0].columns[i].name);
          columnsNamesMenu.push({
            title: response.data.tables[0].columns[i].name,
          });
          newDataTablesHeader.push({
            text: response.data.tables[0].columns[i].name,
            value: response.data.tables[0].columns[i].name,
          });
        }
        for (var i in response.data.tables[0].rows) {
          const newRow = [];
          for (var j in columns) {
            newRow[columns[j]] = response.data.tables[0].rows[i][j];
          }
          newDataTablesBody.push(newRow);
        }
        //this.dataTables.push(newDataTables);
        this.headers = newDataTablesHeader;
        this.desserts = newDataTablesBody;
        this.items = columnsNamesMenu;
        this.loadingTable = false;
        return;
      });
      return;
    },
    sendDialog() {
      let columnTitle = this.selectedColumn.title;
      let dataRowValue = this.selectedDataRow[0][columnTitle];

      this.axios({
        method: "POST",
        url: this.posturl,
        data: {
          IncidentNumber: this.$route.params.incident,
          entity: dataRowValue,
          action: this.selectedAction,
          teams: this.teamstext,
        },
      }).then((response) => {});

      this.showAlert = true;
    },
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
  },
};
</script>
