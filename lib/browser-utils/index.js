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

function formatBytes(bytes, decimals = 2) {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / (k ** i)).toFixed(dm))} ${sizes[i]}`;
}

export {
  placeholderAuth,
  placeholderUser,
  getStyle,
  formatBytes
};
