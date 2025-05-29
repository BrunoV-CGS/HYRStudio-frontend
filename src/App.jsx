import "./App.css";
import {Route, Routes} from "react-router-dom";
import SignInForm from "./views/SignInForm";
import MainDashboard from "./views/MainDashboard";
import Loader from "./components/Loader";
import { CompanySelection } from "./views/CompanySelection";

function App() {
  return (
    <div className='w-full'>
      <Loader />
      <Routes>
        <Route path='/' element={<SignInForm />} />
        <Route path='/signin' element={<SignInForm />} />
        <Route path='/dashboard/:id' element={<MainDashboard />} />
        <Route path='/company-selection/:id' element={<CompanySelection />} />
      </Routes>
    </div>
  );
}

export default App;
