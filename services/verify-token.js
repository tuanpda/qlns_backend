// const jwt = require("jsonwebtoken");

// module.exports = function (req, res, next) {
//   let token = req.headers["x-access-token"] || req.headers["authorization"];
//   let checkBearer = "Bearer ";

//   if (token) {
//     if (token.startsWith(checkBearer)) {
//       token = token.slice(checkBearer.length, token.length);
//     }

//     //console.log(token);

//     jwt.verify(token, process.env.SECRET, (err, decoded) => {
//       if (err) {
//         // console.log("wrong");
//         res.json({
//           success: false,
//           message: "Failed to authenticate",
//         });
//       } else {
//         req.decoded = decoded;
//         next();
//         //console.log(decoded);
//       }
//     });
//   } else {
//     res.json({
//       success: false,
//       message: "No way to access !",
//     });
//   }
// };


const jwt = require("jsonwebtoken");

function verifyToken(req, res, next) {
  // console.log("verifying token");
  // console.log(req.cookies);
  // console.log(process.env.SECRET);

  const token = req.cookies.token;
  if (!token) return res.status(401).json({ message: "No token provided" });

  try {
    const decoded = jwt.verify(token, process.env.SECRET);
    req.user = decoded;
    // console.log(decoded);

    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
}

module.exports = verifyToken;
