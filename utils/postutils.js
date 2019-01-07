const constants = {
  'TYPE_TEXT': 0,
  'TYPE_IMAGE': 1,
  'TYPE_VIDEO': 2
}

function getPostType(type) {
  if (constants.hasOwnProperty(type) != false) {
    return constants[type];
  }
  return -1;
}

module.exports.getPostType = getPostType;
