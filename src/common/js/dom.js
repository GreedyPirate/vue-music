/**
 * 为dom添加class
 * @param dom
 * @param newclass
 */
export function addClass(dom, newclass) {
  if (hasClass(dom, newclass)) return;

  let classes = dom.className.split(" ");
  classes.push(newclass);
  dom.className = classes.join(" ");
}

/**
 * 判断dom是否有某一个class
 * @param dom
 * @param className
 * @returns {boolean}
 */
export function hasClass(dom, className) {
  let reg = /(^|\\s)' + className + '(\\s|$)/g;
  return reg.test(className);
}

/**
 * 类似jquery的attr方法
 * @param el
 * @param name
 * @param val
 */
export function getAttr(el, name, val) {
  let prefix = 'data-';
  if (val) {
    return el.setAttribute(prefix + name, val);
  } else {
    return el.getAttribute(prefix + name);
  }
}

let regularDom = document.createElement("div");
let vendor = (() => {
  let prefixs = {
    webkit: 'webkitTransform',
    Moz: 'MozTransform',
    O: 'OTransform',
    ms: 'msTransform',
    standard: 'transform'
  }
  for (let key in prefixs) {
    if (regularDom.style[key] !== undefined) {
      return key;
    }
  }
  return false;
});

export function prefixStyle(style) {
  if(!vendor) return false;
  if(vendor === 'standard') return style;

  return vendor + style.charAt(0).toUpperCase() + style.substr(1);
}
