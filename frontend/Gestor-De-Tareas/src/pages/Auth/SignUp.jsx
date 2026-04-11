import axiosInstance from '../../utils/axiosInstance';
import React, { useState, useContext } from 'react';
import AuthLayout from '../../components/layouts/AuthLayout'
import ProfilePhotosSelector from '../../components/Inputs/ProfilePhotosSelector';
import { validateEmail } from '../../utils/helper';
import Input from '../../components/Inputs/Input';
import { Link, useNavigate } from 'react-router-dom';
import { API_PATHS } from '../../utils/apiPaths';
import { UserContext } from '../../context/userContext';
import updloadImage from '../../utils/uploadImage';


const SignUp = () => {
  const [ profilePic, setProfilePic ] = useState(null);
  const [ fullName, setFullName ] = useState("");
  const [ email, setEmail ] = useState("");
  const [ password, setPassword ] = useState("");
  const [ adminInviteToken, setAdminInviteToken ] = useState("");

  const { updateUser } = useContext(UserContext);

  const navigate = useNavigate();
  const [ error, setError ] = useState(null);

    const handleSignUp = async (e) => {
      e.preventDefault();

      let profileImageUrl = "";
  
      if (!fullName) {
        setError("Por favor ingrese un nombre completo para validarlo.");
        return;
      }

        
      if (!validateEmail(email)) {
        setError("Por favor ingrese un email valido.");
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
      // API call
      try {
        // cargar imagen
        if (profilePic) {
          const imgUploadRes = await updloadImage(profilePic);
          profileImageUrl = imgUploadRes?.imageUrl || "";
        }

        const response = await axiosInstance.post(API_PATHS.AUTH.REGISTER, {
          name: fullName,
          email,
          password,
          profileImageUrl,
          adminInviteToken,
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
      <div className="lg:w-[100%] h-auto md:h-full mt-10 md:mt-0 flex flex-col justify-center">
        <h3 className="text-xl font-semibold text-black">Crear Cuenta</h3>
        <p className="text-xs text-slate-700 mt-[5px] mb-6">Unase a nostros hoy mismo introduciendo sus datos a continuar.</p>
        <form onSubmit={handleSignUp}> 
        <ProfilePhotosSelector image={profilePic} setImage={setProfilePic} />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            value={fullName}
            onChange={({ target }) => setFullName(target.value)}
            label="Nombre completo"
            placeholder='Ejemplo: Luciano kloster'
            type="text"
          />
                    <Input
            value={email}
            onChange={({ target }) => {
              setEmail(target.value);
              setError(null);
            }}
            label="Email Address"
            placeholder="Ejemplo: luciano@gmail.com"
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

          <Input
            value={adminInviteToken}
            onChange={({ target }) => {
              setAdminInviteToken(target.value);
              setError(null);
            }}
            label="Token Administrador"
            placeholder="6 digitos"
            type="text"
          />
        </div>
          {error && <p className='text-red-600 text-xs pb-2.5'>{error}</p>}
           <button type='submit' className='btn-primary'>
            Registrate
          </button>
                    <p className='text-[13px] text-slate-800 mt-3'>
            Tienes cuenta ? {" "}
            <Link className="font-medium text-primary underline" to="/login">
              Login
            </Link>
          </p>
        </form>
      </div>
    </AuthLayout>
  )
}

export default SignUp