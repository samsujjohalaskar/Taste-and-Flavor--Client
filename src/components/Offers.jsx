import React from 'react'
import offers30 from "../assets/offers30.jpg";
import offers25 from "../assets/offers25.jpg";
import offers20 from "../assets/offers20.jpg";
import offers15 from "../assets/offers15.jpg";
import { Link } from 'react-router-dom';

function Offers() {
  return (
    <>
      <section className="flex flex-wrap justify-center flex-col bg-bg pt-6 pb-12 pl-4 h-max w-full md:py-14 md:pl-20 lg:pl-32 2xl:items-center 2xl:pl-0">
        <div className='flex flex-col 2xl:w-[1200px]'>
          <p className="text-xl font-extrabold md:text-2xl">Best Offers</p>
          <div className="flex flex-wrap gap-4 mt-2">
            {[offers30, offers25, offers20, offers15].map((offer, index) => (
              <div key={index} className="h-20 rounded shadow-offers md:h-[156px]">
                <Link to="#">
                  <img className='w-16 md:w-[122px]' src={offer} alt={offer.toString} />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}

export default Offers;