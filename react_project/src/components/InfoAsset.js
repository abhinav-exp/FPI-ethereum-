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
    })

    const Backend_url = process.env.REACT_APP_BACKEND_URL;

    return (<div className='OwnerCard'>
        <img className='LN' src={Picstr === "" ? NoPic : Backend_url + "/show/" + Picstr} alt="Profile Pic" />
        <div className='OwnerDetails'>
            <Button variant="light" disabled={true}> {First_Name === "" ? "[Not Avaliable]" : First_Name} </Button>
            <Button variant="light" disabled={true}> {Last_Name === "" ? "[Not Avaliable]" : Last_Name} </Button>
            <br></br>
            <Button> {props.OwnAddr} </Button>
        </div>
    </div>)
}

const TransferProduct = (props) => {

    const [TransferAddr, handleTranferAddr] = useState("");
    const [btnText,      handleBtnText]     = useState("Submit");

    const fun = () => {
        try {
            props.contAbi.methods.Transfer_Product(props.enquiry, TransferAddr).estimateGas()
            .then(gas => {
                props.contAbi.methods.Transfer_Product(props.enquiry, TransferAddr).send({
                    from : props.myacc,
                    gas : gas + 1000000
                })
            })
        }
        catch(e) {
            handleBtnText("Try Again !")
        }
    }

    return (<div className='Feat' >
        <input type="text" placeholder='Address To Transfer Ownship To' onChange={e => handleTranferAddr(e.target.value)} ></input>
        <Button variant='warning' onClick={fun} >{btnText}</Button>
    </div>)
}

const AddPictures = (props) => {

    const [inputFile, handleinputFile] = useState();

    const Backend_url = process.env.REACT_APP_BACKEND_URL;

    const fun = () => {
        var formData = new FormData();
        formData.append("FK", inputFile);
        fetch(
            Backend_url + "/add",
            {
                method: 'POST',
                body: formData,
            }
        ).then(r => {
            if(r.ok){
                r.text().then(a => {
                    props.contAbi.methods.Add_Picture(a, props.enquiry).estimateGas()
                    .then(gas => {
                        props.contAbi.methods.Add_Picture(a, props.enquiry).send({
                            from : props.myacc,
                            gas : gas + 1000000
                        })
                    })
                })
            }
        })
    }

    return (<div className='Feat' >
        <input type="file" onChange={e => handleinputFile(e.target.files[0])} ></input>
        <Button variant='warning' onClick = {fun} >Submit</Button>
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
    const [FeatureNum, handleFeatureNum] = useState(0);
    const [OwnershipBool, handleOwnershipBool] = useState(false);

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
            handleOwnershipBool(false);
            console.log("setting own false")
            console.log(props.enquiry);
            props.contAbi.methods.Get_Asset_of_No(props.enquiry).call()
            .then(r => {
                handleProductDesp(r[1]);
                handleProductName(r[0]);
                // console.log(r[1])
                // handleProductImg(r[2]);
                // handleLoadBool(false);

                props.contAbi.methods.Get_My_Assets_Nos().call({
                    from : props.myacc
                })
                .then(r => {
                    console.log(r)
                    for(let i=0; i<r.length; i++)
                    {
                        if(parseInt(r[i]) === parseInt(props.enquiry)){
                            handleOwnershipBool(true);
                            console.log("setting own true")
                            console.log(props.enquiry)
                            break;
                        }
                    }
                })

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

    const Features = [
        <div></div>, 
        <TransferProduct myacc = {props.myacc} contAbi = {props.contAbi} enquiry = {props.enquiry}></TransferProduct>, 
        <AddPictures     myacc = {props.myacc} contAbi = {props.contAbi} enquiry = {props.enquiry}></AddPictures>
    ]

    const funTransferProduct = () => {
        if(FeatureNum === 1)
            handleFeatureNum(0);
        else
            handleFeatureNum(1);
    }

    const funAddPictures = () => {
        if(FeatureNum === 2)
            handleFeatureNum(0);
        else
            handleFeatureNum(2);
    }

    return (<div>
        <input type="number"  className="InfoNum" value={tempEnq} onInput={e => handleTempEnq(e.target.value)} ></input>
        <input type="submit" onClick={fun} ></input>
        <br></br>
        <Button className='PK' >Product Key : {props.enquiry}</Button>
        {(ErrorBool)?<Alert variant='danger' >This number is invalid</Alert>:
        <div className = 'mega'>
            <div hidden = {(OwnershipBool === false)}>
                <Button variant='info' className='IAB' onClick = {funAddPictures} >Add Pictures</Button>
                <Button variant='info' className='IAB' onClick = {funTransferProduct} >Transfer Product</Button>
                {Features[FeatureNum]}
            </div>
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
            </div>
        </div>}
    </div>)
}