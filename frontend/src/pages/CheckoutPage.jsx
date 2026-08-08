import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authFetch } from "../utils/auth";
import { useCart } from "../context/CartContext";

function CheakoutPage(){
    const BASEURL = import.meta.env.VITE_DJANGO_BASE_URL;
    const navigate = useNavigate();
    const {clearCart}= useCart();

    const [form, setForm] = useState({
    name: "",
    address: "",
    phone: "",
    payment_method: "COD",
  });
    const [loading,setLoading]= useState(false);
    const [message,setMessage]=useState(null);

    const handleChange =(e)=>{
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    }

    const handleSubmit = async(e)=>{
        e.preventDefault();
        setLoading(true);
        setMessage("");
        try{
            const res = await authFetch(`${BASEURL}/store/orders/create/`,{
                method:"POST",
                headers:{
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(form),
            });
            const data = await res.json();
            
            if(res.ok){
                setMessage("Order placed successfully");
                fetch(`${BASEURL}/store/cart/`)
                clearCart();
                setTimeout(() => {
                    navigate("/");
                },20000);
            }
            else{
                setMessage("An error occurred.please try again")
            }  
        } catch(error){
            setMessage("An error occurred. please try again")
        }
        

    }

    return(
        <div className="min-h-screen bg-gray-100 flex justify-center item-center p-6" >
            <div className="bg-white p-8 rounded-2xl shadow w-full max-w-md">
               <h1 className="text-2xl font-bold mb-4">Checkout</h1>

        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Your Name"
            required
            className="w-full p-2 border rounded"
          />
           <input
            name="address"
            value={form.address}
            onChange={handleChange}
            placeholder="Address"
            required
            className="w-full p-2 border rounded"
          />
          
          <input
            name="phone"
            value={form.phone}
            onChange={handleChange}
            placeholder="Phone Number"
            required
            className="w-full p-2 border rounded"
          />

          <select
            name="payment_method"
            value={form.payment_method}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          >
            <option value="COD">Cash on Delivery</option>
            <option value="ONLINE">Online Payment</option>
          </select>
          <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-600 text-white py-2 rounded hover:bg-blue-600 transition durtion-300"
          >
            {loading ? "Processing...":"Place Order"}
          </button>
          {message && (
            <p className="text-center text-green-700 font-semibold mt-4">{message}</p>
          )}
          </form>
            </div>

        </div>
    )

}
export default CheakoutPage;