import React, {useState} from "react";
import AdminSideNav from "../Navbar/AdminSideNav";
import axios from "axios";

export default function AddConference(props) {

    const [data, setData] = useState({
        name: "",
        year: "",
        description: "",
        venue: "",
        payment: ""
    })

    function submit(e) {
        e.preventDefault();
        axios.post("https://icaf-backend.herokuapp.com/conference/save", data).then((res) => {
            console.log(data);
            alert(res.data.messages);
            props.history.push("/conferences-admin");
        }).catch((err) => {
            if(err.response.data.name !== undefined) {
                alert(err.response.data.name);
            } else if(err.response.data.year !== undefined) {
                alert(err.response.data.year);
            } else if(err.response.data.venue !== undefined) {
                alert(err.response.data.venue);
            } else if(err.response.data.payment !== undefined) {
                alert(err.response.data.payment);
            } else if(err.response.data.message !== undefined) {
                alert(err.response.data.message);
            } else {
                alert(err);
            }
        })
    }

    function handle(e) {
        const newData = {...data}
        newData[e.target.id] = e.target.value
        setData(newData)
    }

    return(
        <div className="main">
            <AdminSideNav />
            <div className="container mt-3" style={{
                marginLeft: '60px',
                backgroundColor: '#ccccff',
                boxShadow: '1px 2px 2px 2px rgba(0.3, 0.3, 0.3, 0.3)',
                borderRadius: '5px',
                height : '1000px'
            }}>
                <br/>
                <div className="card" style={{width : '60%', marginTop: 0, marginLeft : '15px', borderRadius: '5px'}}>
                    <div className="card-header" style={{backgroundColor: '#f2f2f2'}}>
                        <h4>Conference</h4>
                    </div>
                    <div className="card-body">
                        <form onSubmit={(e) => submit(e)}>
                            <div className="form-group row">
                                <label htmlFor="name" className="col-sm-3">Name</label>
                                <div className="col-sm-5">
                                    <input type="text" onChange={(e) => handle(e)} className="form-control" id="name" placeholder="Enter Name" value={data.name} required/>
                                </div>
                            </div><br/>
                            <div className="form-group row">
                                <label htmlFor="year" className="col-sm-3">Year</label>
                                <div className="col-sm-5">
                                    <input type="text" onChange={(e) => handle(e)} className="form-control" id="year" placeholder="Enter Year" value={data.year} required/>
                                </div>
                            </div><br/>
                            <div className="form-group row">
                                <label htmlFor="venue" className="col-sm-3">Venue</label>
                                <div className="col-sm-5">
                                    <input type="text" onChange={(e) => handle(e)} className="form-control" id="venue" placeholder="Enter Venue" value={data.venue} required/>
                                </div>
                            </div><br/>
                            <div className="form-group row">
                                <label htmlFor="description" className="col-sm-3">Description</label>
                                <div className="col-sm-5">
                                    <textarea onChange={(e) => handle(e)} className="form-control" id="description" cols="30" rows="6" placeholder="Enter Description" value={data.description} />
                                </div>
                            </div><br/>
                            <div className="form-group row">
                                <label htmlFor="payment" className="col-sm-3">Payment</label>
                                <div className="col-sm-5">
                                    <input type="text" onChange={(e) => handle(e)} className="form-control" id="payment" placeholder="Enter Payment" value={data.payment} required/>
                                </div>
                            </div><br/>
                            <button type="submit" className="btn btn-primary">Save</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}