import { db } from './data/db'
import { Routes, Route, useNavigate } from "react-router-dom";
import AuthPage from './components/Auth';
import { useEffect } from 'react';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import NavAndSide from './components/NavAndSide';
import Educational from './components/Educational';
import SubscribeEducational from './components/SubscribeEducational';
import SearchHalaqa from './components/Search';
import DetailsHalaqa from './components/DetailsHalaqa';
import OrderList from './components/OrderList';
import DetailsStudent from './components/DetailsStudent';

export default function App() {
  const navigate = useNavigate()
  const isAuthenticated = db.authStore.isValid;
  useEffect(() => {
    if(!isAuthenticated){
      navigate('/auth')
    }
  }, [isAuthenticated, navigate])

  return (
    <div className='w-full h-screen'>
      <ToastContainer position="top-right" autoClose={1500} />
      <Routes>
        <Route path="/" element={<NavAndSide />} >
          {db.authStore.model?.collectionName === "teachers" ? 
            <>
              <Route path="/" element={<Educational />} />
              <Route path="/halaqa/:name" element={<DetailsHalaqa />} />
              <Route path="/halaqa/:name/قائمة الطلبات" element={<OrderList />} />
              <Route path="/halaqa/:name/:student" element={<DetailsStudent />} />
            </>
            : 
            <>
              <Route path="/" element={<SubscribeEducational />} />
              <Route path="/search" element={<SearchHalaqa />} />
              <Route path="/halaqa/:name" element={<DetailsStudent />} />
            </>
          }
        </Route>
        <Route path="/auth" element={<AuthPage />} />
      </Routes>
    </div>
  )
}

