// Demo backend for Kahekesi.
// The real app talks to Firebase through a small adapter (see public/kk-firebase.js).
// This file gives the page the same adapter, but keeps everything in the visitor's browser
// and fills it with made-up sample data, so anyone can try the app without signing in.

const KEY = 'kahekesi-demo.v2';
const DAY = 864e5;
const pad = n => String(n).padStart(2, '0');
const ymd = d => d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate());
const dayOff = n => ymd(new Date(Date.now() + n * DAY));
const ago = (days, hour = 12) => { const d = new Date(Date.now() - days * DAY); d.setHours(hour, 0, 0, 0); return d.getTime(); };

/* ---------- sample data (all invented) ---------- */
function sample() {
  const now = Date.now();
  const item = (id, p) => [id, Object.assign({
    text: '', kind: 'todo', owner: 'a', cat: '', date: null, start: null, end: null, repeat: 'none', imp: 0, urg: 0, due: null,
    est: '', note: '', part: '', steps: [], points: 10, done: false, doneAt: null, doneBy: null, spawn: null,
    askedBy: null, ask: null, askHide: false, createdAt: ago(3), createdBy: 'a',
  }, p)];
  const done = (id, text, who, days, points, extra) => item(id, Object.assign({text, owner: who, done: true, doneAt: ago(days, 19), doneBy: who, points, createdAt: ago(days + 1)}, extra));

  const items = Object.fromEntries([
    // Today and coming up
    item('t1', {text: 'Call the landlord about the radiator', owner: 'a', cat: 'Home', date: dayOff(0), start: '10:00', est: '15 min'}),
    item('t2', {text: 'Clean the kitchen together', owner: 'both', cat: 'Home', date: dayOff(0), start: '18:30', end: '19:15', points: 20,
      steps: [{t: 'Dishes', d: true}, {t: 'Counters', d: false}, {t: 'Floor', d: false}]}),
    item('t3', {text: 'Change the cat litter', owner: 'a', date: dayOff(0), repeat: 'daily', points: 5}),
    item('t4', {text: 'Water the plants', owner: 'both', date: dayOff(0), repeat: 'weekly', points: 5}),
    item('t5', {text: 'Book a dentist appointment', owner: 'b', cat: 'Admin', due: dayOff(1), urg: 1, createdBy: 'b'}),
    item('t6', {text: 'Pay the electricity bill', owner: 'a', cat: 'Admin', due: dayOff(3), imp: 1, remT: '19:00', remD: dayOff(2), remE: 60}),
    item('t7', {text: 'Plan the weekend trip', owner: 'both', date: dayOff(2), start: '20:00', points: 15, note: 'Train or bus? Check prices first.'}),
    item('t8', {text: 'Return the library books', owner: 'b', cat: 'Errands', due: dayOff(5), createdBy: 'b'}),
    // A request from Alex to Sam, waiting for an answer
    item('r1', {text: 'Pick up the parcel from the post office', owner: 'b', askedBy: 'a', ask: 'pending', createdBy: 'a', createdAt: now - 36e5}),
    // Inbox: quick captures not sorted yet
    item('i1', {text: 'Try the new bakery near the market', kind: 'inbox', owner: 'a'}),
    item('i2', {text: 'Ask about a pottery class for two', kind: 'inbox', owner: 'b', createdBy: 'b'}),
    // Shopping list
    item('s1', {text: 'Oat milk', kind: 'shopping', owner: 'both', points: 5}),
    item('s2', {text: 'Tomatoes', kind: 'shopping', owner: 'both', points: 5}),
    item('s3', {text: 'Rye bread', kind: 'shopping', owner: 'both', points: 5, createdBy: 'b'}),
    item('s4', {text: 'Cat food', kind: 'shopping', owner: 'both', points: 5}),
    item('s5', {text: 'Dish soap', kind: 'shopping', owner: 'both', points: 5, createdBy: 'b'}),
    // Bought on the last shopping trip (logged with prices)
    done('b1', 'Coffee beans', 'b', 2, 5, {kind: 'shopping', owner: 'both', tripId: 'trip1', price: 8.49}),
    done('b2', 'Pasta', 'b', 2, 5, {kind: 'shopping', owner: 'both', tripId: 'trip1', price: 1.29}),
    done('b3', 'Bananas', 'b', 2, 5, {kind: 'shopping', owner: 'both', tripId: 'trip1', price: 1.59}),
    // Finished tasks (these earn the points and the streak)
    done('d1', 'Fix the wobbly shelf', 'a', 0, 20, {cat: 'Home'}),
    done('d2', 'Send the rent', 'b', 1, 10, {cat: 'Admin'}),
    done('d3', 'Vacuum the living room', 'a', 1, 10, {cat: 'Home'}),
    done('d4', 'Laundry', 'b', 2, 10),
    done('d5', 'Renew the bus card', 'a', 3, 5, {cat: 'Errands'}),
    done('d6', 'Cook for the week', 'b', 4, 20),
    done('d7', 'Clean the bathroom', 'a', 5, 20, {cat: 'Home'}),
    done('d8', 'Reply to the bank', 'b', 6, 10, {cat: 'Admin'}),
    done('d9', 'Take out the recycling', 'a', 7, 5),
    done('d10', 'Iron shirts', 'b', 8, 10),
    done('d11', 'Defrost the freezer', 'b', 9, 20, {cat: 'Home'}),
  ]);

  // More shop trips over the last three months, so the trip list, search and the monthly report have something to show.
  const trips = {};
  const trip = (id, who, days, store, list) => {
    const its = list.map(([text, price, qty, brand, sale], i) => {
      const iid = id + '-' + i;
      items[iid] = item(iid, {text, kind: 'shopping', owner: 'both', points: 5, done: true, doneAt: ago(days, 18), doneBy: who, tripId: id, price, createdAt: ago(days + 2)})[1];
      return {id: iid, text, price, qty, brand, sale: !!sale};
    });
    trips[id] = {who, at: ago(days, 18), store, total: Math.round(its.reduce((n, x) => n + (x.price || 0), 0) * 100) / 100, createdAt: ago(days, 18), items: its};
  };
  trip('tr2', 'a', 6, 'Lidl', [['Oat milk', 1.49, '1 l', 'Oatly', false], ['Tomatoes', 2.39, '500 g', '', false], ['Rye bread', 1.65, '1', 'Leibur', false], ['Tofu', 2.19, '400 g', 'Taifun', true], ['Bananas', 1.39, '1 kg', '', false]]);
  trip('tr3', 'b', 12, 'Rimi', [['Pasta', 0.99, '500 g', 'Barilla', true], ['Lentils', 2.29, '1 kg', '', false], ['Olive oil', 7.99, '0.75 l', 'Filippo Berio', false], ['Dish soap', 2.69, '450 ml', 'Fairy', false], ['Chocolate', 1.47, '100 g', 'Fazer', false]]);
  trip('tr4', 'a', 24, 'Prisma', [['Oat milk', 1.69, '1 l', 'Oatly', false], ['Rye bread', 1.75, '1', 'Leibur', false], ['Apples', 2.49, '1 kg', '', false], ['Shampoo', 4.99, '400 ml', 'Head & Shoulders', true], ['Cat food', 6.49, '12x85 g', 'Whiskas', false]]);
  trip('tr5', 'b', 38, 'Lidl', [['Oat milk', 1.49, '1 l', 'Oatly', false], ['Bananas', 1.29, '1 kg', '', true], ['Peanut butter', 3.29, '350 g', '', false], ['Toilet paper', 5.99, '8', 'Zewa', false], ['Coffee beans', 7.99, '500 g', 'Paulig', false]]);
  trip('tr6', 'a', 55, 'Rimi', [['Rye bread', 1.75, '1', 'Leibur', false], ['Tomatoes', 2.59, '500 g', '', false], ['Vegan sausages', 3.49, '200 g', 'Oumph', false], ['Basmati rice', 3.99, '1 kg', '', false], ['Sparkling water', 2.94, '6x0.5 l', 'Värska', true]]);

  return {
    config: {main: {nameA: 'Alex', nameB: 'Sam', goalTitle: 'Weekend in Tartu', goalTarget: 300, goalSince: ago(14),
      cats: ['Home', 'Admin', 'Errands'], tz: Intl.DateTimeFormat().resolvedOptions().timeZone || 'Europe/Tallinn'}},
    items,
    rewards: {
      w1: {title: 'Pick the movie', cost: 30, owner: 'a', createdAt: ago(20)},
      w2: {title: 'Breakfast in bed', cost: 80, owner: 'a', createdAt: ago(20)},
      w3: {title: 'Sleep in on Sunday', cost: 40, owner: 'b', createdAt: ago(20)},
      w4: {title: 'A night off from dishes', cost: 60, owner: 'b', createdAt: ago(20)},
    },
    redemptions: {
      x1: {who: 'b', title: 'Sleep in on Sunday', cost: 40, at: ago(3, 9)},
    },
    trips: Object.assign(trips, {
      trip1: {who: 'b', at: ago(2, 18), store: 'Rimi', total: 14.86, createdAt: ago(2, 18), items: [
        {id: 'b1', text: 'Coffee beans', price: 8.49, qty: '500 g', brand: 'Paulig', sale: true},
        {id: 'b2', text: 'Pasta', price: 1.29, qty: '500 g', brand: 'Barilla', sale: false},
        {id: 'b3', text: 'Bananas', price: 1.59, qty: '1 kg', brand: '', sale: false},
        {id: 'e1', text: 'Yoghurt', price: 3.49, qty: '4x150 g', brand: 'Alma', sale: false},
      ]},
    }),
    status: {}, breaks: {}, wishes: {},
    reminders: {
      m1: {who: 'a', from: 'a', text: 'Take vitamins', time: '09:00', days: 'daily', every: 30, until: '12:00', priv: false, doneOn: dayOff(0), createdAt: ago(10)},
      m2: {who: 'a', from: 'a', text: 'Daily Wordle', time: '20:00', days: 'daily', every: 60, until: '22:00', priv: false, doneOn: null, createdAt: ago(10)},
      m3: {who: 'a', from: 'b', text: 'Cancel the streaming trial', time: '10:00', days: 'date', date: dayOff(4), every: 60, until: '22:00', priv: false, doneOn: null, createdAt: ago(1)},
      m4: {who: 'b', from: 'a', text: 'Water the balcony plants', time: '18:00', days: 'pick', wd: [1, 4], every: 15, until: '21:00', priv: false, doneOn: null, createdAt: ago(5)},
      m5: {who: 'b', from: 'b', text: 'Stretch for 10 minutes', time: '21:00', days: 'weekdays', every: 0, until: '22:00', priv: false, doneOn: null, createdAt: ago(8)},
    },
  };
}

