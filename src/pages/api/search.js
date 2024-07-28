import { DynamoDBClient, GetItemCommand } from '@aws-sdk/client-dynamodb';
import { marshall, unmarshall } from '@aws-sdk/util-dynamodb';

const client = new DynamoDBClient({ region: process.env.AWS_REGION });

export default async function handler(req, res) {
  const { email, name } = req.query;

  try {
    const params = {
      TableName: 'WorkDemand',
      Key: marshall({ id: email }),
    };
    
    const command = new GetItemCommand(params);
    const data = await client.send(command);
    
    if (data.Item) {
      res.status(200).json({ exists: true });
    } else {
      res.status(200).json({ exists: false });
    }
  } catch (error) {
    console.error('Error searching user:', error);
    res.status(500).json({ error: 'Error searching user' });
  }
}
