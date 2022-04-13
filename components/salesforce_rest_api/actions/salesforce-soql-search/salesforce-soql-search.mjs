import salesforce from "../../salesforce_rest_api.app.mjs";
import { toSingleLineString } from "../../common/utils.mjs";

export default {
  key: "salesforce_rest_api-salesforce-soql-search",
  name: "SOQL Search",
  description: toSingleLineString(`
    Executes a SOQL query.
    See [docs](https://developer.salesforce.com/docs/atlas.en-us.soql_sosl.meta/soql_sosl/sforce_api_calls_soql.htm)
  `),
  version: "0.2.2",
  type: "action",
  props: {
    salesforce,
    query: {
      type: "string",
      label: "SOQL Query",
      description: "A SOQL search query",
    },
  },
  async run({ $ }) {
    const response = await this.salesforce.query({
      $,
      query: this.query,
    });
    $.export("$summary", "Returned results for SOQL query");
    return response;
  },
};
