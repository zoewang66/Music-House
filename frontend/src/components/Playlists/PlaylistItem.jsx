import { useState } from 'react';
import { Card, Text, Button } from '@mantine/core';
import TaskForm from './PlaylistForm';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const TaskItem = ({ task, setTasks }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [modalOpen, setModalOpened] = useState(false); // Manage modal open state

  const handleCancel = () => {
    setModalOpened(false); // Close the modal on cancel
  };

  const handleEditClick = () => {
    setModalOpened(true); // Open modal on edit click
  };

  const updateTask = async (taskData) => {
    const token = localStorage.getItem('jwt');

    try {
      const response = await fetch(`${API_BASE_URL}/tasks/${task._id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(taskData)
      });

      if (!response.ok) {
        throw new Error('Failed to update task');
      }

      const updatedTask = await response.json(); // Await JSON parsing properly

      setTasks((prevTasks) =>
        prevTasks.map((t) => (t._id === task._id ? updatedTask : t))
      );

      setModalOpened(false); // Correct function name
    } catch (err) {
      console.error(err);
    }
  };


  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <>
        <Text fw={500}>{task.title}</Text>
        <Text c="dimmed">{task.description}</Text>
        <Text c="dimmed">Due: {new Date(task.dueDate).toLocaleDateString()}</Text>
        <Text c="dimmed">
          Categories: {task.categories.map((category) => category.name).join(', ')}
        </Text>

        <Button mt="sm" size="xs" onClick={handleEditClick}>
          Edit
        </Button>

        {modalOpen ?
          <TaskForm
            action="Edit"
            task={task}
            opened={modalOpen}
            onSubmit={updateTask}
            onClose={handleCancel}
            setTasks={setTasks} // Pass down the setTasks function
            setIsEditing={setIsEditing}
          />
          : <></>
        }
      </>
    </Card>
  );
};

export default TaskItem;
