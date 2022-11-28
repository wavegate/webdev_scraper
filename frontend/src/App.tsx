import { useEffect } from "react";
import useFetch from "./hooks/useFetch";

function App() {
  const { data, error, loading, fetchData } = useFetch();

  useEffect(() => {
    fetchData("data");
  }, []);

  return (
    <div>
      <h1>Web Dev Scraper</h1>
      <p>What does this app do? It scrapes the web for web dev job info.</p>

      {/* {JSON.stringify(data)} */}
      {data &&
        data.data.map((result: any) => {
          return (
            <div>
              <a href={result.jobLink}>{result.jobTitle}</a>
              <div>{result.companyName}</div>
              <div>{result.companyLocation}</div>
            </div>
          );
        })}
    </div>
  );
}

export default App;
