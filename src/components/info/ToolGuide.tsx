import React from 'react';
import {
  Box,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import {
  ExpandMore,
  Description,
  LocationOn,
  Timeline,
  Warning,
  Info,
  CloudUpload,
} from '@mui/icons-material';

const ToolGuide: React.FC = () => {
  return (
    <Paper sx={{ p: 3, maxWidth: 800, margin: '0 auto' }}>
      <Typography variant="h4" gutterBottom>
        Manual J Calculator Guide
      </Typography>

      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMore />}>
          <Typography variant="h6">
            <Info sx={{ mr: 1, verticalAlign: 'middle' }} />
            Purpose and Overview
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography paragraph>
            The Manual J Calculator is a tool designed to analyze PDF floor plans and automatically
            calculate heating and cooling loads for residential buildings. It streamlines the HVAC
            sizing process by extracting relevant information from your plans and applying industry-standard
            calculations.
          </Typography>
        </AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary expandIcon={<ExpandMore />}>
          <Typography variant="h6">
            <Description sx={{ mr: 1, verticalAlign: 'middle' }} />
            File Requirements
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <List>
            <ListItem>
              <ListItemIcon>
                <CloudUpload />
              </ListItemIcon>
              <ListItemText 
                primary="PDF Format"
                secondary="Upload architectural floor plans in PDF format. The file should be clear and readable."
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <Info />
              </ListItemIcon>
              <ListItemText 
                primary="File Content"
                secondary="Plans should include dimensions, window locations, wall types, and room labels."
              />
            </ListItem>
          </List>
        </AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary expandIcon={<ExpandMore />}>
          <Typography variant="h6">
            <Timeline sx={{ mr: 1, verticalAlign: 'middle' }} />
            Processing Steps
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <List>
            <ListItem>
              <ListItemText 
                primary="1. PDF Upload (1-2 minutes)"
                secondary="Initial file upload and validation"
              />
            </ListItem>
            <ListItem>
              <ListItemText 
                primary="2. Plan Analysis (2-3 minutes)"
                secondary="Extracting dimensions and features from the plans"
              />
            </ListItem>
            <ListItem>
              <ListItemText 
                primary="3. Load Calculations (1-2 minutes)"
                secondary="Computing heating and cooling requirements"
              />
            </ListItem>
            <ListItem>
              <ListItemText 
                primary="4. Report Generation (1 minute)"
                secondary="Creating final documentation of calculations"
              />
            </ListItem>
          </List>
        </AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary expandIcon={<ExpandMore />}>
          <Typography variant="h6">
            <LocationOn sx={{ mr: 1, verticalAlign: 'middle' }} />
            Location Settings
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography paragraph>
            Enter the project location to ensure accurate climate data is used in calculations.
            You can:
          </Typography>
          <List>
            <ListItem>
              <ListItemText 
                primary="1. Enter ZIP code"
                secondary="Most precise method for US locations"
              />
            </ListItem>
            <ListItem>
              <ListItemText 
                primary="2. Enter city and state"
                secondary="Alternative method if ZIP code is unknown"
              />
            </ListItem>
          </List>
        </AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary expandIcon={<ExpandMore />}>
          <Typography variant="h6">
            <Warning sx={{ mr: 1, verticalAlign: 'middle' }} />
            Troubleshooting
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <List>
            <ListItem>
              <ListItemText 
                primary="Upload Errors"
                secondary="Ensure your PDF is not password protected and under 20MB in size"
              />
            </ListItem>
            <ListItem>
              <ListItemText 
                primary="Processing Delays"
                secondary="Large files may take longer to process. Wait at least 5 minutes before refreshing"
              />
            </ListItem>
            <ListItem>
              <ListItemText 
                primary="Incorrect Results"
                secondary="Verify that all room dimensions are clearly visible in the plans"
              />
            </ListItem>
            <ListItem>
              <ListItemText 
                primary="Location Errors"
                secondary="Double-check ZIP code accuracy or try using city/state instead"
              />
            </ListItem>
          </List>
        </AccordionDetails>
      </Accordion>

      <Box sx={{ mt: 2 }}>
        <Typography variant="body2" color="text.secondary">
          For additional support or questions, please contact our technical support team.
        </Typography>
      </Box>
    </Paper>
  );
};

export default ToolGuide;