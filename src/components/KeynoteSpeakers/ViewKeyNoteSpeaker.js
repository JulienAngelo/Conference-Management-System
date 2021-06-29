import React, {useState, useEffect} from "react";
import axios from "axios";
import EditorSideNav from "../Navbar/EditorSideNav";
import appleCamera from "../../images/apple-camera.png";
import {storage} from "../../firebase";

export default function ViewKeyNoteSpeaker(props) {

    const [id, setId] = useState("");
    const [name, setName] = useState("");
    const [designation, setDesignation] = useState("");
    const [description, setDescription] = useState("");
    const [imageURL, setImageURL] = useState("");
    const [image, setImage] = useState(null);
    const [progress, setProgress] = useState('');

    useEffect(() => {
        getKeyNoteSpeaker();
    }, [])

    function getKeyNoteSpeaker() {
        const keyNoteSpeakerId = props.match.params.id;
        axios.get("https://icaf-backend.herokuapp.com/keynote-speakers/" + keyNoteSpeakerId).then((res) => {
            console.log(res.data);
            setId(res.data.id);
            setName(res.data.name);
            setDesignation(res.data.designation);
            setDescription(res.data.description);
            setImageURL(res.data.imageURL);
        }).catch((err) => {
            alert(err);
        })
    }

    function submit(e) {
        e.preventDefault();
        const dataObject = {
            name,
            designation,
            description,
            imageURL
        }
        const keyNoteSpeakerId = props.match.params.id;
        axios.put("https://icaf-backend.herokuapp.com/keynote-speakers/" + keyNoteSpeakerId, dataObject).then((res) => {
            console.log(dataObject);
            alert(res.data.messages);
            props.history.push("/keynote-speakers");
        }).catch((err) => {
            if(err.response.data.name !== undefined) {
                alert(err.response.data.name);
            } else if(err.response.data.imageURL !== undefined) {
                alert(err.response.data.designation);
            } else if(err.response.data.designation !== undefined) {
                alert(err.response.data.imageURL);
            } else if(err.response.data.message !== undefined) {
                alert(err.response.data.message);
            } else {
                alert(err);
            }
        })
    }

    function handleImageChange(e) {
        if(e.target.files[0]) {
            const imageFile = e.target.files[0]
            setImage(imageFile)
        }
    }

    function handleImageUpload(e) {
        e.preventDefault();
        if(image == null) {
            alert("Please select an image!");
        } else {
            const uploadTask = storage.ref(`KeyNotes/${image.name}`).put(image);
            uploadTask.on('state_changed',
                (snapshot) => {
                    const progressValue = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
                    setProgress(progressValue);
                },
                (error) => {
                    alert(error);
                },
                () => {
                    storage.ref('KeyNotes').child(image.name).getDownloadURL().then(url => {
                        console.log(url);
                        const uploadedURL = url;
                        setImageURL(uploadedURL);
                        alert("Image uploaded successfully.")
                    })
                });
        }
    }

    return(
        <div className="main">
            <EditorSideNav />
            <div className="container mt-3" style={{
                marginLeft: '60px',
                backgroundColor: '#ccccff',
                boxShadow: '1px 2px 2px 2px rgba(0.3, 0.3, 0.3, 0.3)',
                borderRadius: '5px',
                height : '1000px'
            }}>
                <br/>
                <div className="card" style={{width : '70%', marginTop: 0, marginLeft : '15px', borderRadius: '5px'}}>
                    <div className="card-header" style={{backgroundColor: '#f2f2f2'}}>
                        <h4>Keynote Speaker</h4>
                    </div>
                    <div className="card-body">
                        <form>
                            <div className="form-group row">
                                <label htmlFor="id" className="col-sm-3">Id</label>
                                <div className="col-sm-5">
                                    <input type="text" className="form-control" id="id" value={id} readOnly/>
                                </div>
                            </div><br/>
                            <div className="form-group row">
                                <label htmlFor="name" className="col-sm-3">Name</label>
                                <div className="col-sm-5">
                                    <input type="text" className="form-control" onChange={(e) => setName(e.target.value)} id="name" placeholder="Enter Name" value={name} required/>
                                </div>
                            </div><br/>
                            <div className="form-group row">
                                <label htmlFor="designation" className="col-sm-3">Designation</label>
                                <div className="col-sm-5">
                                    <textarea className="form-control" onChange={(e) => setDesignation(e.target.value)} id="designation" cols="30" rows="6" placeholder="Enter Designation" value={designation} required/>
                                </div>
                            </div><br/>
                            <div className="form-group row">
                                <label htmlFor="description" className="col-sm-3">Description</label>
                                <div className="col-sm-5">
                                    <textarea className="form-control" onChange={(e) => setDescription(e.target.value)} id="description" cols="30" rows="6" placeholder="Enter Description" value={description} />
                                </div>
                            </div><br/>
                            <div className="form-group row">
                                <label htmlFor="imageURL" className="col-sm-3">Image</label>
                                <div className="col-sm-5">
                                    <input type="file" onChange={(e) => handleImageChange(e)} className="form-control file-box" id="imageURL" />
                                </div>
                                <div className="col">
                                    <button onClick={(e) => handleImageUpload(e)} className="btn btn-success">Upload</button>
                                </div>
                            </div><br/>
                            <div className="form-group row">
                                <div className="col-md-3 offset-md-3">
                                    <img src={ imageURL || imageURL || appleCamera} alt="No Image" height="100" width="160" /><br />
                                    <progress className="progress-bar progress-bar-striped bg-danger" role="progressbar" value={progress} max="100" />
                                </div>
                            </div>
                            <button onClick={(e) => submit(e)} className="btn btn-primary">Update</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}