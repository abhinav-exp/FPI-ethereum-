import { Button } from "react-bootstrap";
import { useState } from "react";

export default function Menu(){

    const [num, handleNum] = useState(0);

    return (<div className="Menu">
        <Button variant={(num === 0)? "primary" : "light"} className="perc30" onClick={() => handleNum(0)}> Sell </Button>
        <Button variant={(num === 1)? "primary" : "light"} className="perc30" onClick={() => handleNum(1)}> Assets </Button>
        <Button variant={(num === 2)? "primary" : "light"} className="perc30" onClick={() => handleNum(2)}> Explore </Button>
    </div>);
}