const common = require("./common");
const { bitbucket } = common.props;

const EVENT_SOURCE_NAME = "New Repository Event (Instant)";

module.exports = {
  ...common,
  name: EVENT_SOURCE_NAME,
  description: "Emits an event when a repository-wide event occurs",
  version: "0.0.1",
  props: {
    ...common.props,
    repositoryId: {
      propDefinition: [
        bitbucket,
        "repositoryId",
        c => ({ workspaceId: c.workspaceId }),
      ],
    },
    eventTypes: {
      propDefinition: [
        bitbucket,
        "eventTypes",
        c => ({ subjectType: "repository" }),
      ],
    },
  },
  methods: {
    ...common.methods,
    getEventSourceName() {
      return EVENT_SOURCE_NAME;
    },
    getHookEvents() {
      return this.eventTypes;
    },
    getHookPathProps() {
      return {
        workspaceId: this.workspaceId,
        repositoryId: this.repositoryId,
      };
    },
    generateMeta(data) {
      const {
        "x-request-uuid": id,
        "x-event-key": eventType,
        "x-event-time": eventDate,
      } = data.headers;
      const summary = `New repository event: ${eventType}`;
      const ts = +new Date(eventDate);
      return {
        id,
        summary,
        ts,
      };
    },
    async processEvent(event) {
      const data = {
        headers: event.headers,
        body: event.body,
      };
      const meta = this.generateMeta(data);
      this.$emit(data, meta);
    },
  },
};
