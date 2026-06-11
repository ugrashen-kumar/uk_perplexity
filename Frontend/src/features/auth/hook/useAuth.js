import { useDispatch } from "react-redux";
import { register, login, getMe } from "../service/auth.api.js";
import { setUser, setLoading, setError } from "../auth.slice.js";

const useAuth = () => {
  const dispatch = useDispatch();

  const handelRegister = async (registerData) => {
    try {
      dispatch(setLoading(true));
      const data = await register(registerData);
    } catch (error) {
      dispatch(
        setError(error.response?.data?.message || "Registration failed"),
      );
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handelLogin = async (loginData) => {
    try {
      dispatch(setLoading(true));
      const data = await login(loginData);
      dispatch(setUser(data.user));
    } catch (error) {
      // catch(error){
      //     dispatch(setError(error.response?.data?.message || "Login failed"))
      // }
      console.log("Full Error:", error);
      console.log("Response:", error.response);
      console.log("Data:", error.response?.data);

      dispatch(setError(error.response?.data?.message || "Login failed"));
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handelGetMe = async () => {
    try {
      dispatch(setLoading(true));
      const data = await getMe();
      dispatch(setUser(data.user));
    } catch (error) {
      dispatch(setError(error.response?.data?.message || "Data not fetched"));
    } finally {
      dispatch(setLoading(false));
    }
  };

  return {
    handelRegister,
    handelLogin,
    handelGetMe,
  };
};

export default useAuth;
