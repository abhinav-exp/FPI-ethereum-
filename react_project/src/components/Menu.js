import { Button } from "react-bootstrap";
import { useState } from "react";

function Profile(){
    return (<div> <img src="https://localhost:8000/" alt="Image Not Available" width="2000" height="2000" ></img></div>)
}

function InfoAsset(){
    return (<div>Info Asset</div>)
}

function InfoProfile(){
    return (<div>Info Profile</div>)
}

export default function Menu(){

    const [num, handleNum] = useState(0);

    const V = [<Profile></Profile>, <InfoAsset></InfoAsset>, <InfoProfile></InfoProfile>]

    return (<div className="Menu">
        <Button variant={(num === 0)? "primary" : "light"} className="perc30" onClick={() => handleNum(0)}> Profile </Button>
        <Button variant={(num === 1)? "primary" : "light"} className="perc30" onClick={() => handleNum(1)}> Info Asset </Button>
        <Button variant={(num === 2)? "primary" : "light"} className="perc30" onClick={() => handleNum(2)}> Info Profile </Button>
        {V[num]}
    </div>);
}