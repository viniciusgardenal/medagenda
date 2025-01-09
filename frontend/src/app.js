import "./app.css";
import Sidebar from "./components/sidebar/sidebar";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import PrivateRoute from "./components/privateRoutes/privateRoute";
import routes from "./components/routes/routesConfig";

function App() {
  const location = useLocation();
  const showSidebar = location.pathname !== "/";

  return (
    <div className="app-container flex">
      {showSidebar && <Sidebar />}
      <div className="content-container flex-grow ">
        <Routes>
          {routes.map((route, index) => {
            // Verifica o que está sendo passado para cada rota
            // //console.log("Route data:", route);

            return route.protected ? (
              <Route
                key={index}
                path={route.path}
                element={
                  <PrivateRoute requiredPermissao={route.permissao} rolesPermissao={route.rolesPermitidos}>
                    {route.element} {/* Passa o elemento da rota */}
                  </PrivateRoute>
                }
              />
            ) : (
              <Route key={index} path={route.path} element={route.element} />
            );
          })}
        </Routes>
      </div>
    </div>
  );
}

export default function AppWrapper() {
  return (
    <Router>
      <App />
    </Router>
  );
}
