// Big promise for all rotes middleware controllers
exports.BigPromise = (func) => (req, res, next) => {
  Promise.resolve(func(req, res, next)).catch(next);
};

// big promise for all normal code that uses async await
exports.BigPromiseNormal = async (func) => {
  Promise.resolve(func()).catch((err) => {
    console.log(`from big promise normal \n ${err}`);
  });
};