/* ---------- a tiny store that mimics the Firestore adapter ---------- */
let data;
try { data = JSON.parse(localStorage.getItem(KEY)); } catch (e) { data = null; }
if (!data || typeof data !== 'object') data = sample();
const save = () => { try { localStorage.setItem(KEY, JSON.stringify(data)); } catch (e) {} };
save();

const collListeners = {}, docListeners = {};
const coll = c => (data[c] = data[c] || {});
const clone = v => v == null ? v : JSON.parse(JSON.stringify(v));
const snapColl = c => ({docs: Object.entries(coll(c)).map(([id, d]) => ({id, data: () => clone(d)})), fromCache: false});
const snapDoc = (c, id) => ({id, exists: id in coll(c), data: () => clone(coll(c)[id])});

function changed(c, id) {
  save();
  queueMicrotask(() => {
    for (const cb of collListeners[c] || []) cb(snapColl(c));
    for (const cb of docListeners[c + '/' + id] || []) cb(snapDoc(c, id));
  });
}
const listen = (map, key, cb, first) => { (map[key] = map[key] || new Set()).add(cb); queueMicrotask(() => cb(first())); return () => map[key].delete(cb); };

const wrapDoc = (c, id) => ({
  set: async d => { coll(c)[id] = clone(d); changed(c, id); },
  update: async d => { coll(c)[id] = Object.assign(coll(c)[id] || {}, clone(d)); changed(c, id); },
  delete: async () => { delete coll(c)[id]; changed(c, id); },
  onSnapshot: cb => listen(docListeners, c + '/' + id, cb, () => snapDoc(c, id)),
});
const splitPath = path => { const p = path.split('/'); const id = p.pop(); return [p.join('/'), id]; };

