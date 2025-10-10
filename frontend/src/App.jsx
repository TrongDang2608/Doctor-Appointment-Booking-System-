import { useState, useEffect } from 'react'
import axios from 'axios'

function App() {
  const [message, setMessage] = useState("Dang tai...");

  useEffect(() => {
    axios.get('/api/v1/hello')
      .then(response => {
        setMessage(response.data);
      })
      .catch(error => {
        console.error("Loi khi goi API!", error);
        setMessage("Khong the ket noi den backend.");
      });
  }, []);

  return (
    <div>
      <h1>Trang Thai Ket Noi</h1>
      <p>Thong diep tu Backend: <strong>{message}</strong></p>
    </div>
  )
}

export default App