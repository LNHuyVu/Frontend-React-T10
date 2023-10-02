import axios from "axios";
import jwt_decode from "jwt-decode"
const refreshToken =async()=>{
    try{
      const res=await axios.post("http://localhost:8080/api/refresh",
      {
        withCredentials:true
      }
      );
      return res.data;
    }
    catch(err){
      console.log(err);
    }
  }
export const createAxiosRefreshJWT=(userRD, dispatch, stateSuccess)=>{
    let refreshAxiosJWT=axios.create({baseURL: 'http://localhost:8080/api'}
      );
    refreshAxiosJWT.interceptors.request.use(
    async(config)=>{
      let date=new Date();
      const decodedToken=jwt_decode(userRD?.accessToken);
      if(decodedToken.exp<date.getTime()/1000)
      {
        const data=await refreshToken();
        const refreshUser={
          ...userRD,
          accessToken: data.accessToken,
        };
        dispatch(stateSuccess(refreshUser));
        config.headers["token"]="Bearer "+data.accessToken;
      }
      return config;
    },
    (err)=>{
      return Promise.reject(err);
    }
  );
  return refreshAxiosJWT;
}