const { periodRange } = require("../utils/time");

describe("periodRange (America/Cancun, UTC-5 sin horario de verano)", () => {
  it("hoy a las 02:00 UTC del 28 nov = 21:00 del 27 nov en Cancún", () => {
    const { start, end } = periodRange("hoy", "America/Cancun", new Date("2026-11-28T02:00:00Z"));
    expect(start.toISOString()).toBe("2026-11-27T05:00:00.000Z");
    expect(end.toISOString()).toBe("2026-11-28T05:00:00.000Z");
  });
  it("mes de diciembre cruza de año", () => {
    const { start, end } = periodRange("mes", "America/Cancun", new Date("2026-12-15T12:00:00Z"));
    expect(start.toISOString()).toBe("2026-12-01T05:00:00.000Z");
    expect(end.toISOString()).toBe("2027-01-01T05:00:00.000Z");
  });
  it("total → null", () => {
    expect(periodRange("total", "America/Cancun")).toBeNull();
  });
});
