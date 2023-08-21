const ACTIONS = {
  JOIN: "join",
  JOINED: "joined",
  DISCONNECTED: "disconnected",
  CODE_CHANGE: "code-change",
  LANG_CHANGE: "language-change",
  LEAVE_ROOM: "leave",
  UPDATE_CODE_LANGUAGE: "update-cl",
  RUN_CODE: "run-code",
  RUNNING_CODE: "running-code",
  SHOW_OUTPUT: "show-output",
  FETCH_AVAILABLE_LANGUAGES: "fetch-languages",
  AVAILABLE_LANGUAGES_LIST: "available-langs",
  INITIAL_SYNC_DATA: "initial-sync-data",
  CREATE_ROOM: "create-new-room",
  ROOM_CREATED: "new-room-created",
  INVALID_ROOM_ID: "invalid-room-id",
  DESTROY_ROOM: "destroy-room",
  ROOM_DELETED: "room-deleted",
};

module.exports = ACTIONS;
