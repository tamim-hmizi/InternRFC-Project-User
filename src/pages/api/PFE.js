import { DynamoDB } from "aws-sdk";

const dynamoDB = new DynamoDB.DocumentClient();

export default async function handler(req, res) {
  const { Domaine } = req.query;

  console.log('Received Domaine:', Domaine);

  const params = {
    TableName: 'PFEProjects',
    FilterExpression: 'Domaine = :Domaine',
    ExpressionAttributeValues: {
      ':Domaine': Domaine,
    },
  };

  console.log('DynamoDB scan params:', params);

  try {
    const data = await dynamoDB.scan(params).promise();
    console.log('DynamoDB scan result:', data);
    res.status(200).json(data.Items);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Error fetching data' });
  }
}
