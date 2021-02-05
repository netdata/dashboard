/* eslint-disable arrow-body-style */
// @ts-nocheck

export default (el) => {
  return el.getBoundingClientRect().top / window.innerHeight > 0.5 ? "top" : "bottom"
}
