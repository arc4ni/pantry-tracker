'use client'
import Image from "next/image";
import {useState, useEffect} from 'react';
import {firestore} from '@/firebase';
import {Box, Modal, Typography, Stack, TextField, Button} from "@mui/material";
import {collection, deleteDoc, doc, getDoc, getDocs, setDoc, query} from "firebase/firestore";
import { styled } from "@mui/system";

// Custom Button with Glow Effect
const GlowingButton = styled(Button)({
  borderRadius: '10px',
  textTransform: 'none',
  transition: '0.3s ease-in-out',
  '&:hover': {
    boxShadow: '0 0 10px #ffffff, 0 0 20px #ffffff, 0 0 30px #ffffff',
  },
});

// Rounded Box
const RoundedBox = styled(Box)({
  borderRadius: '12px',
  overflow: 'hidden',
});

// Custom Typography with new Font
const CustomTypography = styled(Typography)({
  fontFamily: 'Garamond, sans-serif',
});

export default function Home() {
  const [inventory, setInventory] = useState([]);
  const [open, setOpen] = useState(false);
  const [itemName, setItemName] = useState('');

  const updateInventory = async () => {
    const snapshot = query(collection(firestore, 'inventory'));
    const docs = await getDocs(snapshot);
    const inventoryList = [];
    docs.forEach((doc) => {
      inventoryList.push({
        name: doc.id,
        ...doc.data(),
      });
    });
    setInventory(inventoryList);
  };

  const addItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      await setDoc(docRef, { quantity: quantity + 1 });
    } else {
      await setDoc(docRef, { quantity: 1 });
    }

    await updateInventory();
  };

  const removeItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      if (quantity === 1) {
        await deleteDoc(docRef);
      } else {
        await setDoc(docRef, { quantity: quantity - 1 });
      }
    }

    await updateInventory();
  };

  useEffect(() => {
    updateInventory();
  }, []);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <Box 
      width="100vw" 
      height="100vh" 
      display="flex" 
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      gap={2}
      sx={{
        backgroundImage: 'url(/background.jpg)',
        backgroundColor: '#f0f8ff', 
        backgroundSize: 'cover', 
        backgroundPosition: 'center',
      }}
    >
      <Modal open={open} onClose={handleClose}>
        <RoundedBox
          position="absolute"
          top="50%"
          left="50%"
          width={400}
          bgcolor="white"
          border="2px solid #000"
          boxShadow={24}
          p={4}
          display="flex"
          flexDirection="column"
          gap={3}
          sx={{
            transform: "translate(-50%,-50%)"
          }}
        >
          <CustomTypography variant="h6">Add Item</CustomTypography>
          <Stack width="100%" direction="row" spacing={2}>
            <TextField
              variant="filled"
              fullWidth
              value={itemName}
              onChange={(e) => {
                setItemName(e.target.value);
              }}
            />
            <GlowingButton 
              variant="outlined"
              onClick={() => {
                addItem(itemName);
                setItemName('');
                handleClose();
              }}
            >
              Add
            </GlowingButton>
          </Stack>
        </RoundedBox>
      </Modal>
      <GlowingButton variant="contained" onClick={() => handleOpen()}>
        Add New Item
      </GlowingButton>
      <RoundedBox 
        border="1px solid #ddd" 
        width="800px" 
        bgcolor="#ffffff"
        boxShadow="0 4px 20px rgba(0, 0, 0, 0.1)"
        p={2}
      >
        <Box 
          height="100px"
          display="flex" 
          alignItems="center" 
          justifyContent="center"
        >
          <CustomTypography variant="h2" color="black">Pantry Items</CustomTypography>
        </Box>
        <Stack 
          width="100%" 
          height="300px" 
          spacing={2} 
          overflow="auto" 
          padding={2}
          sx={{
            '&::-webkit-scrollbar': {
              width: '6px',
            },
            '&::-webkit-scrollbar-track': {
              background: '#f0f8ff',
              borderRadius: '8px',
            },
            '&::-webkit-scrollbar-thumb': {
              background: '#888',
              borderRadius: '8px',
              transition: 'background 0.3s ease',
            },
            '&::-webkit-scrollbar-thumb:hover': {
              background: '#555',
            },
          }}
        >
          {inventory.map(({ name, quantity }) => (
            <RoundedBox 
            key={name}
            width="100%"
            minHeight="100px"
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            padding={3}
            sx={{
              backgroundColor: '#F5F5DC',
              boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)',
              transition: 'transform 0.2s',
              '&:hover': {
                transform: 'scale(1.02)', // Slightly scale on hover
              },
            }}
          >
            <CustomTypography
              variant="h5"
              color="#333"
              textAlign="center"
              sx={{ flexGrow: 0, marginRight: 'auto' }}
            >
              {name.charAt(0).toUpperCase() + name.slice(1)}
            </CustomTypography>
            <Stack
              direction="row"
              alignItems="center"
              spacing={2}
              sx={{ flexGrow: 0 }}
            >
              <CustomTypography
                variant="h5"
                color="#333"
                textAlign="center"
                sx={{ width: '50px' }}
              >
                {quantity}
              </CustomTypography>
              <GlowingButton variant="contained" onClick={() => addItem(name)}>
                Add
              </GlowingButton>
              <GlowingButton variant="contained" onClick={() => removeItem(name)}>
                Remove
              </GlowingButton>
            </Stack>
          </RoundedBox>          
          ))}
        </Stack>
      </RoundedBox>
    </Box>
  );
}
