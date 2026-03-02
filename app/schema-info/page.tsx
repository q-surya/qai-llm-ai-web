'use client';

import React, { useCallback, useState, useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  TextField,
  Typography,
  CircularProgress,
  Alert,
  Snackbar,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Link from 'next/link';
import {
  searchSchemaContext,
  createSchemaContext,
  updateSchemaContext,
  deleteSchemaContext,
} from '@/services/embeddingsApi';
import type { SchemaContextEmbedding } from '@/types';

function SchemaRecordCard({
  record,
  onEdit,
  onDelete,
}: {
  record: SchemaContextEmbedding;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const similarity = record.similarity ?? 0;
  const content = record.content ?? record.text ?? '';
  return (
    <Card
      sx={{
        bgcolor: 'background.paper',
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 2,
      }}
    >
      <CardContent sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, '&:last-child': { pb: 2 } }}>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography variant="body1" sx={{ wordBreak: 'break-word' }}>
            {content}
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
            Similarity: {(similarity * 100).toFixed(2)}%
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 0.5, flexShrink: 0 }}>
          <IconButton size="small" onClick={onEdit} aria-label="Edit" sx={{ color: 'primary.main' }}>
            <EditIcon fontSize="small" />
          </IconButton>
          <IconButton size="small" onClick={onDelete} aria-label="Delete" sx={{ color: 'error.main' }}>
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Box>
      </CardContent>
    </Card>
  );
}

export default function SchemaInfoPage() {
  const [items, setItems] = useState<SchemaContextEmbedding[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [editText, setEditText] = useState('');
  const [createText, setCreateText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [snackbar, setSnackbar] = useState<{ message: string; severity: 'success' | 'error' } | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchLoading, setSearchLoading] = useState(false);

  const loadList = useCallback(async (query: string = '') => {
    setError(null);
    try {
      const data = await searchSchemaContext(query, 50);
      setItems(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load');
      setItems([]);
    }
  }, []);

  useEffect(() => {
    const q = searchQuery.trim();
    const t = setTimeout(async () => {
      setSearchLoading(true);
      setError(null);
      try {
        const data = await searchSchemaContext(q || '', 50);
        setItems(data);
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Search failed');
        setItems([]);
      } finally {
        setSearchLoading(false);
      }
    }, q ? 300 : 0);
    return () => clearTimeout(t);
  }, [searchQuery]);

  const handleCreateOpen = () => {
    setCreateText('');
    setCreateOpen(true);
  };

  const handleCreateSubmit = async () => {
    if (!createText.trim()) return;
    setSubmitting(true);
    try {
      await createSchemaContext(createText.trim());
      setCreateOpen(false);
      setCreateText('');
      await loadList(searchQuery);
      setSnackbar({ message: 'Record created', severity: 'success' });
    } catch (e) {
      setSnackbar({
        message: e instanceof Error ? e.message : 'Create failed',
        severity: 'error',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditOpen = (record: SchemaContextEmbedding) => {
    setEditId(record.id);
    setEditText(record.content ?? record.text ?? '');
    setEditOpen(true);
  };

  const handleEditSubmit = async () => {
    if (editId == null || !editText.trim()) return;
    setSubmitting(true);
    try {
      await updateSchemaContext(editId, editText.trim());
      setEditOpen(false);
      setEditId(null);
      setEditText('');
      await loadList(searchQuery);
      setSnackbar({ message: 'Record updated', severity: 'success' });
    } catch (e) {
      setSnackbar({
        message: e instanceof Error ? e.message : 'Update failed',
        severity: 'error',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteClick = (id: string) => setDeleteConfirm(id);

  const handleDeleteConfirm = async () => {
    if (!deleteConfirm) return;
    setSubmitting(true);
    try {
      await deleteSchemaContext(deleteConfirm);
      setDeleteConfirm(null);
      await loadList(searchQuery);
      setSnackbar({ message: 'Record deleted', severity: 'success' });
    } catch (e) {
      setSnackbar({
        message: e instanceof Error ? e.message : 'Delete failed',
        severity: 'error',
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box
      sx={{
        height: '100vh',
        overflow: 'auto',
        overflowX: 'hidden',
      }}
    >
    <Container maxWidth="md" sx={{ py: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
        <IconButton
          component={Link}
          href="/"
          aria-label="Back to home"
          sx={{ color: 'text.primary' }}
        >
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h5" fontWeight="bold" sx={{ flex: 1 }}>
          Schema Info
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleCreateOpen}
          sx={{
            borderRadius: 2,
            textTransform: 'none',
            background: 'linear-gradient(135deg, #6D5CFF 0%, #B44BFF 100%)',
            '&:hover': {
              background: 'linear-gradient(135deg, #5844E0 0%, #9F33E6 100%)',
            },
          }}
        >
          Create
        </Button>
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
        <TextField
          placeholder="Search schema context…"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          size="small"
          sx={{
            width: '100%',
            maxWidth: 420,
            '& .MuiOutlinedInput-root': {
              borderRadius: 2,
              bgcolor: 'background.paper',
            },
          }}
          InputProps={{
            sx: { color: 'text.primary' },
          }}
        />
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {searchLoading && items.length === 0 ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
          <CircularProgress sx={{ color: 'primary.main' }} />
        </Box>
      ) : items.length === 0 ? (
        <Typography color="text.secondary" textAlign="center" py={4}>
          {searchQuery.trim() ? `No results for "${searchQuery.trim()}"` : 'No schema context records. Click Create to add one.'}
        </Typography>
      ) : (
        <>
          {searchLoading && (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
              <CircularProgress size={24} sx={{ color: 'primary.main' }} />
            </Box>
          )}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {items.map((record) => (
              <SchemaRecordCard
                key={record.id}
                record={record}
                onEdit={() => handleEditOpen(record)}
                onDelete={() => handleDeleteClick(record.id)}
              />
            ))}
          </Box>
        </>
      )}

      {/* Create dialog */}
      <Dialog open={createOpen} onClose={() => !submitting && setCreateOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Create record</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Text"
            fullWidth
            multiline
            minRows={2}
            value={createText}
            onChange={(e) => setCreateText(e.target.value)}
            disabled={submitting}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCreateOpen(false)} disabled={submitting}>
            Cancel
          </Button>
          <Button onClick={handleCreateSubmit} variant="contained" disabled={submitting || !createText.trim()}>
            {submitting ? <CircularProgress size={24} /> : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit dialog */}
      <Dialog open={editOpen} onClose={() => !submitting && setEditOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Edit record</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Text"
            fullWidth
            multiline
            minRows={2}
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            disabled={submitting}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditOpen(false)} disabled={submitting}>
            Cancel
          </Button>
          <Button onClick={handleEditSubmit} variant="contained" disabled={submitting || !editText.trim()}>
            {submitting ? <CircularProgress size={24} /> : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete confirm dialog */}
      <Dialog open={!!deleteConfirm} onClose={() => !submitting && setDeleteConfirm(null)}>
        <DialogTitle>Delete record?</DialogTitle>
        <DialogContent>
          <Typography>This cannot be undone.</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirm(null)} disabled={submitting}>
            Cancel
          </Button>
          <Button onClick={handleDeleteConfirm} color="error" variant="contained" disabled={submitting}>
            {submitting ? <CircularProgress size={24} color="inherit" /> : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={!!snackbar}
        autoHideDuration={4000}
        onClose={() => setSnackbar(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setSnackbar(null)}
          severity={snackbar?.severity ?? 'info'}
          variant="filled"
        >
          {snackbar?.message}
        </Alert>
      </Snackbar>
    </Container>
    </Box>
  );
}
