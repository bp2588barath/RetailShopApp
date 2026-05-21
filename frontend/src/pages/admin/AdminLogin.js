import React,{
  useState
} from "react";

import axios from "axios";

import { useNavigate } from
"react-router-dom";

export default function AdminLogin(){

  const navigate = useNavigate();

  const [formData,setFormData] =
    useState({

      email:"",
      password:""

    });

  const handleChange = (e) => {

    setFormData({

      ...formData,

      [e.target.name]:
      e.target.value

    });

  };

  const login = async() => {

    try{

      const res = await axios.post(

        "http://localhost:5000/api/auth/login",

        formData

      );

      localStorage.setItem(

        "token",

        res.data.token

      );

      localStorage.setItem(

        "user",

        JSON.stringify(res.data.user)

      );

      navigate("/admin");

    }catch(err){

      alert("Login Failed");

    }

  };

  return(

    <div
      style={{
        display:"flex",
        justifyContent:"center",
        alignItems:"center",
        height:"100vh",
        background:"#f3f4f6"
      }}
    >

      <div
        style={{
          background:"white",
          padding:"40px",
          borderRadius:"15px",
          width:"400px"
        }}
      >

        <h1>Admin Login</h1>

        <input
          type="email"
          name="email"
          placeholder="Email"
          onChange={handleChange}
          style={{
            width:"100%",
            padding:"12px",
            marginTop:"20px"
          }}
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
          style={{
            width:"100%",
            padding:"12px",
            marginTop:"20px"
          }}
        />

        <button
          onClick={login}
          style={{
            width:"100%",
            padding:"14px",
            marginTop:"20px",
            background:"#2563eb",
            color:"white",
            border:"none"
          }}
        >

          Login

        </button>

      </div>

    </div>

  );

}