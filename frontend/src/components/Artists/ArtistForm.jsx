// CategoryForm.js
import React, { useState, useEffect } from 'react';
import { Modal, TextInput, Button, Group } from '@mantine/core';

const CategoryForm = ({ opened, onClose, isUpdateMode, selectedCategory, onCreate, onUpdate }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (isUpdateMode && selectedCategory) {
      setName(selectedCategory.name);
      setDescription(selectedCategory.description);
    }
  }, [isUpdateMode, selectedCategory]);

  const handleSubmit = () => {
    const categoryData = { name, description };
    if (isUpdateMode) {
      onUpdate(categoryData);
    } else {
      onCreate(categoryData);
    }
    onClose();
  };

  return (
    <Modal opened={opened} onClose={onClose} title={isUpdateMode ? 'Update Category' : 'Create Category'}>
      <TextInput label="Name" value={name} onChange={(e) => setName(e.target.value)} />
      <TextInput label="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
      <Group position="right" mt="md">
        <Button variant="default" onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit}>{isUpdateMode ? 'Update' : 'Create'}</Button>
      </Group>
    </Modal>
  );
};

export default CategoryForm;
