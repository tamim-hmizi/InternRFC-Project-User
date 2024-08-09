import { DynamoDB } from "aws-sdk";
import type { NextApiRequest, NextApiResponse } from 'next';

const dynamoDB = new DynamoDB.DocumentClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { Ref } = req.query;

  console.log('Received Ref:', Ref);

  const params = {
    TableName: 'PFEProjects',
    Key: {
      Ref: typeof Ref === 'string' ? decodeURIComponent(Ref) : '',
    },
  };

  console.log('DynamoDB get params:', params);

  try {
    const data = await dynamoDB.get(params).promise();
    console.log('DynamoDB get result:', data);
    if (!data.Item) {
      console.log('No data found for Ref:', Ref);
    }
    res.status(200).json(data.Item);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Error fetching data' });
  }
}
