// Moodline engine - mood pattern math (no DOM)
(function (root) {
  'use strict';

  // Entry: {id, mood 1-5, tag, note, at ISO}
  var TAGS = ['calm', 'content', 'energetic', 'tired', 'stressed', 'anxious'];
  var WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  function dayKey(d) {
    return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
  }

  function avg(list) {
    if (!list.length) return 0;
    var s = 0;
    list.forEach(function (e) { s += Number(e.mood) || 0; });
    return Math.round(s / list.length * 100) / 100;
  }

  // Entries from the last N days (inclusive of today).
  function recent(entries, days, today) {
    var cutoff = new Date(today.getTime() - (days - 1) * 86400000);
    cutoff.setHours(0, 0, 0, 0);
    return entries.filter(function (e) { return new Date(e.at) >= cutoff; });
  }

  function previousPeriod(entries, days, today) {
    var end = new Date(today.getTime() - (days - 1) * 86400000);
    end.setHours(0, 0, 0, 0);
    var start = new Date(end.getTime() - days * 86400000);
    return entries.filter(function (e) {
      var t = new Date(e.at);
      return t >= start && t < end;
    });
  }

  // Trend: this period's average minus previous period's (same length). Null if either side empty.
  function trend(entries, days, today) {
    var cur = avg(recent(entries, days, today));
    var prev = avg(previousPeriod(entries, days, today));
    if (!recent(entries, days, today).length || !previousPeriod(entries, days, today).length) return null;
    return Math.round((cur - prev) * 100) / 100;
  }

  // Average mood per weekday: [{day, avg, count}]
  function byWeekday(entries) {
    var acc = WEEKDAYS.map(function () { return { sum: 0, count: 0 }; });
    entries.forEach(function (e) {
      var d = new Date(e.at).getDay();
      acc[d].sum += Number(e.mood) || 0;
      acc[d].count++;
    });
    return acc.map(function (a, i) {
      return { day: WEEKDAYS[i], avg: a.count ? Math.round(a.sum / a.count * 100) / 100 : 0, count: a.count };
    });
  }

  function bestWorstWeekday(entries) {
    var w = byWeekday(entries).filter(function (x) { return x.count > 0; });
    if (!w.length) return { best: null, worst: null };
    w.sort(function (a, b) { return b.avg - a.avg; });
    return { best: w[0], worst: w[w.length - 1] };
  }

  function tagCounts(entries) {
    var c = {};
    entries.forEach(function (e) { if (e.tag) c[e.tag] = (c[e.tag] || 0) + 1; });
    return c;
  }

  // Check-in streak: consecutive days with at least one entry, ending today or yesterday.
  function streak(entries, today) {
    var days = {};
    entries.forEach(function (e) { days[dayKey(new Date(e.at))] = true; });
    var s = 0;
    for (var d = 0; d < 400; d++) {
      var day = new Date(today.getTime());
      day.setDate(day.getDate() - d);
      if (days[dayKey(day)]) s++;
      else if (d === 0) continue;
      else break;
    }
    return s;
  }

  // One-word summary for an average.
  function label(a) {
    if (a >= 4.2) return 'thriving';
    if (a >= 3.4) return 'steady';
    if (a >= 2.6) return 'meh';
    if (a > 0) return 'rough';
    return 'no data';
  }

  var api = { TAGS: TAGS, WEEKDAYS: WEEKDAYS, dayKey: dayKey, avg: avg, recent: recent,
    previousPeriod: previousPeriod, trend: trend, byWeekday: byWeekday,
    bestWorstWeekday: bestWorstWeekday, tagCounts: tagCounts, streak: streak, label: label };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.MoodEngine = api;
})(typeof self !== 'undefined' ? self : this);
