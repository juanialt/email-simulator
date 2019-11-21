import React from "react";
import SyntaxHighlighter from "react-syntax-highlighter";
import { tomorrowNight as codeStyle } from "react-syntax-highlighter/dist/esm/styles/hljs";

import Header from "../../components/Header";
import Footer from "../../components/Footer";

import reactImage from "../../images/tech/react.png";
import sassImage from "../../images/tech/sass.png";
import webpackImage from "../../images/tech/webpack.png";
import nodeImage from "../../images/tech/node.png";
import axiosImage from "../../images/tech/axios.png";
import routerImage from "../../images/tech/router.png";
import reduxImage from "../../images/tech/redux.png";
import phpImage from "../../images/tech/php.png";
import mysqlImage from "../../images/tech/mysql.png";

import s from "./Home.scss";

class Home extends React.Component {
  render() {
    const codeOne = `
    yarn install
    `;

    const codeTwo = `
    // Compila el proyecto en modo produccion. Genera un servidor local.
    // Se puede ver el proyecto andando en http://localhost:8080/
    yarn start

    // Compila el proyecto en modo desarrollo. 
    // Genera un servidor local y cada vez que se cambia un archivo actualiza el browser.
    // Se puede ver el proyecto andando en http://localhost:8080/
    yarn dev

    // Compila el proyecto en modo produccion. Minimiza y ofusca todo el codigo.
    yarn build
    `;

    return (
      <React.Fragment>
        <Header />

        <section className={s.content}>
          <section className="app-container">
            <div className={s.header}>
              <h1>Email Simulator</h1>
              <h3>
                Sistema que simula el manejo y funcionamiento de un webmail
              </h3>
            </div>

            <div className={s.stack}>
              <h2>Stack tecnológico</h2>

              <div className={s.tech}>
                <div>
                  <img src={reactImage} alt="React Js" title="React Js" />
                </div>

                <div>
                  <img src={sassImage} alt="Sass" title="Sas" />
                </div>

                <div>
                  <img src={webpackImage} alt="Webpack" title="Webpack" />
                </div>

                <div>
                  <img src={nodeImage} alt="Node Js" title="Node Js" />
                </div>

                <div>
                  <img src={axiosImage} alt="Axios" title="Axios" />
                </div>

                <div>
                  <img
                    src={routerImage}
                    alt="React Router"
                    title="React Router"
                  />
                </div>

                <div>
                  <img src={reduxImage} alt="React Redux" title="React Redux" />
                </div>

                <div>
                  <img src={phpImage} alt="PHP" title="PHP" />
                </div>

                <div>
                  <img src={mysqlImage} alt="MySql" title="MySql" />
                </div>
              </div>
            </div>

            <div className={s.setup}>
              <h2>Setup</h2>
              <p>
                Para iniciar el proyecto primero se deben instalar todas las
                dependencias del mismo con el comando
              </p>
              <SyntaxHighlighter language="javascript" style={codeStyle}>
                {codeOne}
              </SyntaxHighlighter>
              <p>Los modos de ejecución son los siguientes:</p>
              <SyntaxHighlighter language="javascript" style={codeStyle}>
                {codeTwo}
              </SyntaxHighlighter>
            </div>

            <div className={s.author}>
              <h2>Autor</h2>
              <p>Juan Ignacio Alterio</p>
            </div>
          </section>
        </section>

        <Footer />
      </React.Fragment>
    );
  }
}

export default Home;
