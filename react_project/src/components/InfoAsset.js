import Alert from 'react-bootstrap/Alert'
import { useState, useEffect } from "react";
import NoPic from '../NoPic.jpg';
import { Button } from "react-bootstrap";

const OwnerCard = (props) => {
    const [First_Name, handleFirstName] = useState("");
    const [Last_Name,  handleLastName]  = useState("");
    const [Picstr,     handlePicstr]    = useState(""); 

    useEffect(() => {
        props.contAbi.methods.Check_Addr_Info(props.OwnAddr).call()
        .then((r) => {
            // console.log(r);
            handleFirstName(r[0]);
            handleLastName(r[1]);
            handlePicstr(r[2]);
        })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const Backend_url = process.env.REACT_APP_BACKEND_URL;

    return (<div>
        <img src={Picstr === "" ? NoPic : Backend_url + "/show/" + Picstr} alt="Profile Pic" />
        <div>
            <Button variant="light" disabled={true}> {First_Name === "" ? "[Not Avaliable]" : First_Name} </Button>
            <Button variant="light" disabled={true}> {Last_Name === "" ? "[Not Avaliable]" : Last_Name} </Button>
            <Button> {props.OwnAddr} </Button>
        </div>
    </div>)
}


export default function InfoAsset(props){

    const [tempEnq,     handleTempEnq]    = useState(props.enquiry);
    const [ErrorBool,   handleErrorBool]  = useState(false);
    // const [LoadBool,    handleLoadBool]   = useState(true);
    const [ProductName, handleProductName] = useState("");
    const [ProductDesp, handleProductDesp] = useState("");
    const [ProductImg,  handleProductImg] = useState([]);
    const [ProductAuth, handleProductAuth] = useState([]);

    const fun = (e) => {
        props.handleEnquiry(tempEnq);
    }

    const PicFun = (res) => {
        console.log(res)
        let ans = []
        let count = 0
        let l = res.length;
        for(let i=0; i<l; i++)
        {
            if(res[i] === '')
                count++;
            else
                ans.push(res[i]);
        }
        if(count === l)
        {
            let a = [];
            a.push("");
            return a;
        }
        else{
            return ans;
        }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => {
        console.log("useEffect called");
        if(props.enquiry < 0){
            console.log("if called");
            handleErrorBool(true);
            // handleLoadBool(false);
        }
        else{
            console.log("else called")
            handleErrorBool(false);
            console.log(props.enquiry);
            props.contAbi.methods.Get_Asset_of_No(props.enquiry).call()
            .then(r => {
                handleProductDesp(r[1]);
                handleProductName(r[0]);
                // console.log(r[1])
                // handleProductImg(r[2]);
                // handleLoadBool(false);
                props.contAbi.methods.Get_Pictures(props.enquiry).call()
                .then(res => {
                    handleProductImg(PicFun(res));
                })
                props.contAbi.methods.Get_Authors(props.enquiry).call()
                .then(r => {
                    handleProductAuth(r);
                })
            })
            .catch(r => {
                console.log(r);
                handleErrorBool(true);
                // handleLoadBool(false);
            })
        }
    }, [props.enquiry])

    const Backend_url = process.env.REACT_APP_BACKEND_URL;

    return (<div>
        <input type="number"  className="InfoNum" value={tempEnq} onInput={e => handleTempEnq(e.target.value)} ></input>
        <input type="submit" onClick={fun} ></input>
        <br></br>
        <Button>Product Key : {props.enquiry}</Button>
        <Button>Add Pictures</Button>
        <Button>Transfer Product</Button>
        {(ErrorBool)?<Alert variant='danger' >This number is invalid</Alert>:
         <div className='IAIP'>
            <div className='IAI0'>
                <Alert className='IAI01' variant="danger" > Product Name : <br></br> {ProductName}</Alert>
                <Alert className='IAI02' variant='info'> Product Description : <br></br> {ProductDesp} </Alert>
            </div>
            <div className='IAI'>
                {ProductImg.map(e => {
                    return (<img className='IAIC' src={(e !== "")?Backend_url + "/show/" + e:NoPic} alt="Product Pic" ></img> )
                })}
            </div>
            <div className='IAIU'>
                {ProductAuth.map(e => {
                    return (<OwnerCard OwnAddr = {e} contAbi = {props.contAbi} ></OwnerCard>)
                })}
            </div>
        </div>}
    </div>)
}