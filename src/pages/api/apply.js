import { DynamoDBClient, PutItemCommand } from '@aws-sdk/client-dynamodb';
import { marshall } from '@aws-sdk/util-dynamodb';

const client = new DynamoDBClient({ region: process.env.AWS_REGION });

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { id, name, RefP } = req.body;

    try {
      const params = {
        TableName: 'WorkDemand',
        Item: marshall({ id, name, RefP }),
      };

      const command = new PutItemCommand(params);
      await client.send(command);

      res.status(200).json({ message: 'Application submitted successfully' });
    } catch (error) {
      console.error('Error submitting application:', error);
      res.status(500).json({ error: 'Error submitting application' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
