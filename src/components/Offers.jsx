import React from 'react'
import offers30 from "../assets/offers30.jpg";
import offers25 from "../assets/offers25.jpg";
import offers20 from "../assets/offers20.jpg";
import offers15 from "../assets/offers15.jpg";

function Offers() {
  return (
    <>
      <section className="bestOffers">
        <h1 className="">Best Offers</h1>
        <div className="offersActual">
          <div className="offers">
            <a href="#" className="offers30"><img src={offers30} alt="offers30" /></a>
          </div>
          <div className="offers">
            <a href="#" className="offers25"><img src={offers25} alt="offers25" /></a>
          </div>
          <div className="offers">
            <a href="#" className="offers20"><img src={offers20} alt="offers20" /></a>
          </div>
          <div className="offers">
            <a href="#" className="offers15"><img src={offers15} alt="offers15" /></a>
          </div>
        </div>
      </section>
    </>
  )
}

export default Offers;