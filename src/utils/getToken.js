export function getLocalStorage(keyName) {
  let fetchedItem = localStorage.getItem(`${keyName}`);
  return JSON.parse(fetchedItem);
}

export function setLocalStorage(keyName, value) {
  localStorage.setItem(keyName, JSON.stringify(value));
  return getLocalStorage(keyName);
}
