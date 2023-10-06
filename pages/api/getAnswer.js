import fuse from './qaBank.js'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).end();
  }

  const { question } = req.body;
  if (!question) {
    return res.status(400).json({ error: 'Question is required' });
  }

  // Use Fuse.js to search the QA bank
  const result = fuse.search(question);
  console.log('question is', question)
  console.log('fuse is', fuse)
  if (result.length > 0 && result[0].score <= 0.7) { // Adjust the score threshold as needed
    return res.status(200).json({ answer: result[0].item.answer });
  }

  console.log('result is', result)

  try {
    const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`

      },
      body: JSON.stringify({
        model: "gpt-4",
        messages: [{ role: 'user', content: question}]
      })
    });

    if (!openaiResponse.ok) {
      console.error('OpenAI API Error:', await openaiResponse.text());
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    const openaiData = await openaiResponse.json();
    if (!openaiData.choices || !openaiData.choices[0] || !openaiData.choices[0].message || typeof openaiData.choices[0].message.content !== 'string') {
      console.error('Unexpected OpenAI API Response:', openaiData);
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    const answer = openaiData.choices[0].message.content.trim();
    return res.status(200).json({ answer });

  } catch (error) {
    console.error('Error while fetching answer from OpenAI:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}