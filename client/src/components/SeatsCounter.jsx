function SeatsCounter({seatsLeft,capacity}){
    return<>
    <h5>seats capacity -- {capacity}</h5>
    {seatsLeft===0? <><h5>Event Full</h5></>
    :<><h5>seats left -- {seatsLeft}</h5></>}</>
}
export {SeatsCounter}