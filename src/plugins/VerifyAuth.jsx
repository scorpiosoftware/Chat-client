import {React,useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
const RequireAuth = ({ children }) => {
    const token = sessionStorage.getItem("token");
    const navigate = useNavigate();
    
    useEffect(() => {
      if (!token) navigate("/login");
    }, [token, navigate]);
    
    return token ? children : null;
  };

export default RequireAuth;