import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {QRCodeSVG} from 'qrcode.react';
import api from "../api/axios.js"
function TicketPage(){
    const [error, setError] = useState("");
const [result,setResult]=useState(null)
    const [loading, setLoading] = useState(true);

    let {ticketToken} = useParams();

    useEffect(() => { 
        setLoading(true);

        setError("");
        (async () => {

           
            try {
                const res = await api.get(`/api/registrations/ticket/${ticketToken}`);
                if(res){
                     setResult(res.data)
                    }
            } catch (error) {
                setError(error.response?.data?.message || "Cannot get registration")
            } finally {
                setLoading(false)
            }

        })()
    }, [ticketToken])

        return <div className="bg-black text-white h-screen flex justify-center items-center">
        <h1 className="text-5xl font-bold">GatherSphere your ticket page  </h1>
        {
            loading ? <p className="text-blue-700">Fetching data</p>
                : error ? <p className="text-red-700">{error}</p>
                    : !result.ticketToken ? <p className="text-green-700">Ticket not available</p>
                        :(<>

  <QRCodeSVG value={result.ticketToken} size={200} />


<hr /><hr /><br /><br />
                        <>name : {result.name}
                            ---    event:{result.eventTitle}    --  {result.checkedInAt ? `Checked in at ${new Date(result.checkedInAt).toLocaleString()}` : "Not checked in yet"}</>
                        </>
                        )
      }

    </div>

}

export default TicketPage