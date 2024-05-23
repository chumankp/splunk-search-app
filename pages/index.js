import { useState } from 'react';
import axios from 'axios';
import HighlightComponent from '../components/HighlightComponent';


export default function Home() {

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [language, setLanguage] = useState('json'); // default language


  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/search');
      const contentType = response.headers['content-type'];
      setData(response.data);

      if (contentType.includes('application/json')) {
        setLanguage('json');
      } else if (contentType.includes('application/xml') || contentType.includes('text/xml')) {
        setLanguage('xml');
      } else if (contentType.includes('text/html')) {
        setLanguage('html');
      } else {
        setLanguage('plaintext');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '2em' }}>
      <h1>Splunk Data</h1>
      <button onClick={fetchData} disabled={loading} style={{ marginBottom: '1em' }}>
        {loading ? 'Loading...' : 'Fetch Data'}
      </button>
      {data && <HighlightComponent data={data} language={language} />}
    </div>
  );

}
