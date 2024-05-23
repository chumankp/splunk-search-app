import axios from 'axios';

export default async function handler(req, res) {
  const splunkHost = 'localhost';
  const username = 'chuman';
  const password = 'Chuman123';
  const searchQuery = 'search index=springboot_aws_s3 earliest=-1h';

  try {
    // Create search job
    const searchResponse = await axios.post(
      `https://${splunkHost}:8089/services/search/v2/jobs`,
      new URLSearchParams({ search: searchQuery,
        output_mode: 'json',
       }),
      {
        auth: { username, password },
        httpsAgent: new (require('https').Agent)({ rejectUnauthorized: false }),
        headers: { 'Content-Type': 'application/json' },
      }
    );

    const sid = searchResponse.data.sid;


    //check job status
    let isDone = false;
    while (!isDone) {
      const jobStatusResponse = await axios.get(
        `https://${splunkHost}:8089/services/search/v2/jobs/${sid}`, {
        auth: { username, password },
        httpsAgent: new (require('https').Agent)({ rejectUnauthorized: false }),
        params: {
          output_mode: 'json',
        },
      });
      isDone = jobStatusResponse.data.entry[0].content.dispatchState === 'DONE';
      console.log(isDone);
      if (!isDone) {
        await new Promise(resolve => setTimeout(resolve, 2000)); // Wait 2 seconds before polling again
      }
    }
    
    
    // Retrieve search results
    const resultsResponse = await axios.get(
      `https://${splunkHost}:8089/services/search/v2/jobs/${sid}/results`,
      {
        auth: { username, password },
        params: { output_mode: 'raw',},
        httpsAgent: new (require('https').Agent)({ rejectUnauthorized: false }),
      }
    );

    const data = resultsResponse.data;

    res.status(200).json(resultsResponse.data);
  } catch (error) {
    console.error('Error fetching data from Splunk:', error);
    res.status(500).json({ error: 'Error fetching data from Splunk' });
  }
}
