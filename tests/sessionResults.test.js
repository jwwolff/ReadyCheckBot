const { printFailedSessionResult } = require("../src/utility/sessionResults");
const { readyStates } = require("../src/utility/readyCheckState");

describe("printFailedSessionResult", () => {
  it("returns failed header", () => {
    const result = printFailedSessionResult([]);
    expect(result).toContain("Ready check FAILED :x:.");
   });

  it("shows ready members with checkmark", () => {
    const state = [
      { userId: "1", memberName: "Alice", ready: readyStates.isReady },
     ];
    const result = printFailedSessionResult(state);
    expect(result).toContain("Alice: Ready :white_check_mark:");
   });

  it("shows not ready members with x", () => {
    const state = [
      { userId: "1", memberName: "Bob", ready: readyStates.notReady },
     ];
    const result = printFailedSessionResult(state);
    expect(result).toContain("Bob: Not Ready :x:");
   });

  it("shows members with no vote as AFK", () => {
    const state = [
      { userId: "1", memberName: "Charlie", ready: readyStates.NoVote },
     ];
    const result = printFailedSessionResult(state);
    expect(result).toContain("Charlie: AFK :zzz:");
   });

  it("handles multiple members with mixed states", () => {
    const state = [
      { userId: "1", memberName: "Alice", ready: readyStates.isReady },
      { userId: "2", memberName: "Bob", ready: readyStates.notReady },
      { userId: "3", memberName: "Charlie", ready: readyStates.NoVote },
     ];
    const result = printFailedSessionResult(state);
    expect(result).toContain("Alice: Ready :white_check_mark:");
    expect(result).toContain("Bob: Not Ready :x:");
    expect(result).toContain("Charlie: AFK :zzz:");
   });

  it("returns header-only for empty state", () => {
    const result = printFailedSessionResult([]);
    expect(result).toBe("Ready check FAILED :x:. \r\n");
   });
});
