import React from 'react'
import offers30 from "../assets/offers30.jpg";
import offers25 from "../assets/offers25.jpg";
import offers20 from "../assets/offers20.jpg";
import offers15 from "../assets/offers15.jpg";
import { Link } from 'react-router-dom';

function Offers() {
  return (
    <>
      <section className="bestOffers">
        <h1 className="">Best Offers</h1>
        <div className="offersActual">
          <div className="offers">
            <Link to="#" className="offers30"><img src={offers30} alt="offers30" /></Link>
          </div>
          <div className="offers">
            <Link to="#" className="offers25"><img src={offers25} alt="offers25" /></Link>
          </div>
          <div className="offers">
            <Link to="#" className="offers20"><img src={offers20} alt="offers20" /></Link>
          </div>
          <div className="offers">
            <Link to="#" className="offers15"><img src={offers15} alt="offers15" /></Link>
          </div>
        </div>
      </section>
    </>
  )
}

export default Offers;