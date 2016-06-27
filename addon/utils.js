export function delegateTo(propertyName, fnName) {
  return function() {
    let property = this.get(propertyName);
    return property[fnName](...arguments);
  };
}
