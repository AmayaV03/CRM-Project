// LeadForm.jsx
import React, { useState, useEffect, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
} from '@mui/material';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import { useLeads } from "../../hooks/useLeads";

const LeadForm = ({ lead = null, onSubmit, onCancel }) => {
  const dialogRef = useRef(null);
  const isEdit = lead !== null;
  const { leads, updateLeadData, createLead } = useLeads();

  // Initialize select values with proper defaults
  const sourceOptions = ['website', 'referral', 'trade-show', 'other'];
  const statusOptions = ['New', 'Contacted', 'Qualified', 'Negotiation', 'Won', 'Lost'];

  const validationSchema = yup.object({
    name: yup.string().required('Name is required'),
    email: yup
      .string()
      .email('Invalid email address')
      .required('Email is required')
      .test('is-unique', 'This email is already in use', (value) => {
        return !value || !emailExists(value);
      }),
    company: yup.string().required('Company name is required'),
    source: yup.string().required('Lead source is required'),
    status: yup.string().required('Status is required'),
    assignedTo: yup.string().required('Assigned to is required'),
    dealAmount: yup
      .number()
      .typeError('Deal amount must be a number')
      .min(0, 'Deal amount cannot be negative')
      .nullable(),
    winProbability: yup
      .number()
      .typeError('Win probability must be a number')
      .min(0, 'Win probability cannot be less than 0')
      .max(100, 'Win probability cannot be more than 100')
      .nullable(),
    expectedCloseDate: yup.date()
      .nullable()
      .typeError('Please select a valid date')
      .min(new Date(), 'Expected close date cannot be in the past'),
    nextFollowupDate: yup.date()
      .nullable()
      .typeError('Please select a valid date')
      .min(new Date(), 'Follow-up date cannot be in the past'),
    notes: yup.string().nullable()
  });

  // Initialize form with useForm
  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      name: lead?.name || '',
      email: lead?.email || '',
      company: lead?.company || '',
      source: sourceOptions.includes(lead?.source) ? lead?.source : 'website',
      status: statusOptions.includes(lead?.status) ? lead?.status : 'New',
      assignedTo: lead?.assignedTo || '',
      dealAmount: lead?.dealAmount || lead?.amount || lead?.value || lead?.total || 0,
      winProbability: lead?.winProbability !== undefined ? lead.winProbability * 100 : 0, // Convert from decimal to percentage
      expectedCloseDate: lead?.expectedCloseDate || null,
      nextFollowupDate: lead?.nextFollowupDate ? format(new Date(lead?.nextFollowupDate), 'yyyy-MM-dd') : format(new Date(), 'yyyy-MM-dd'),
      notes: lead?.notes || ''
    },
    mode: 'onChange'
  });

  // Form submission handler
  const handleFormSubmit = async (data) => {
    try {
      onSubmit(data);
    } catch (error) {
      console.error('Error submitting lead:', error);
      throw error;
    }
  };

  // Initialize select values when editing
  useEffect(() => {
    if (lead) {
      setValue('source', lead.source || 'website');
      setValue('status', lead.status || 'New');
    }
  }, [lead, setValue]);

  // Form event handler
  const handleFormEvent = handleSubmit(handleFormSubmit);

  // Check if email exists in leads
  const emailExists = (email) => {
    return leads.some((existingLead) => 
      existingLead.email.toLowerCase() === email.toLowerCase() && 
      (!isEdit || existingLead.id !== lead?.id)
    );
  };

  // Initialize select values when editing
  useEffect(() => {
    if (lead) {
      setValue('source', lead.source || 'website');
      setValue('status', lead.status || 'New');
    }
  }, [lead, setValue]);

  const handleDateChange = (e) => {
    const date = e.target.value;
    setValue('nextFollowupDate', date || null);
  };

  return (
    <Dialog 
      open={true} 
      onClose={onCancel} 
      maxWidth="sm" 
      fullWidth
      ref={dialogRef}
      aria-modal="true"
      aria-labelledby="lead-form-dialog-title"
      aria-describedby="lead-form-dialog-description"
      PaperProps={{
        role: 'dialog',
        'aria-modal': 'true'
      }}
    >
      <DialogTitle id="lead-form-dialog-title">
        {isEdit ? 'Edit Lead' : 'Add New Lead'}
      </DialogTitle>
      <form onSubmit={handleFormEvent} tabIndex="-1">
        <DialogContent id="lead-form-dialog-description">
          <TextField
            fullWidth
            label="Name"
            margin="normal"
            {...register('name')}
            error={!!errors.name}
            helperText={errors.name?.message}
          />
          <TextField
            fullWidth
            label="Email"
            margin="normal"
            type="email"
            {...register('email')}
            error={!!errors.email}
            helperText={errors.email?.message}
          />
          <TextField
            fullWidth
            label="Company"
            margin="normal"
            {...register('company')}
            error={!!errors.company}
            helperText={errors.company?.message}
          />
          <FormControl fullWidth margin="normal">
            <InputLabel>Source</InputLabel>
            <Select
              {...register('source', {
                required: 'Source is required',
                validate: (value) => ['website', 'referral', 'trade-show', 'other'].includes(value) || 'Invalid source'
              })}
              error={!!errors.source}
            >
              <MenuItem value="website">Website</MenuItem>
              <MenuItem value="referral">Referral</MenuItem>
              <MenuItem value="trade-show">Trade Show</MenuItem>
              <MenuItem value="other">Other</MenuItem>
            </Select>
            {errors.source && (
              <FormHelperText error>{errors.source.message}</FormHelperText>
            )}
          </FormControl>
          <FormControl fullWidth margin="normal">
            <InputLabel>Status</InputLabel>
            <Select
              {...register('status', {
                required: 'Status is required',
                validate: (value) => ['New', 'Contacted', 'Qualified', 'Won', 'Lost'].includes(value) || 'Invalid status'
              })}
              error={!!errors.status}
            >
              <MenuItem value="New">New</MenuItem>
              <MenuItem value="Contacted">Contacted</MenuItem>
              <MenuItem value="Qualified">Qualified</MenuItem>
              <MenuItem value="Won">Won</MenuItem>
              <MenuItem value="Lost">Lost</MenuItem>
            </Select>
            {errors.status && (
              <FormHelperText error>{errors.status.message}</FormHelperText>
            )}
          </FormControl>
          <TextField
            fullWidth
            label="Assigned To"
            margin="normal"
            {...register('assignedTo')}
            error={!!errors.assignedTo}
            helperText={errors.assignedTo?.message}
          />
          <TextField
            fullWidth
            label="Deal Amount ($)"
            margin="normal"
            type="number"
            inputProps={{
              step: '0.01',
              min: 0
            }}
            {...register('dealAmount')}
            error={!!errors.dealAmount}
            helperText={errors.dealAmount?.message}
          />
          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField
              fullWidth
              label="Win Probability %"
              margin="normal"
              type="number"
              inputProps={{
                min: 0,
                max: 100,
                step: 5
              }}
              {...register('winProbability', {
                valueAsNumber: true,
                setValueAs: value => value === '' ? null : Number(value)
              })}
              error={!!errors.winProbability}
              helperText={errors.winProbability?.message}
            />
            <TextField
              fullWidth
              label="Expected Close Date"
              margin="normal"
              type="date"
              InputLabelProps={{
                shrink: true,
              }}
              {...register('expectedCloseDate', {
                valueAsDate: true,
                setValueAs: val => val ? new Date(val) : null
              })}
              error={!!errors.expectedCloseDate}
              helperText={errors.expectedCloseDate?.message}
              InputProps={{
                inputProps: {
                  min: new Date().toISOString().split('T')[0]
                }
              }}
            />
          </Box>
          <TextField
            fullWidth
            label="Next Follow-up Date"
            margin="normal"
            type="date"
            InputLabelProps={{
              shrink: true,
            }}
            {...register('nextFollowupDate', { 
              valueAsDate: true,
              setValueAs: val => val ? new Date(val) : null,
              value: lead?.nextFollowupDate ? new Date(lead.nextFollowupDate) : new Date()
            })}
            error={!!errors.nextFollowupDate}
            helperText={errors.nextFollowupDate?.message}
            InputProps={{
              inputProps: {
                min: new Date().toISOString().split('T')[0]
              }
            }}
          />
          <TextField
            fullWidth
            label="Notes"
            margin="normal"
            multiline
            rows={4}
            {...register('notes')}
            error={!!errors.notes}
            helperText={errors.notes?.message}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onCancel}>Cancel</Button>
          <Button type="submit" variant="contained" color="primary">
            {isEdit ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default LeadForm;
