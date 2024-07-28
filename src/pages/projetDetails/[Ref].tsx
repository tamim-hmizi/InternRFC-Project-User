import { useState, useEffect , useRef} from 'react';
import { useRouter } from 'next/router';
import { Box, Heading, Text, Button, Input, VStack, useDisclosure, List, ListItem, Flex, AlertDialog, AlertDialogBody, AlertDialogFooter, AlertDialogHeader, AlertDialogContent, AlertDialogOverlay  } from '@chakra-ui/react';
import { BeatLoader } from 'react-spinners';

const ProjectDetails = () => {
  const router = useRouter();
  const { Ref } = router.query;
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [project, setProject] = useState(null);
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const cancelRef = useRef();

  useEffect(() => {
    if (Ref) {
      const apiUrl = `/api/projet/${Ref}`;
      console.log('API URL:', apiUrl);

      fetch(apiUrl)
        .then(response => {
          console.log('API response status:', response.status);
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then(data => {
          console.log('Fetched project data:', data);
          setProject(data);
        })
        .catch(error => console.error('Error fetching project:', error));
    }
  }, [Ref]);

  const handleApplyClick = () => {
    onOpen();
  };

  const handleValidation = async () => {
    setError('');
    setIsSubmitting(true);
    try {
      // Recherche dans la table WorkDemand
      const searchUrl = `/api/search?email=${email}&name=${name}`;
      const searchResponse = await fetch(searchUrl);
      const searchData = await searchResponse.json();

      if (searchData.exists) {
        setError('Cet utilisateur a déjà postulé.');
        setIsSubmitting(false);
      } else {
        // Envoi de la nouvelle demande
        const postUrl = `/api/apply`;
        const postData = {
          id: email,
          name: name,
          RefP: project.Ref,
        };
        const postResponse = await fetch(postUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(postData),
        });
        if (!postResponse.ok) {
          throw new Error('Network response was not ok');
        }
        setIsDialogOpen(true);
        setIsSubmitting(false);
        onClose();
      }
    } catch (error) {
      console.error('Error submitting application:', error);
      setError('Une erreur est survenue lors de la soumission de votre candidature.');
      setIsSubmitting(false);
    }
  };
  const handleCloseDialog = () => {
    setIsDialogOpen(false);
  };
  return (
    <Flex p={4} bg="white" minH="100vh" alignItems="center">
      <Box p={4} bg="#e0f7fa" borderRadius="md" boxShadow="md" maxW="xl" mr={20} ml={60}>
        <Heading mb={4}>Détails du projet</Heading>
        {project ? (
          <>
            <Text mb={2}><strong>Référence du projet:</strong> #{project.Ref}</Text>
            <Text mb={2}><strong>Sujet:</strong> {project.Sujet}</Text>
            <Text mb={2}><strong>Description:</strong> {project.Description}</Text>
            <Text mb={2}><strong>Objectifs:</strong></Text>
            <List spacing={2} pl={4}>
              {project.Objectifs.map((objectif, index) => (
                <ListItem key={index}>- {objectif}</ListItem>
              ))}
            </List>
            <Text mb={2} mt={4}><strong>Prérequis:</strong></Text>
            <List spacing={2} pl={4}>
              {project.Prerequis.map((prerequi, index) => (
                <ListItem key={index}>- {prerequi}</ListItem>
              ))}
            </List>
          </>
        ) : (
          <Text>Chargement des détails du projet...</Text>
        )}
      </Box>
      <Box>
        <Button colorScheme='green' onClick={handleApplyClick} mb={4}>Appliquer pour ce projet</Button>
        {isOpen && (
          <VStack spacing={4} align="start">
            <Input
              placeholder="Mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              placeholder="Nom et prénom"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <Input placeholder="Référence projet" value={project ? project.Ref : ''} isReadOnly />
            {error && <Text color="red.500">{error}</Text>}
            <Button
              colorScheme='blue'
              onClick={handleValidation}
              isLoading={isSubmitting}
              spinner={<BeatLoader size={8} color='white' />}
            >
              Valider
            </Button>
          </VStack>
        )}
      </Box>

      <AlertDialog
        isOpen={isDialogOpen}
        leastDestructiveRef={cancelRef}
        onClose={handleCloseDialog}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Candidature soumise
            </AlertDialogHeader>

            <AlertDialogBody>
              Votre candidature a été soumise avec succès. Veuillez attendre un mail de confirmation pour un entretien.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={handleCloseDialog}>
                Fermer
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Flex>
  );
};

export default ProjectDetails;
