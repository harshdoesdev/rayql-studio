import { useEffect, useState } from "react";
import Header from "./Header";
import MainContainer from "./MainContainer";
import init from "../lib/rayql/rayql_wasm.js";

function App() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    init().then(() => setLoading(false)).catch(e => setError(e));
  }, []);

  if(loading) {
    return <div>Loading...</div>;
  }

  if(error) {
    return (
      <div className="text-lg text-red-600">WASM Error: {error.message}</div>
    )
  }

  return (
    <div className="flex h-screen w-full flex-col">
      <Header />
      <MainContainer />
    </div>
  );
}

export default App;
