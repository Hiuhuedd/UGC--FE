function doGet(e) {
  return HtmlService.createHtmlOutputFromFile('index');
}

function doPost(e) {
  try {
    const query = e.parameter.query;

    if (!query) {
      return ContentService.createTextOutput(JSON.stringify({ error: 'No keyword provided. Please enter a keyword or URL.' })).setMimeType(ContentService.MimeType.JSON);
    }

    // Twitter API Bearer Token
    const BEARER_TOKEN = 'AAAAAAAAAAAAAAAAAAAAADW3xAEAAAAAqwlI2ODriyeSs6Vn9COgymSn9ik%3DMXnrRBNFm7BNXdzoWy1pQH1ptrpWUJUeOx9qtLjcg2s0ojDviG';

    // Twitter API URL
    const url = `https://api.twitter.com/2/tweets/search/recent?query=${encodeURIComponent(query)}&tweet.fields=created_at,author_id,text&max_results=10`;

    const options = {
      method: 'get',
      headers: {
        Authorization: `Bearer ${BEARER_TOKEN}`,
      },
      muteHttpExceptions: true,
    };

    // Fetch data from Twitter API
    const response = UrlFetchApp.fetch(url, options);

    if (response.getResponseCode() !== 200) {
      console.error('Error fetching tweets:', response.getContentText());
      return ContentService.createTextOutput(JSON.stringify({ error: 'Error fetching tweets.' })).setMimeType(ContentService.MimeType.JSON);
    }

    const data = JSON.parse(response.getContentText());
    const tweets = data.data;

    if (!tweets || tweets.length === 0) {
      return ContentService.createTextOutput(JSON.stringify({ error: 'No tweets found for the given query.' })).setMimeType(ContentService.MimeType.JSON);
    }

    // Process tweets into a blog post
    const blogContent = tweets
      .map(
        (tweet) =>
          `"<b>${tweet.text}</b>"<br><i>— Author ID: ${tweet.author_id}, Date: ${tweet.created_at}</i>`
      )
      .join('<br><br>');

    return ContentService.createTextOutput(JSON.stringify({ content: blogContent })).setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    console.error('Error in doPost:', error);
    return ContentService.createTextOutput(JSON.stringify({ error: 'Error processing your request.' })).setMimeType(ContentService.MimeType.JSON);
  }
}
