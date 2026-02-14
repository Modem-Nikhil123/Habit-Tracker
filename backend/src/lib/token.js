import jwt from 'jsonwebtoken';


export const generateToken = (userId, res) => {
  
  console.log('[DEBUG] generateToken - JWT_SECRET exists:', !!process.env.JWT_SECRET);
  console.log('[DEBUG] generateToken - JWT_SECRET value:', process.env.JWT_SECRET);
  
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: '7d',
  });

  console.log('[DEBUG] generateToken - Token generated for userId:', userId);
  console.log('[DEBUG] generateToken - Token preview:', token.substring(0, 20) + '...');

  res.cookie('jwt', token, {
    httpOnly: true,
    secure: true,
    sameSite: "none", 
    maxAge: 7 * 24 * 60 * 60 * 1000, 
    path: '/', 
  });

  console.log('[DEBUG] generateToken - Cookie set with name: jwt');
  
  return token;
};


export const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    return null;
  }
};

export default { generateToken, verifyToken };
