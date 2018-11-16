import React from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import landing from "../../images/landing-wide.jpg";

import s from "./Home.scss";

class Home extends React.Component {
  render() {
    return (
      <section>
        <Header />
        <section className="home-container">
          <div className={s.titleContainer}>
            <h1>Email Simulator</h1>
            <h2>Universidad CAECE</h2>
            <h3>Arquitectura Web</h3>
          </div>
          <div className={s.imageContainer}>
            <img src={landing} />
          </div>
        </section>
        <Footer />
      </section>
    );
  }
}

export default Home;
