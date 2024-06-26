import React from 'react'

const NotACard = ({ width }) => {
    return (
        <div className={`border shadow rounded-md p-1 ${width ? width : "w-full"} mx-auto cursor-not-allowed sm:w-[270px]`}>
            <div className="animate-pulse">
                <div className="">
                    <div className={`bg-slate-500 rounded h-36 ${width ? "w-64" : "w-full"} sm:w-64`}></div>
                    <div className="flex flex-col gap-3 mt-3">
                        <div className="h-2 bg-slate-500 rounded"></div>
                        <div className="h-2 bg-slate-500 rounded"></div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default NotACard
