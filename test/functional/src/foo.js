module.exports = function (lucky) {
  var response = 'You will fall into a hole';

  if (lucky) {
    response = 'You will have good fortune';
  }

  return response;
};
