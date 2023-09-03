import { useCallback, useEffect, useState } from "react";
import { Calendar } from "./components/calendar";

function App() {
  const [value, setValue] = useState(new Date())

  const onChange = useCallback((date: Date) => {
    setValue(date)
  }, [])

  return (
    <div className="App">
      {value.toLocaleDateString()}
      <Calendar onChange={onChange} />
    </div>
  );
}

export default App;
