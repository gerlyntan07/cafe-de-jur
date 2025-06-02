import axios from "./AxiosConfig.js";
import { useNavigate } from "react-router-dom";
import Header from '../components/Header';

const UseLogout = () => {
    const navigate = useNavigate();
    const logout = async() => {
        try{
            const res = await axios.post('/logout');
            if(res.data.valid){
                console.log("Logout successful");
                navigate('/');
                window.location.reload();
            } else if(res.data.message === "No active session.") {
                console.log("Logout failed:", res.data.message);
            }
        } catch(err) {
            console.error("Logout error:", err.response?.data || err.message);
        }
    }

    return logout;
}

export default UseLogout