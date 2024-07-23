import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

function RequireAuth({ allowedRoles }) {
  const { isLoggedIn, role } = useSelector((state) => state.auth);

  console.log("RequireAuth - isLoggedIn:", isLoggedIn);
  console.log("RequireAuth - role:", role);
  console.log("RequireAuth - allowedRoles:", allowedRoles);

  if (isLoggedIn && allowedRoles.find((myRole) => myRole == role)) {
    console.log("RequireAuth - Access granted");
    return <Outlet />;
  } else if (isLoggedIn) {
    console.log("RequireAuth - Access denied");
    return <Navigate to="/denied" />;
  } else {
    console.log("RequireAuth - Not logged in");
    return <Navigate to="/login" />;
  }
}

export default RequireAuth;
