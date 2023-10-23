const findError = (field, errors) => {
  const obj = errors[field];
  if (obj) {
    const errObj = { field: field, message: obj.message };
    return errObj;
  }
  return obj;
};

export default findError;
