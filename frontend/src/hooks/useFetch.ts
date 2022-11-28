import axios from "axios";
import { useState } from "react";
import { API_URL } from "../utils/constants";

const useFetch = () => {
  const [loading, setLoading] = useState<boolean>();
  const [error, setError] = useState<string>();
  const [data, setData] = useState<any>();

  const fetchData = async (endpoint: string) => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}${endpoint}`);
      setData(response.data);
      setLoading(false);
    } catch (error) {
      setError(JSON.stringify(error));
      setLoading(false);
    }
  };

  return { data, error, loading, fetchData };
};

export default useFetch;
