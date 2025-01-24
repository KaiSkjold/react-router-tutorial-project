function getLocalStorageItem(key) {
  const item = localStorage.getItem(key);
  return item ? JSON.parse(item) : null;
}

function setLocalStorageItem(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function searchContacts(contacts, query) {
  const lowerQuery = query.toLowerCase();
  return contacts.filter(contact => 
    (contact.first && contact.first.toLowerCase().includes(lowerQuery)) ||
    (contact.last && contact.last.toLowerCase().includes(lowerQuery))
  );
}

function sortContacts(contacts) {
  return contacts.sort((a, b) => {
    if (a.last < b.last) return -1;
    if (a.last > b.last) return 1;
    if (a.createdAt < b.createdAt) return -1;
    if (a.createdAt > b.createdAt) return 1;
    return 0;
  });
}

export async function getContacts(query) {
  await fakeNetwork(`getContacts:${query}`);
  let contacts = getLocalStorageItem("contacts");
  if (!contacts) contacts = [];
  if (query) {
    contacts = searchContacts(contacts, query);
  }
  return sortContacts(contacts);
}

export async function createContact() {
  await fakeNetwork();
  let id = Math.random().toString(36).substring(2, 9);
  let contact = { id, createdAt: Date.now() };
  let contacts = await getContacts();
  contacts.unshift(contact);
  await set(contacts);
  return contact;
}

export async function getContact(id) {
  await fakeNetwork(`contact:${id}`);
  let contacts = getLocalStorageItem("contacts");
  let contact = contacts.find(contact => contact.id === id);
  return contact ?? null;
}

export async function updateContact(id, updates) {
  await fakeNetwork();
  let contacts = getLocalStorageItem("contacts");
  let contact = contacts.find(contact => contact.id === id);
  if (!contact) throw new Error("No contact found for", id);
  Object.assign(contact, updates);
  await set(contacts);
  return contact;
}

export async function deleteContact(id) {
  let contacts = getLocalStorageItem("contacts");
  let index = contacts.findIndex(contact => contact.id === id);
  if (index > -1) {
    contacts.splice(index, 1);
    await set(contacts);
    return true;
  }
  return false;
}

function set(contacts) {
  setLocalStorageItem("contacts", contacts);
}

// fake a cache so we don't slow down stuff we've already seen
let fakeCache = {};

async function fakeNetwork(key) {
  if (!key) {
    fakeCache = {};
  }

  if (fakeCache[key]) {
    return;
  }

  fakeCache[key] = true;
  return new Promise(res => {
    setTimeout(res, Math.random() * 800);
  });
}