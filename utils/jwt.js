import jwt from "jsonwebtoken";

const createJWT = ({ payload }) => {

  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_LIFETIME,
  });
  return token;
};



const isTokenValid = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET)
  }catch(e){
    throw new Error("invalid token") ;
  }
}
  

const attachCookiesToResponse = (res, user) => {
  const token = createJWT({ payload: user });
  return token ;
};


export  {
  createJWT,
  isTokenValid,
  attachCookiesToResponse,
};