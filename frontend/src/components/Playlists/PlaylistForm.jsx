import React, { useEffect, useState } from 'react';
import { Modal, TextInput, Textarea, Button, Group, MultiSelect, LoadingOverlay } from '@mantine/core';
import { DatePicker } from '@mantine/dates';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const TaskForm = ({ opened, onClose, onSubmit, action, task }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState(new Date());
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (task) {
      setTitle(task.title || '');
      setDescription(task.description || '');
      setDueDate(task.dueDate ? new Date(task.dueDate) : new Date());
      setSelectedCategories(task.categories || []);
    }
  }, [task]);

  const fetchCategories = async () => {
    const token = localStorage.getItem('jwt');

    try {
      const response = await fetch(`${API_BASE_URL}/categories`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      setCategories(data);
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleSubmit = () => {
    const taskData = {
      title,
      description,
      dueDate: dueDate.toISOString(),
      categories: selectedCategories,
      status: 'incomplete',
    };

    onSubmit(taskData);
    onClose();
  };

  return (
    <Modal opened={opened} onClose={onClose} title={action + " Task"}>
      <LoadingOverlay visible={isLoading} loaderProps={{ children: 'Loading...' }} />

      <TextInput label="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
      <Textarea label="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
      <DatePicker label="Due Date" value={dueDate} onChange={setDueDate} />
      <MultiSelect
        label="Categories"
        data={categories.map((cat) => ({ value: cat._id, label: cat.name }))}
        value={selectedCategories}
        onChange={setSelectedCategories}
        placeholder="Select categories"
      />
      <Group position="right" mt="md">
        <Button variant="default" onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit}>{action}</Button>
      </Group>
    </Modal>
  );
};

export default TaskForm;