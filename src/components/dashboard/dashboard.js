import { isEmpty } from "lodash";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
// import { getLocalStorage } from "../../utils/getToken";
import { useSelector } from "react-redux";
import { forOwn } from "lodash";

function Dashboard(props) {
  const navigate = useNavigate();

  // const [localState, setLocalState] = useState(0);

  const authState = useSelector((state) => {
    return state.auth;
  });

  useEffect(() => {
    document.title = props.title;
  }, [props.title]);

  useEffect(() => {
    if (!authState.isLoggedIn) {
      navigate("/", { state: { redirected: true } });
    }
    return () => {};
  }, [authState.isLoggedIn, navigate]);

  return (
    <div>
      <h1> welcome to dashboard</h1>
    </div>
  );
}

export default Dashboard;
