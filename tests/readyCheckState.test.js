const {
  getPrintState,
  setReady,
  setNotReady,
  addMemberToState,
  isReady,
  getReadyCount,
  getNotReadyCount,
  readyStates,
  hasVoted,
  getNoVoteCount
} = require("../src/utility/readyCheckState");

describe("readyStates", () => {
  it("has correct numerical values for each state", () => {
    expect(readyStates.isReady).toBe(1);
    expect(readyStates.notReady).toBe(0);
    expect(readyStates.NoVote).toBe(2);
  });

  it("is frozen and cannot be modified", () => {
    const desc = Object.getOwnPropertyDescriptor(readyStates, "isReady");
    expect(desc.configurable).toBe(false);
    expect(Object.isFrozen(readyStates)).toBe(true);
   });
});

describe("addMemberToState", () => {
  it("adds a member with default NoVote status", () => {
    const state = [];
    addMemberToState(state, "user1", "Alice");
    expect(state).toHaveLength(1);
    expect(state[0]).toEqual({ userId: "user1", memberName: "Alice", ready: readyStates.NoVote });
  });

  it("adds a member with explicit ready status", () => {
    const state = [];
    addMemberToState(state, "user1", "Alice", readyStates.isReady);
    expect(state[0].ready).toBe(readyStates.isReady);
  });

  it("does not add duplicate members", () => {
    const state = [];
    addMemberToState(state, "user1", "Alice");
    addMemberToState(state, "user1", "Bob");
    expect(state).toHaveLength(1);
    expect(state[0].memberName).toBe("Alice");
  });
});

describe("setReady", () => {
  it("sets a member status to ready", () => {
    const state = [{ userId: "user1", memberName: "Alice", ready: readyStates.NoVote }];
    setReady(state, "user1");
    expect(state[0].ready).toBe(readyStates.isReady);
  });

  it("returns the same state array", () => {
    const state = [{ userId: "user1", memberName: "Alice", ready: readyStates.NoVote }];
    const result = setReady(state, "user1");
    expect(result).toBe(state);
  });

  it("throws if member not found", () => {
    const state = [{ userId: "user1", memberName: "Alice", ready: readyStates.NoVote }];
    expect(() => setReady(state, "nonexistent")).toThrow();
  });
});

describe("setNotReady", () => {
  it("sets a member status to not ready", () => {
    const state = [{ userId: "user1", memberName: "Alice", ready: readyStates.NoVote }];
    setNotReady(state, "user1");
    expect(state[0].ready).toBe(readyStates.notReady);
  });

  it("returns the same state array", () => {
    const state = [{ userId: "user1", memberName: "Alice", ready: readyStates.NoVote }];
    const result = setNotReady(state, "user1");
    expect(result).toBe(state);
  });
});

describe("isReady", () => {
  it("returns true when member is ready", () => {
    const state = [{ userId: "user1", memberName: "Alice", ready: readyStates.isReady }];
    expect(isReady(state, "user1")).toBe(true);
  });

  it("returns false when member is not ready", () => {
    const state = [{ userId: "user1", memberName: "Alice", ready: readyStates.notReady }];
    expect(isReady(state, "user1")).toBe(false);
  });

  it("returns false when member has not voted", () => {
    const state = [{ userId: "user1", memberName: "Alice", ready: readyStates.NoVote }];
    expect(isReady(state, "user1")).toBe(false);
  });

  it("throws if member not found", () => {
    const state = [];
    expect(() => isReady(state, "nonexistent")).toThrow();
  });
});

describe("hasVoted", () => {
  it("returns true when member is ready", () => {
    const state = [{ userId: "user1", memberName: "Alice", ready: readyStates.isReady }];
    expect(hasVoted(state, "user1")).toBe(true);
  });

  it("returns true when member is not ready", () => {
    const state = [{ userId: "user1", memberName: "Alice", ready: readyStates.notReady }];
    expect(hasVoted(state, "user1")).toBe(true);
  });

  it("returns false when member has not voted", () => {
    const state = [{ userId: "user1", memberName: "Alice", ready: readyStates.NoVote }];
    expect(hasVoted(state, "user1")).toBe(false);
  });
});

describe("getReadyCount", () => {
  it("returns the count of ready members", () => {
    const state = [
      { userId: "1", memberName: "Alice", ready: readyStates.isReady },
      { userId: "2", memberName: "Bob", ready: readyStates.isReady },
      { userId: "3", memberName: "Charlie", ready: readyStates.notReady },
    ];
    expect(getReadyCount(state)).toBe(2);
  });

  it("returns 0 for empty state", () => {
    expect(getReadyCount([])).toBe(0);
  });
});

describe("getNotReadyCount", () => {
  it("returns the count of not ready members", () => {
    const state = [
      { userId: "1", memberName: "Alice", ready: readyStates.isReady },
      { userId: "2", memberName: "Bob", ready: readyStates.notReady },
      { userId: "3", memberName: "Charlie", ready: readyStates.notReady },
    ];
    expect(getNotReadyCount(state)).toBe(2);
  });

  it("returns 0 for empty state", () => {
    expect(getNotReadyCount([])).toBe(0);
  });
});

describe("getNoVoteCount", () => {
  it("returns the count of members who have not voted", () => {
    const state = [
      { userId: "1", memberName: "Alice", ready: readyStates.isReady },
      { userId: "2", memberName: "Bob", ready: readyStates.NoVote },
      { userId: "3", memberName: "Charlie", ready: readyStates.NoVote },
    ];
    expect(getNoVoteCount(state)).toBe(2);
  });

  it("returns 0 for empty state", () => {
    expect(getNoVoteCount([])).toBe(0);
  });

  it("returns correct count with mixed states", () => {
    const state = [
      { userId: "1", memberName: "Alice", ready: readyStates.isReady },
      { userId: "2", memberName: "Bob", ready: readyStates.notReady },
      { userId: "3", memberName: "Charlie", ready: readyStates.NoVote },
    ];
    expect(getNoVoteCount(state)).toBe(1);
    expect(getReadyCount(state)).toBe(1);
    expect(getNotReadyCount(state)).toBe(1);
  });
});

describe("getPrintState", () => {
  it("returns formatted string with ready members", () => {
    const state = [
      { userId: "1", memberName: "Alice", ready: readyStates.isReady },
      { userId: "2", memberName: "Bob", ready: readyStates.notReady },
    ];
    const result = getPrintState(state);
    expect(result).toContain("Ready check bot results:");
    expect(result).toContain("Alice - :white_check_mark:");
    expect(result).toContain("Bob - :broken_heart:");
  });

  it("returns header for empty state", () => {
    const result = getPrintState([]);
    expect(result).toBe("Ready check bot results: \r\n \r\n");
  });
});
