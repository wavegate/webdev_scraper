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
            <div style={{ marginTop: "30px", padding: "30px" }}>
              <a href={result.jobLink} style={{ color: "blue" }}>
                {result.jobLink}
              </a>
              <div
                dangerouslySetInnerHTML={{
                  __html: result.jobDescription.replace(/\n/g, "<br/>"),
                }}
              ></div>
            </div>
          );
        })}
    </div>
  );
}

export default App;
