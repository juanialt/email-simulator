import React from "react";

import s from "./Footer.scss";

const Footer = () => (
  <footer className={s.root}>
    <section className="container center">
      <span>© {new Date().getFullYear()} - Email Simulator</span>
    </section>
  </footer>
);

export default Footer;
