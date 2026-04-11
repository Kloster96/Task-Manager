import React, { useContext, useState } from 'react';
import AuthLayout from '../../components/layouts/AuthLayout';
import { useNavigate, Link } from 'react-router-dom';
import Input from '../../components/Inputs/Input';
import { validateEmail } from '../../utils/helper';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import { UserContext } from '../../context/userContext';

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const { updateUser } = useContext(UserContext);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      setError("Por favor ingrese un email válido.");
      return;
    }

    if (!password) {
      setError("Por favor ingrese la contraseña.");
      return;
    }

    if (password.length < 8) {
      setError("La contraseña debe tener al menos 8 caracteres.");
      return;
    }

    setError("");
// Login Api call
    try {
      const response = await axiosInstance.post(API_PATHS.AUTH.LOGIN, {
        email,
        password,
      });

      const { token, role } = response.data;

      if (token) {
        localStorage.setItem("token", token);
        updateUser(response.data);

        if (role === "admin") {
          navigate("/admin/dashboard");
        } else {
          navigate("/user/dashboard");
        }
      }
    } catch (error){
      console.log("Error de login:", error);
      if(error.response && error.response.data.message) {
        setError(error.response.data.message);
      } else {
        setError("Algo ha ido mal. Por favor, intentelo de nuevo.")
      }
    }
  };

  return (
    <AuthLayout>
      <div className="lg:w-[70%] h-3/4 md:h-full flex flex-col justify-center">
        <h3 className="text-xl font-semibold text-black">Welcome Back</h3>
        <p className="text-sm text-slate-700 mt-[5px] mb-6">
          Please enter your details to log in 
        </p>

        <form onSubmit={handleLogin}>
          <Input
            value={email}
            onChange={({ target }) => {
              setEmail(target.value);
              setError(null);
            }}
            label="Email Address"
            placeholder="Ingrese su Email"
            type="text"
          />
          <Input
            value={password}
            onChange={({ target }) => {
              setPassword(target.value);
              setError(null);
            }}
            label="Password"
            placeholder="Ingrese su password"
            type="password"
          />
          {error && <p className='text-red-600 text-xs pb-2.5'>{error}</p>}
          
          <button type='submit' className='btn-primary'>
            Inicia Sesion
          </button>

          <p className='text-[13px] text-slate-800 mt-3'>
            No tiene cuenta?{" "}
            <Link className="font-medium text-primary underline" to="/signup">
              Registrate
            </Link>
          </p>
        </form>
      </div>
    </AuthLayout>
  );
};

export default Login;