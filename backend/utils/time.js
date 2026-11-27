// Inicio del día/mes en una zona horaria (por defecto America/Cancun) como instante UTC.

function partsInTZ(date, timeZone) {
  const fmt = new Intl.DateTimeFormat("en-US", {
    timeZone,
    hourCycle: "h23",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
  const p = Object.fromEntries(fmt.formatToParts(date).map((x) => [x.type, x.value]));
  return { y: +p.year, m: +p.month, d: +p.day, h: +p.hour, mi: +p.minute, s: +p.second };
}

// Diferencia (ms) entre la hora local de la zona y UTC en ese instante.
function offsetMs(date, timeZone) {
  const p = partsInTZ(date, timeZone);
  const asUTC = Date.UTC(p.y, p.m - 1, p.d, p.h, p.mi, p.s);
  return asUTC - Math.floor(date.getTime() / 1000) * 1000;
}

function zonedMidnight(y, m, d, timeZone) {
  const guess = new Date(Date.UTC(y, m - 1, d));
  return new Date(guess.getTime() - offsetMs(guess, timeZone));
}

/** Edad cumplida (años) de una fecha de nacimiento en la fecha actual de la zona. */
exports.ageOn = (birthdate, timeZone, now = new Date()) => {
  const b = new Date(birthdate);
  const by = b.getUTCFullYear();
  const bm = b.getUTCMonth() + 1;
  const bd = b.getUTCDate();
  const t = partsInTZ(now, timeZone);
  let age = t.y - by;
  if (t.m < bm || (t.m === bm && t.d < bd)) age -= 1;
  return age;
};

exports.periodRange = (periodo, timeZone, now = new Date()) => {
  const p = partsInTZ(now, timeZone);
  if (periodo === "hoy") {
    const start = zonedMidnight(p.y, p.m, p.d, timeZone);
    const end = new Date(start.getTime() + 24 * 3600 * 1000);
    return { start, end };
  }
  if (periodo === "mes") {
    const start = zonedMidnight(p.y, p.m, 1, timeZone);
    const ny = p.m === 12 ? p.y + 1 : p.y;
    const nm = p.m === 12 ? 1 : p.m + 1;
    return { start, end: zonedMidnight(ny, nm, 1, timeZone) };
  }
  return null; // total
};
