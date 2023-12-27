import { Button } from "./components/ui/button";
import { Link, useLocation } from "react-router-dom";
import { getGoogleUrl } from "./utils/get-google-url";

function App() {
  const location = useLocation();
  const from = location.pathname;

  return (
    <div>
      <Link to={getGoogleUrl(from)}>
        <Button>Continue with dooglle</Button>
      </Link>
      <pre>{from}</pre>
    </div>
  );
}

export default App;