const kkDb = {
  collection: c => ({
    doc: id => wrapDoc(c, id),
    onSnapshot: cb => listen(collListeners, c, cb, () => snapColl(c)),
  }),
  doc: path => wrapDoc(...splitPath(path)),
};

/* ---------- demo banner with a reset button ---------- */
function banner() {
  // The real app starts behind a sign-in screen; the demo skips it.
  const gate = document.getElementById('gate');
  if (gate) gate.hidden = true;
  const b = document.createElement('div');
  b.setAttribute('role', 'note');
  b.style.cssText = 'position:fixed;top:0;left:0;right:0;z-index:100;display:flex;gap:10px;align-items:center;justify-content:center;' +
    'padding:6px 12px;font:600 12px/1.3 Figtree,system-ui,sans-serif;background:#1f2a30;color:#fff;text-align:center';
  const t = document.createElement('span');
  t.textContent = 'Demo with made-up data. Changes stay in your browser only.';
  const r = document.createElement('button');
  r.type = 'button';
  r.textContent = 'Reset';
  r.style.cssText = 'font:inherit;padding:3px 10px;border-radius:999px;border:1px solid rgba(255,255,255,.5);background:transparent;color:#fff;cursor:pointer';
  r.onclick = () => { try { localStorage.removeItem(KEY); localStorage.removeItem('kahekesi.me'); } catch (e) {} location.reload(); };
  b.append(t, r);
  document.body.append(b);
  document.body.style.paddingTop = (b.offsetHeight) + 'px';
}
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', banner); else banner();

window.kkDb = kkDb;
window.dispatchEvent(new CustomEvent('kk-db', {detail: kkDb}));
