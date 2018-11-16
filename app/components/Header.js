import React from "react";
import { Link } from "react-router-dom";
import classNames from "classnames";
import Paper from "@material-ui/core/Paper";
import logoImg from "../images/logo-full-crop.png";

import s from "./Header.scss";

const Header = () => (
  <header className={s.root}>
    <Paper>
      <section className={classNames("center", s.container)}>
        <Link to="/" className={s.imageLink}>
          <img src={logoImg} />
        </Link>
        <section className={s.btnContainer}>
          <Link className={s.btn} to="/sign-in">Ingresar</Link>
          <Link className={s.btn} to="/register">Registrarse</Link>
        </section>
      </section>
    </Paper>
  </header>
);

export default Header;
