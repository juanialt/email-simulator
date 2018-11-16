function placeholderAuth(user) {
  if (user) {
    localStorage.setItem("user", JSON.stringify(user));
  } else if (user === null) {
    localStorage.removeItem("user");
  }
  return JSON.parse(localStorage.getItem("user"));
}

function placeholderUser(user) {
  if (user) {
    localStorage.setItem("userSelected", JSON.stringify(user));
  }
  return JSON.parse(localStorage.getItem("userSelected"));
}

function getStyle(oElm, cssRule) {
  if (document.defaultView && document.defaultView.getComputedStyle) {
    return document.defaultView.getComputedStyle(oElm, "").getPropertyValue(cssRule);
  } else if (oElm.currentStyle) {
    const windowsCssRule = cssRule.replace(/-(\w)/g, (match, p1) => p1.toUpperCase());
    return oElm.currentStyle[windowsCssRule];
  }
  return "";
}

export {
  placeholderAuth,
  placeholderUser,
  getStyle
};
