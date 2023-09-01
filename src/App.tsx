import { useEffect, useState } from "react";
import { Calendar } from "./components/calendar";

function App() {
  const [value, setValue] = useState(new Date())
  useEffect(() => {
    const timer = setTimeout(() => {
      setValue(new Date('2023-10-01'))
    }, 3000)
    return () => {
      clearTimeout(timer)
    }
  }, [])
  return (
    <div className="App">
      <Calendar dafaultValue={value} />
    </div>
  );
}

export default App;
