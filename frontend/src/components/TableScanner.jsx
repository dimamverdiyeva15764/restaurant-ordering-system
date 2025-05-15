import React, { useEffect, useRef, useState } from 'react';
import QrScanner from 'qr-scanner';
import { Box, Typography, Button, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const TableScanner = () => {
  const [error, setError] = useState(null);
  const videoRef = useRef(null);
  const [qrScanner, setQrScanner] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (videoRef.current && !qrScanner) {
      const scanner = new QrScanner(
        videoRef.current,
        (result) => {
          try {
            const tableData = JSON.parse(result.data);
            if (tableData.tableId) {
              localStorage.setItem('tableId', tableData.tableId);
              navigate('/menu');
            }
          } catch (err) {
            setError('Invalid QR code format');
          }
        },
        {
          highlightScanRegion: true,
          highlightCodeOutline: true,
        }
      );

      setQrScanner(scanner);
      scanner.start().catch((err) => {
        setError('Failed to start camera: ' + err.message);
      });

      return () => {
        scanner.destroy();
      };
    }
  }, [navigate]);

  const handleManualEntry = () => {
    const tableId = prompt('Please enter your table number:');
    if (tableId) {
      localStorage.setItem('tableId', tableId);
      navigate('/menu');
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        p: 3,
        gap: 2,
      }}
    >
      <Typography variant="h4" gutterBottom>
        Scan Table QR Code
      </Typography>

      <Paper
        elevation={3}
        sx={{
          width: '100%',
          maxWidth: 500,
          height: 400,
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        <video ref={videoRef} style={{ width: '100%', height: '100%' }} />
      </Paper>

      {error && (
        <Typography color="error" variant="body1">
          {error}
        </Typography>
      )}

      <Button variant="contained" color="primary" onClick={handleManualEntry}>
        Enter Table Number Manually
      </Button>
    </Box>
  );
};

export default TableScanner; 